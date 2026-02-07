export interface AnomalyResultDTO {
  title: string;
  description: string;
  correlatedAlerts: number[];
  userId?: string | null;
  userRole?: string | null;
  createdAt?: Date;
}
