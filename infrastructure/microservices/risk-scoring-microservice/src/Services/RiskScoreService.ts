import { AxiosInstance } from "axios";
import { RiskEntityType } from "../Domain/enums/RiskEntityType";
import { IRiskScoreService } from "../Domain/services/IRiskScoreService";
import { createAxiosClient } from "../Utils/Helpers/AxiosClient";
import { ILoggerService } from "../Domain/services/ILoggerService";
import { Between, MoreThanOrEqual, Repository } from "typeorm";
import { SecurityMetrics } from "../Domain/models/SecurityMetrics";
import { processInBatches } from "../Utils/Helpers/ProcessInBatches";

export class RiskScoreService implements IRiskScoreService {
    private readonly queryClient: AxiosInstance;

    constructor(
        private readonly logger?: ILoggerService,
        private readonly metricsRepo?: Repository<SecurityMetrics>
    )
    {
        this.queryClient = createAxiosClient(process.env.QUERY_SERVICE_API ?? "");
    }

    public async calculateScore(entityType: RiskEntityType, entityId: string, hours: number): Promise<number> {
        if (!this.metricsRepo) return 0;    

        try {
            const [
                totalEventResp,
                errorEventResp,
                eventRateResp,
                alertsResp,
                anomalyResp,
                burstResp,
                uniqueServicesResp,
                uniqueIpsResp
            ] = await Promise.all([
                this.queryClient.get<number>("/query/statistics/totalEventCount", { params: { entityType, entityId } }),
                this.queryClient.get<number>("/query/statistics/errorEventCount", { params: { entityType, entityId, hours } }),
                this.queryClient.get<number>("/query/statistics/eventRate", { params: { entityType, entityId, hours } }),
                this.queryClient.get<Record<string, number>>("/query/statistics/alertsCountBySeverity", { params: { entityType, entityId } }),
                this.queryClient.get<number>("/query/statistics/anomalyRate", { params: { entityType, entityId, hours } }),
                this.queryClient.get<boolean>("/query/statistics/burstAnomaly", { params: { entityType, entityId, hours } }),
                this.queryClient.get<number>("/query/statistics/uniqueServicesCount", { params: { entityType, entityId } }),
                this.queryClient.get<number>("/query/statistics/uniqueIpsCount", { params: { entityType, entityId } })
            ]);

            const totalEventCount = totalEventResp.data;
            const errorEventCount = errorEventResp.data;
            const eventRate = eventRateResp.data;
            const alertsBySeverity = alertsResp.data;
            const anomalyRate = anomalyResp.data;
            const burstAnomaly = burstResp.data;
            const uniqueServiceCount = uniqueServicesResp.data;
            const uniqueIpCount = uniqueIpsResp.data;

            // maksimalni score je 100
            let score = 0;

            score += Math.min(totalEventCount / 100, 20);             // ukupni broj dogadjaja -> najvise 20 poena
            score += Math.min(errorEventCount / 5, 20);              // greske -> najvise 20 poena
            score += Math.min(eventRate * 5, 15);                    // event rate -> najvise 15 poena
            score += (alertsBySeverity.CRITICAL || 0) * 15;          // kritični alerti -> 15 poena svaki
            score += Math.min(anomalyRate * 10, 20);                 // anomaly rate -> najvise 20 poena
            score += burstAnomaly ? 5 : 0;                           // burst anomaly -> 5 poena
            score += Math.min(uniqueServiceCount || 0, 3);           // unique services -> najvise 3 poena
            score += Math.min(uniqueIpCount || 0, 2);                // unique IPs -> najvise 2 poena

            score = Math.min(score, 100); // ogranicavamo na 100


            // dodajemo u bazu
            const metric = this.metricsRepo.create({
                entityType,
                entityId,
                totalEventCount,
                errorEventCount,
                eventRate,
                alertsBySeverity: {
                    LOW: alertsBySeverity.LOW || 0,
                    MEDIUM: alertsBySeverity.MEDIUM || 0,
                    HIGH: alertsBySeverity.HIGH || 0,
                    CRITICAL: alertsBySeverity.CRITICAL || 0,
                },
                anomalyRate,
                burstAnomaly,
                uniqueServiceCount,
                uniqueIpCount,
                createdAt: new Date(),
                riskScore: score
            });

            await this.metricsRepo.save(metric);

            return score;
        } catch (err) {
            this.logger?.log(`Error while calculating risk score: ${err}`);
            return 0;
        }
    }

