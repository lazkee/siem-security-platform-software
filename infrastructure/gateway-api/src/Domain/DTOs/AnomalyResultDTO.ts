export interface AnomalyResultDTO {
  title: string;
  description: string;
  correlatedAlerts: number[];
  alertTimestamps?: Date[];
  userId?: string | null;
  userRole?: string | null;
  createdAt?: Date;
  avgAlertsPerDay?: number;
}
