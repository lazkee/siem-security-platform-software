import { Router, Request, Response } from "express";
import { IQueryStatisticsService } from "../../Domain/services/IQueryStatisticsService";
import { RiskEntityType } from "../../Domain/enums/RiskEntityType";


export class QueryStatisticsController {
    private readonly router: Router;

    constructor(
        private readonly queryStatisticsService: IQueryStatisticsService) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/query/statistics/totalEventCount", this.getTotalEventCount.bind(this));
        this.router.get("/query/statistics/errorEventCount", this.getErrorEventCount.bind(this));
        this.router.get("/query/statistics/eventRate", this.getEventRate.bind(this));
        this.router.get("/query/statistics/alertsCountBySeverity", this.getAlertsCountBySeverity.bind(this));
        this.router.get("/query/statistics/criticalAlertsCount", this.getCriticalAlertsCount.bind(this));
        this.router.get("/query/statistics/anomalyRate", this.getAnomalyRate.bind(this));
        this.router.get("/query/statistics/burstAnomaly", this.getBurstAnomaly.bind(this));
        this.router.get("/query/statistics/uniqueServicesCount", this.getUniqueServicesCount.bind(this));
        this.router.get("/query/statistics/uniqueIpsCount", this.getUniqueIpsCount.bind(this));
        this.router.get("/query/statistics/uniqueServices", this.getUniqueServices.bind(this));
        this.router.get("/query/statistics/uniqueIps", this.getUniqueIps.bind(this));
    }

    private async getTotalEventCount(req: Request, res: Response): Promise<void> {
        try {
            const entityType = req.query.entityType as RiskEntityType;
            const entityId = req.query.entityId as string;

            const result = await this.queryStatisticsService.getTotalEventCount(entityType, entityId);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving total event count for statistics." });
        }
    }

    private async getErrorEventCount(req: Request, res: Response): Promise<void> {
        try {
            const entityType = req.query.entityType as RiskEntityType;
            const entityId = req.query.entityId as string;
            const hours = Number(req.query.hours);

            const result = await this.queryStatisticsService.getErrorEventCount(entityType, entityId, hours);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving error event count for statistics." });
        }
    }

    private async getEventRate(req: Request, res: Response): Promise<void> {
        try {
            const eventRate = await this.queryStatisticsService.getEventRate(
                req.query.entityType as RiskEntityType,
                req.query.entityId as string, 
                Number(req.query.hours)
            );
            res.status(200).json(eventRate);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving event rate for statistics." });
        }
    }

    private async getAlertsCountBySeverity(req: Request, res: Response): Promise<void> {
        try {
            const entityType = req.query.entityType as RiskEntityType;
            const entityId = req.query.entityId as string;

            const result = await this.queryStatisticsService.getAlertsCountBySeverity(entityType, entityId);
            res.status(200).json(Object.fromEntries(result));
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving alerts count by severity for statistics." });
        }
    }

    private async getCriticalAlertsCount(req: Request, res: Response): Promise<void> {
        try {
            const entityType = req.query.entityType as RiskEntityType;
            const entityId = req.query.entityId as string;

            const result = await this.queryStatisticsService.getCriticalAlertsCount(entityType, entityId);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving critical alerts count for statistics." });
        }
    }

    private async getAnomalyRate(req: Request, res: Response): Promise<void> {
        try {
            const entityType = req.query.entityType as RiskEntityType;
            const entityId = req.query.entityId as string;
            const hours = Number(req.query.hours);

            const result = await this.queryStatisticsService.getAnomalyRate(entityType, entityId, hours);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving anomaly rate for statistics." });
        }
    }

    private async getBurstAnomaly(req: Request, res: Response): Promise<void> {
        try {
            const entityType = req.query.entityType as RiskEntityType;
            const entityId = req.query.entityId as string;
            const hours = Number(req.query.hours);

            const result = await this.queryStatisticsService.getBurstAnomaly(entityType, entityId, hours);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving burst anomaly for statistics." });
        }
    }

    private async getUniqueServicesCount(req: Request, res: Response): Promise<void> {
        try {
            const ipAddress = req.query.ipAddress as string;

            const result = await this.queryStatisticsService.getUniqueServicesCount(ipAddress);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving unique services count for statistics." });
        }
    }

    private async getUniqueIpsCount(req: Request, res: Response): Promise<void> {
        try {
            const serviceName = req.query.serviceName as string;

            const result = await this.queryStatisticsService.getUniqueIpsCount(serviceName);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving unique IP addresses count for statistics." });
        }
    }

    private async getUniqueServices(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.queryStatisticsService.getUniqueServices();
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving unique services for statistics." });
        }
    }

    private async getUniqueIps(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.queryStatisticsService.getUniqueIps();
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving unique IP addresses for statistics." });
        }
    }
    
    public getRouter(): Router {
        return this.router;
    }
}