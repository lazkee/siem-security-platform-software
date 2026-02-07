import { AlertDTO } from "./AlertDTO";

export interface SuspiciousBehaviorDTO {
  readonly userId?: number;
  readonly userRole?: string;
  readonly alerts: AlertDTO[];
}
