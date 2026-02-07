export interface ServiceStats {
    uptime: number;
    avgResponseTime: number;
    errorRate: number;
}

export interface SystemHealth {
    systemUptime: number;
    activeIncidents: number;
}


export interface IAnalyticsService {
    get30DayHistory(serviceName: string): Promise<Array<{ date: string; hasIncident: boolean; incidentCount: number }>>;
    calculateStats(serviceName: string, hours: number): Promise<ServiceStats>;
    getSystemHealth(): Promise<SystemHealth>;
}