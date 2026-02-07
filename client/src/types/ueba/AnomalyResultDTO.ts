export interface AnomalyResultDTO {
  id?: number;
  title: string;
  description: string;
  correlatedAlerts: number[];
  alertTimestamps?: Date[];
  userId?: number;
  userRole?: string;
  createdAt?: Date;
  avgAlertsPerDay?: number;
}
