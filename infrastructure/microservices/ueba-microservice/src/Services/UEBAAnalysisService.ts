import { Repository } from "typeorm";
import { IUEBAAnalysisService } from "../Domain/services/IUEBAAnalysisService";
import { IUEBAQueryService } from "../Domain/services/IUEBAQueryService";
import { IUEBAAnalysisEngineService } from "../Domain/services/IUEBAAnalysisEngineService";
import { ILoggerService } from "../Domain/services/ILoggerService";
import { Anomaly } from "../Domain/models/Anomaly";
import { SuspiciousBehaviorDTO } from "../Domain/DTOs/SuspiciousBehaviorDTO";
import { AnomalyResultDTO } from "../Domain/DTOs/AnomalyResultDTO";

export class UEBAAnalysisService implements IUEBAAnalysisService {
    constructor(
        private queryService: IUEBAQueryService,
        private analysisEngineService: IUEBAAnalysisEngineService,
        private logger: ILoggerService,
        private suspiciousBehaviorRepository: Repository<Anomaly>
    ) {}

    async analyzeUserBehavior(userId: number): Promise<AnomalyResultDTO[]> {
        try {
            const alerts = await this.queryService.getAlertsByUserId(userId);
            
            if (alerts.length === 0) {
                return [];
            }

            // Nađi najstariji alert
            let oldestDate: Date | null = null;
            for (const alert of alerts) {
                const date = this.parseDate(alert.createdAt as unknown as string | Date);
                if (date !== null && (oldestDate === null || date < oldestDate)) {
                    oldestDate = date;
                }
            }

            // Izračunaj broj dana i prosek
            let daysDiff = 1;
            if (oldestDate !== null) {
                const today = new Date();
                daysDiff = Math.floor((today.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
            }
            
            const totalAlerts = alerts.length;
            const avgAlertsPerDay = Number((totalAlerts / daysDiff).toFixed(2));

            await this.logger.log(
                `[UEBAAnalysis] User ${userId} baseline: oldest=${oldestDate?.toISOString()}, days=${daysDiff}, total=${totalAlerts}, avgPerDay=${avgAlertsPerDay}`
            );

            const anomalyInput: SuspiciousBehaviorDTO = {
                userId: userId,
                alerts: alerts
            };
            //console.log(anomalyInput)
            const anomalies = await this.analysisEngineService.detectAnomaliesByUser(anomalyInput);
            await this.logger.log(`[UEBAAnalysis] Detected ${anomalies.length} anomalies for user ${userId}`);
            //console.log(anomalies)
            const savedAnomalies: Anomaly[] = [];
            for (const anomaly of anomalies) {
                const behavior = this.suspiciousBehaviorRepository.create({
                    title: anomaly.title,
                    description: anomaly.description,
                    correlatedAlerts: anomaly.correlatedAlerts,
                    userId: anomaly.userId ?? userId.toString(),
                    userRole: anomaly.userRole,
                    createdAt: anomaly.createdAt ?? new Date()
                });
                const saved = await this.suspiciousBehaviorRepository.save(behavior);
                savedAnomalies.push(saved);
            }
            
            return savedAnomalies.map(a => {
                const alertTimestamps = a.correlatedAlerts.map(alertId => {
                    const alert = alerts.find(al => al.id === alertId);
                    return alert ? new Date(alert.createdAt) : new Date();
                });
                console.log("da li dodjes dovde");
                return {
                    title: a.title,
                    description: a.description,
                    correlatedAlerts: a.correlatedAlerts,
                    alertTimestamps: alertTimestamps,
                    userId: a.userId,
                    userRole: a.userRole,
                    createdAt: a.createdAt,
                    avgAlertsPerDay: avgAlertsPerDay
                };
            });
        } catch (err) {
            await this.logger.log(`[UEBAAnalysis] Error analyzing user ${userId}: ${err}`);
            return [];
        }
    }

    async analyzeRoleBehavior(userRole: string): Promise<AnomalyResultDTO[]> {
        try {
            
            const alerts = await this.queryService.getAlertsByUserRole(userRole);

            if (alerts.length === 0) {
              return [];
            }

            // Nađi najstariji alert
            let oldestDate: Date | null = null;
            for (const alert of alerts) {
                const date = this.parseDate(alert.createdAt as unknown as string | Date);
                if (date !== null && (oldestDate === null || date < oldestDate)) {
                    oldestDate = date;
                }
            }

            // Izračunaj broj dana i prosek
            let daysDiff = 1;
            if (oldestDate !== null) {
                const today = new Date();
                daysDiff = Math.floor((today.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
            }
            
            const totalAlerts = alerts.length;
            const avgAlertsPerDay = Number((totalAlerts / daysDiff).toFixed(2));

            const anomalyInput: SuspiciousBehaviorDTO = {
                userRole: userRole,
                alerts: alerts
            };

            
            const anomalies = await this.analysisEngineService.detectAnomaliesByRole(anomalyInput);
            await this.logger.log(`[UEBAAnalysis] Detected ${anomalies.length} anomalies for role ${userRole}`);

           
            const savedAnomalies: Anomaly[] = [];
            for (const anomaly of anomalies) {
                const behavior = this.suspiciousBehaviorRepository.create({
                    title: anomaly.title,
                    description: anomaly.description,
                    correlatedAlerts: anomaly.correlatedAlerts,
                    userId: anomaly.userId,
                    userRole: anomaly.userRole ?? userRole,
                    createdAt: anomaly.createdAt ?? new Date()
                });
                const saved = await this.suspiciousBehaviorRepository.save(behavior);
                savedAnomalies.push(saved);
            }
            
            return savedAnomalies.map(a => {
                const alertTimestamps = a.correlatedAlerts.map(alertId => {
                    const alert = alerts.find(al => al.id === alertId);
                    return alert ? new Date(alert.createdAt) : new Date();
                });

                return {
                    title: a.title,
                    description: a.description,
                    correlatedAlerts: a.correlatedAlerts,
                    alertTimestamps: alertTimestamps,
                    userId: a.userId,
                    userRole: a.userRole,
                    createdAt: a.createdAt,
                    avgAlertsPerDay: avgAlertsPerDay
                };
            });
        } catch (err) {
            await this.logger.log(`[UEBAAnalysis] Error analyzing role ${userRole}: ${err}`);
            return [];
        }
    }

    private parseDate(value: string | Date | undefined | null): Date | null {
        if (!value) return null;
        const date = value instanceof Date ? value : new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    async getAllAnomalies(): Promise<AnomalyResultDTO[]> {
        try {
            const anomalies = await this.suspiciousBehaviorRepository.find();
            
            return anomalies.map(a => ({
                title: a.title,
                description: a.description,
                correlatedAlerts: a.correlatedAlerts,
                alertTimestamps: [],
                userId: a.userId,
                userRole: a.userRole,
                createdAt: a.createdAt,
                avgAlertsPerDay: undefined
            }));
        } catch (err) {
            await this.logger.log(`[UEBAAnalysis] Error fetching all anomalies: ${err}`);
            return [];
        }
    }

    async getAllUserIds(): Promise<number[]> {
        try {
            return await this.queryService.getAllUserIds();
        } catch (err) {
            await this.logger.log(`[UEBAAnalysis] Error fetching user IDs: ${err}`);
            return [];
        }
    }

    async getAllRoles(): Promise<string[]> {
        try {
            return await this.queryService.getAllRoles();
        } catch (err) {
            await this.logger.log(`[UEBAAnalysis] Error fetching roles: ${err}`);
            return [];
        }
    }
}