    public async getLatestScore(entityType: RiskEntityType, entityId: string): Promise<number | null> {
        if (!this.metricsRepo) return null;

        const latestMetric = await this.metricsRepo.findOne({
            where: { entityType, entityId },
            order: { createdAt: "DESC" }
        });

        return latestMetric?.riskScore ?? null;
    }

    public async getScoreHistory(entityType: RiskEntityType, entityId: string, hours: number): Promise<{ score: number, createdAt: Date }[]> {
        if (!this.metricsRepo) return [];

        const since = new Date(Date.now() - hours * 60 * 60 * 1000);

        if (hours === 24)
        {
            const history = await this.metricsRepo.find({
                where: {
                    entityType,
                    entityId,
                    createdAt: MoreThanOrEqual(since),
                },
                order: { createdAt: "ASC" }
            });

            return history.map(h => ({ score: h.riskScore, createdAt: h.createdAt }));
        }

        const raw = await this.metricsRepo
            .createQueryBuilder("m")
            .select("DATE(m.createdAt)", "day")
            .addSelect("AVG(m.riskScore)", "avgScore")
            .where("m.entityType = :entityType", { entityType })
            .andWhere("m.entityId = :entityId", { entityId })
            .andWhere("m.createdAt >= :since", { since })
            .groupBy("DATE(m.createdAt)")
            .orderBy("day", "ASC")
            .getRawMany();

        return raw.map(r => ({
            score: Math.round(Number(r.avgScore)),
            createdAt: new Date(r.day),
        }));
    }   

    public async getGlobalScore(): Promise<number> {
        if (!this.metricsRepo) return 0;

        const latestPerEntity = await this.metricsRepo
            .createQueryBuilder("m")
            .select("m.entityType")
            .addSelect("m.entityId")
            .addSelect("MAX(m.createdAt)", "latest")
            .groupBy("m.entityType")
            .addGroupBy("m.entityId")
            .getRawMany();
        
        let scores: number[] = [];

        for (const e of latestPerEntity)
        {
            const metric = await this.metricsRepo.findOne({
                where: {
                    entityType: e.entityType,
                    entityId: e.entityId,
                    createdAt: e.latest
                }
            });
            if (metric) scores.push(metric.riskScore);
        }

        if (scores.length === 0) return 0;

        // global score - za ceo sistem - racunamo kao prosek
        // poslednjih score-ova svih entiteta u sistemu
        return Math.round(scores.reduce((a,b) => a+b, 0) / scores.length);
    }

    public async calculateAll(): Promise<void> {
        try {
            const distinctIpsResp = await this.queryClient.get<string[]>("/query/statistics/uniqueIps");
            const distinctServicesResp = await this.queryClient.get<string[]>("/query/statistics/uniqueServices");

            const distinctIps = distinctIpsResp?.data ?? [];
            const distinctServices = distinctServicesResp?.data ?? [];

            const batchSize = 10; // paralelno 10 entiteta

            // IP adrese
            await processInBatches(distinctIps, batchSize, async (ip) => {
                await this.calculateScore(RiskEntityType.IP_ADDRESS, ip, 1);
            });

            // Servisi
            await processInBatches(distinctServices, batchSize, async (service) => {
                await this.calculateScore(RiskEntityType.SERVICE, service, 1);
            });

            //this.logger?.log(`calculateAll finished successfully for ${distinctIps.length} IPs and ${distinctServices.length} services.`);
        } catch (err) {
            this.logger?.log(`Error in calculateAll: ${err}`);
        }
    }

}