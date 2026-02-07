import { ServiceStatusDTO } from "../../models/status-monitor/ServiceStatusDTO";
import { IncidentDTO } from "../../models/status-monitor/IncidentDTO";
import { ServiceStatsDTO } from "../../models/status-monitor/ServiceStatsDTO";
import { SystemHealthDTO } from "../../models/status-monitor/SystemHealthDTO";

export interface IStatusMonitorAPI {
    getOverallStatus(token: string): Promise<ServiceStatusDTO[]>;
    getAllIncidents(token: string): Promise<IncidentDTO[]>;
    getServiceStats(serviceName: string, hours: number, token: string): Promise<ServiceStatsDTO>;
    getSystemHealth(token: string): Promise<SystemHealthDTO>;
}
