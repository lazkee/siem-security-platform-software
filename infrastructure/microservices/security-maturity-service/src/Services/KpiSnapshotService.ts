import { AxiosInstance } from "axios";
import { IKpiSnapshotService } from "../Domain/services/IKpiSnapshotService";
import { IKpiRepositoryService } from "../Domain/services/IKpiRepositoryService";
import { AlertForKpi } from "../Domain/types/AlertForKpi";
import { ComputedKpi } from "../Domain/types/ComputedKpi";
import { KpiSnapshot } from "../Domain/models/KpiSnapshot";
import { createAxiosClient } from "../Infrastructure/helpers/createAxiosClient";
import { ISecurityMaturityService } from "../Domain/services/ISecurityMaturityService";
import { AlertServiceClient } from "../Infrastructure/clients/AlertServiceClient";
import { diffMinutesNonNegative, isValidDate } from "../Infrastructure/utils/dateUtils";
import { AlertCategory } from "../Domain/enums/AlertCategory";
import { NOT_FOUND } from "../Domain/constants/Sentinels";
import { ILogerService } from "../Domain/services/ILoggerService";

export class KpiSnapshotService implements IKpiSnapshotService {
  private readonly repo: IKpiRepositoryService;
  private readonly alertClient: AxiosInstance;
  private readonly alertServiceClient: AlertServiceClient;
  private readonly smsService: ISecurityMaturityService;
  private readonly loger: ILogerService;

  public constructor(repo: IKpiRepositoryService, smsService: ISecurityMaturityService, loger: ILogerService) {
    this.repo = repo;
    this.alertClient = createAxiosClient(process.env.ALERT_SERVICE_API ?? "");
    this.alertServiceClient = new AlertServiceClient(this.alertClient, loger);
    this.smsService = smsService;
    this.loger = loger;
  }

  public async createSnapshotForWindow(windowFrom: Date, windowTo: Date): Promise<void> {
    if (!this.isValidWindow(windowFrom, windowTo)) {
      this.loger.log("[KpiSnapshotService] Invalid window; snapshot not created.");
      return;
    }

    const alerts = await this.safeFetchAlerts(windowFrom, windowTo);
    const computed = await this.calculateKpis(alerts);
    const snapshot = this.toSnapshotEntity(windowFrom, windowTo, computed);

    const snapshotId = await this.repo.upsertSnapshot(snapshot);
    if (snapshotId === NOT_FOUND) {
      this.loger.log("[KpiSnapshotService] Snapshot upsert failed; categories not written.");
      return;
    }

    const ok = await this.repo.replaceCategoryCounts(snapshotId, computed.categoryCounts);
    if (!ok) {
      this.loger.log("[KpiSnapshotService] Failed to persist category counts.");
    }
  }

  private async calculateKpis(alerts: AlertForKpi[]): Promise<ComputedKpi> {
    const totalAlerts = alerts.length;

    let resolvedAlerts = 0;
    let mttdSum = 0;
    let mttdSampleCount = 0;
    let mttrSum = 0;
    let mttrSampleCount = 0;
    let falseAlarms = 0;

    const categoryCounts: Partial<Record<AlertCategory, number>> = {};

    for (const a of alerts) {
      const category = a.category;
      categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;

      if (a.isFalseAlarm) falseAlarms++;

      if (a.resolvedAt !== undefined) {
        resolvedAlerts++;
        const mttrMin = diffMinutesNonNegative(a.resolvedAt, a.createdAt);
        if (mttrMin >= 0) {
          mttrSum += mttrMin;
          mttrSampleCount++;
        }
      }

      const mttdMin = diffMinutesNonNegative(a.createdAt, a.oldestCorrelatedEventAt);
      if (mttdMin >= 0) {
        mttdSum += mttdMin;
        mttdSampleCount++;
      }
    }

    const openAlerts = totalAlerts - resolvedAlerts;

    const mttdMinutes = mttdSampleCount > 0 ? mttdSum / mttdSampleCount : NOT_FOUND;
    const mttrMinutes = mttrSampleCount > 0 ? mttrSum / mttrSampleCount : NOT_FOUND;
    const falseAlarmRate = totalAlerts > 0 ? falseAlarms / totalAlerts : NOT_FOUND;

    const smsResult = await this.smsService.calculateCurrentMaturity({
      mttdMinutes,
      mttrMinutes,
      falseAlarmRate,
      totalAlerts,
    });

    return {
      mttdMinutes,
      mttrMinutes,
      mttdSampleCount,
      mttrSampleCount,
      totalAlerts,
      resolvedAlerts,
      openAlerts,
      falseAlarms,
      falseAlarmRate,
      scoreValue: smsResult.scoreValue,
      maturityLevel: smsResult.maturityLevel,
      categoryCounts,
    };
  }

  private toSnapshotEntity(windowFrom: Date, windowTo: Date, computed: ComputedKpi): KpiSnapshot {
    const snapshot = new KpiSnapshot();
    snapshot.windowFrom = windowFrom;
    snapshot.windowTo = windowTo;
    snapshot.mttdMinutes = computed.mttdMinutes;
    snapshot.mttrMinutes = computed.mttrMinutes;
    snapshot.mttdSampleCount = computed.mttdSampleCount;
    snapshot.mttrSampleCount = computed.mttrSampleCount;
    snapshot.totalAlerts = computed.totalAlerts;
    snapshot.resolvedAlerts = computed.resolvedAlerts;
    snapshot.openAlerts = computed.openAlerts;
    snapshot.falseAlarms = computed.falseAlarms;
    snapshot.falseAlarmRate = computed.falseAlarmRate;
    snapshot.scoreValue = computed.scoreValue;
    snapshot.maturityLevel = computed.maturityLevel;
    return snapshot;
  }

  private async safeFetchAlerts(from: Date, to: Date): Promise<AlertForKpi[]> {
    try {
      return await this.alertServiceClient.fetchAlerts(from, to);
    } catch (e) {
      this.loger.log("[KpiSnapshotService] Failed to fetch alerts. Using empty set.  " + e);
      return [];
    }
  }

  private isValidWindow(windowFrom: Date, windowTo: Date): boolean {
    return isValidDate(windowFrom) && isValidDate(windowTo) && windowFrom.getTime() < windowTo.getTime();
  }
}
