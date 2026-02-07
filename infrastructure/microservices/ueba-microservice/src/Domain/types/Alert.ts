import { AlertSeverity } from "../enums/AlertSeverity";
import { AlertStatus } from "../enums/AlertStatus";
import { AlertCategory } from "../enums/AlertCategory";

export interface Alert {
  id: number;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  correlatedEvents: number[];
  source: string;
  detectionRule: string | null;
  category: AlertCategory;
  oldestEventTimestamp: Date;
  createdAt: Date;
  resolvedAt: Date | null;
  resolvedBy: string | null;
  resolutionNotes: string | null;
  ipAddress?: string;
  userId?: number;
  userRole?: string;
}
