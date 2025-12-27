import { Alert } from "../models/Alert";
// u IQueryAlertRepositoryService su metode za rad sa bazom podataka

export interface IQueryAlertRepositoryService{
    getAllAlerts(): Promise<Alert[]>
}