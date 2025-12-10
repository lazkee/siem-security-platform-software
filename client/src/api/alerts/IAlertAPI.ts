import { AlertDTO } from "../../models/alerts/AlertDTO";
import { AlertQueryDTO, PaginatedAlertsDTO } from "../../models/alerts/AlertQueryDTO";

export interface IAlertAPI {
  getAllAlerts(token: string): Promise<AlertDTO[]>;
  getAlertById(id: number, token: string): Promise<AlertDTO>;
  searchAlerts(query: AlertQueryDTO, token: string): Promise<PaginatedAlertsDTO>;
  resolveAlert(id: number, resolvedBy: string, status: string, token: string): Promise<AlertDTO>;
  updateAlertStatus(id: number, status: string, token: string): Promise<AlertDTO>;
}