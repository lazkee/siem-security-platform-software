// Domain/services/IAnalyticsService.ts
export interface ServiceStats {
    uptime: number;
    avgResponseTime: number;
    errorRate: number;
}

export interface IAnalyticsService {
    calculateStats(serviceName: string, hours: number): Promise<ServiceStats>;
}