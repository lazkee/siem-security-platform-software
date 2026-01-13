import { AlertQueryDTO, PaginatedAlertsDTO } from "../DTOs/AlertQueryDTO";

export interface IQueryAlertService{
    searchAlerts(alertQueryDTO: AlertQueryDTO): Promise<PaginatedAlertsDTO>;
}