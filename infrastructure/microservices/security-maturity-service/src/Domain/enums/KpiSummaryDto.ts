export type KpiSummaryDto = {
  mttdMinutes: number | null;
  mttrMinutes: number | null;
  falseAlarmRate: number | null;

  totalAlerts: number;
  resolvedAlerts: number;
  openAlerts: number;

  categoryCounts: Record<string, number>;

  scoreValue: number | null;
  maturityLevel: string | null;
};