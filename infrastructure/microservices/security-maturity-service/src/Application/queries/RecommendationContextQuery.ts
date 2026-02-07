import { AlertCategory } from "../../Domain/enums/AlertCategory";
import { MaturityLevel } from "../../Domain/enums/MaturityLevel";
import { TrendMetricType } from "../../Domain/enums/TrendMetricType";
import { TrendPeriod } from "../../Domain/enums/TrendPeriod";
import { KpiSnapshot } from "../../Domain/models/KpiSnapshot";
import { parseAlertCategory } from "../../Domain/parsers/parseAlertCategory";
import { NOT_FOUND } from "../../Domain/constants/Sentinels";
import { IKpiAggregationService } from "../../Domain/services/IKpiAggregationService";
import { IKpiRepositoryService } from "../../Domain/services/IKpiRepositoryService";
import { mapScoreToLevel } from "../../Infrastructure/utils/MapScoreToLevel";
import { RecommendationContextAvg7dDto } from "../../Domain/types/recommendationContext/RecommendationContextAvg7dDto";
import { RecommendationContextLatestDto } from "../../Domain/types/recommendationContext/RecommendationContextLatestDto";
import { RecommendationContextSeriesPointDto } from "../../Domain/types/recommendationContext/RecommendationContextSeriesPointDto";
import { RecommendationContextIncidentsByCategoryDto } from "../../Domain/types/recommendationContext/RecommendationContextIncidentsByCategoryDto";
import { IRecommendationContextQuery } from "../contracts/IRecommendationContextQuery";

export class RecommendationContextQuery implements IRecommendationContextQuery {
  private readonly repo: IKpiRepositoryService;
  private readonly agg: IKpiAggregationService;

  public constructor(repo: IKpiRepositoryService, agg: IKpiAggregationService) {
    this.repo = repo;
    this.agg = agg;
  }

  public async getLatest(fromUtc: Date, toUtc: Date): Promise<RecommendationContextLatestDto> {
    const snapshots = await this.repo.getSnapshots(fromUtc, toUtc);

    const score = this.agg.weightedAverageMetric(snapshots, TrendMetricType.SMS);
    const maturity =
      score === NOT_FOUND ? MaturityLevel.UNKNOWN : mapScoreToLevel(score);

    return {
      mttd_minutes: this.agg.weightedAverageMetric(snapshots, TrendMetricType.MTTD),
      mttr_minutes: this.agg.weightedAverageMetric(snapshots, TrendMetricType.MTTR),
      false_alarm_rate: this.agg.weightedAverageMetric(snapshots, TrendMetricType.FALSE_ALARM_RATE),
      score_value: score,
      maturity_level: maturity
    };
  }

  public async getAvg(period: TrendPeriod): Promise<RecommendationContextAvg7dDto> {
    const { from, to } = this.resolvePeriod(period);
    const snapshots = await this.repo.getSnapshots(from, to);

    let totalAlerts = 0;
    for (const s of snapshots) totalAlerts += s.totalAlerts;

    return {
      mttd_minutes: this.agg.weightedAverageMetric(snapshots, TrendMetricType.MTTD),
      mttr_minutes: this.agg.weightedAverageMetric(snapshots, TrendMetricType.MTTR),
      false_alarm_rate: this.agg.weightedAverageMetric(snapshots, TrendMetricType.FALSE_ALARM_RATE),
      total_alerts: snapshots.length === 0 ? NOT_FOUND : totalAlerts
    };
  }

  public async getSeries(period: TrendPeriod): Promise<RecommendationContextSeriesPointDto[]> {
    const { from, to, bucket } = this.resolvePeriod(period);
    const snapshots = await this.repo.getSnapshots(from, to);

    if (bucket === "hour") {
      return snapshots.map(s => ({
        fromUtc: s.windowFrom.toISOString(),
        mttd: this.agg.resolveMetricValue(s, TrendMetricType.MTTD),
        mttr: this.agg.resolveMetricValue(s, TrendMetricType.MTTR),
        far: this.agg.resolveMetricValue(s, TrendMetricType.FALSE_ALARM_RATE),
        score: this.agg.resolveMetricValue(s, TrendMetricType.SMS),
        total: s.totalAlerts
      }));
    }


    const grouped: Record<string, KpiSnapshot[]> = {};
    for (const s of snapshots) {
      const dayKey = s.windowFrom.toISOString().slice(0, 10);
      (grouped[dayKey] ??= []).push(s);
    }

    const days = Object.keys(grouped).sort();
    const result: RecommendationContextSeriesPointDto[] = [];

    for (const day of days) {
      const items = grouped[day];

      let totalAlerts = 0;
      for (const it of items) totalAlerts += it.totalAlerts;

      result.push({
        fromUtc: `${day}T00:00:00.000Z`,
        mttd: this.agg.weightedAverageMetric(items, TrendMetricType.MTTD),
        mttr: this.agg.weightedAverageMetric(items, TrendMetricType.MTTR),
        far: this.agg.weightedAverageMetric(items, TrendMetricType.FALSE_ALARM_RATE),
        score: this.agg.weightedAverageMetric(items, TrendMetricType.SMS),
        total: items.length === 0 ? NOT_FOUND : totalAlerts
      });
    }

    return result;
  }

  public async getIncidentsByCategory(
    period: TrendPeriod
  ): Promise<RecommendationContextIncidentsByCategoryDto[]> {
    const { from, to } = this.resolvePeriod(period);
    const counts = await this.repo.getCategoryCounts(from, to);

    const aggregated: Partial<Record<AlertCategory, number>> = {};
    for (const c of counts) {
      const cat = parseAlertCategory(c.category);
      aggregated[cat] = (aggregated[cat] ?? 0) + c.count;
    }

    return (Object.entries(aggregated) as Array<[AlertCategory, number]>)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }

  private resolvePeriod(period: TrendPeriod) {
    const now = new Date();

    const toHour = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      0, 0, 0
    ));

    if (period === TrendPeriod.D7) {
      return {
        from: new Date(toHour.getTime() - 7 * 24 * 60 * 60 * 1000),
        to: toHour,                 
        bucket: "day" as const
      };
    }


    return {
      from: new Date(toHour.getTime() - 24 * 60 * 60 * 1000),
      to: toHour,
      bucket: "hour" as const
    };
  }
}
