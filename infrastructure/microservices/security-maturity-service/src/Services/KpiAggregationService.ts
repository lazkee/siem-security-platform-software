import { TrendMetricType } from "../Domain/enums/TrendMetricType";
import { KpiSnapshot } from "../Domain/models/KpiSnapshot";
import { IKpiAggregationService } from "../Domain/services/IKpiAggregationService";
import { NOT_FOUND } from "../Domain/constants/Sentinels";

export class KpiAggregationService implements IKpiAggregationService {

  public resolveMetricValue(snapshot: KpiSnapshot, metric: TrendMetricType): number {
    switch (metric) {
      case TrendMetricType.SMS:
        return snapshot.scoreValue;

      case TrendMetricType.MTTD:
        return snapshot.mttdMinutes;

      case TrendMetricType.MTTR:
        return snapshot.mttrMinutes;

      case TrendMetricType.FALSE_ALARM_RATE:
        return snapshot.totalAlerts === 0 ? NOT_FOUND : snapshot.falseAlarmRate;

      default:
        return NOT_FOUND;
    }
  }

  public weightedAverageMetric(snapshots: KpiSnapshot[], metric: TrendMetricType): number {
    if (snapshots.length === 0) return NOT_FOUND;

    if (metric === TrendMetricType.FALSE_ALARM_RATE) {
      let falseAlarms = 0;
      let totalAlerts = 0;

      for (const s of snapshots) {
        falseAlarms += s.falseAlarms;
        totalAlerts += s.totalAlerts;
      }

      return totalAlerts === 0 ? NOT_FOUND : falseAlarms / totalAlerts;
    }

    let weightedSum = 0;
    let weightSum = 0;

    for (const s of snapshots) {
      const value = this.resolveMetricValue(s, metric);
      if (value === NOT_FOUND) continue;

      const w = this.resolveWeight(s, metric);
      if (w <= 0) continue;

      weightedSum += value * w;
      weightSum += w;
    }

    return weightSum === 0 ? NOT_FOUND : weightedSum / weightSum;
  }

  public sumSampleCount(snapshots: KpiSnapshot[], metric: TrendMetricType): number {
    let sum = 0;

    for (const s of snapshots) {
      const c = this.resolveSampleCount(s, metric);
      if (c > 0) sum += c;
    }

    return sum === 0 ? NOT_FOUND : sum;
  }

  private resolveWeight(snapshot: KpiSnapshot, metric: TrendMetricType): number {
    switch (metric) {
      case TrendMetricType.MTTD:
        return snapshot.mttdSampleCount;

      case TrendMetricType.MTTR:
        return snapshot.mttrSampleCount;

      case TrendMetricType.SMS:
        return snapshot.totalAlerts;

      default:
        return 0;
    }
  }

  private resolveSampleCount(snapshot: KpiSnapshot, metric: TrendMetricType): number {
    switch (metric) {
      case TrendMetricType.MTTD:
        return snapshot.mttdSampleCount;

      case TrendMetricType.MTTR:
        return snapshot.mttrSampleCount;

      case TrendMetricType.FALSE_ALARM_RATE:
        return snapshot.totalAlerts;

      case TrendMetricType.SMS:
        return snapshot.totalAlerts;

      default:
        return 0;
    }
  }
}
