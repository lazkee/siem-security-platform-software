import { Router, Request, Response } from "express";
import { TrendMetricType } from "../../Domain/enums/TrendMetricType";
import { TrendPeriod } from "../../Domain/enums/TrendPeriod";
import { KpiSnapshotQuery } from "../../Application/queries/KpiSnapshotQuery";
import { IKpiSnapshotService } from "../../Domain/services/IKpiSnapshotService";
import { IRecommendationService } from "../../Domain/services/IRecommendationService";
import { ILogerService } from "../../Domain/services/ILoggerService";

export class SecurityMaturityController {
  private readonly router: Router;
  private readonly service: IKpiSnapshotService;
  private readonly recommendationService: IRecommendationService;
  private readonly loger: ILogerService;

  constructor(
    private readonly query: KpiSnapshotQuery,
    service: IKpiSnapshotService,
    recommendationService: IRecommendationService,
    loger: ILogerService
  ) {
    this.router = Router();
    this.service = service;
    this.recommendationService = recommendationService;
    this.loger = loger;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/current", this.getCurrent.bind(this));
    this.router.get("/incidents-by-category", this.getIncidentsByCategory.bind(this));
    this.router.get("/trend", this.getTrend.bind(this));
    this.router.get("/recommendations", this.getRecommendations.bind(this));
  }

  private async getCurrent(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.query.getCurrent();
      res.status(200).json(result);
    } catch (err) {
      this.loger.log("[SecurityMaturityController]: getCurrent failed: " + err);
      res.status(500).json({ message: "Service error" });
    }
  }

 

  private async getIncidentsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const periodRaw = req.query.period;

      if (typeof periodRaw !== "string") {
        res.status(400).json({ message: "Invalid period" });
        return;
      }

      const period = periodRaw as TrendPeriod;

      if (!Object.values(TrendPeriod).includes(period)) {
        res.status(400).json({ message: "Invalid period" });
        return;
      }

      const result = await this.query.getIncidentsByCategory(period);
      res.status(200).json(result);
    } catch (err) {
      this.loger.log("[SecurityMaturityController]: getIncidentsByCategory failed: " + err);
      res.status(500).json({ message: "Service error" });
    }
  }

  private async getTrend(req: Request, res: Response): Promise<void> {
    try {
      const metricRaw = req.query.metric;
      const periodRaw = req.query.period;

      if (typeof metricRaw !== "string") {
        res.status(400).json({ message: "Invalid metric" });
        return;
      }

      if (typeof periodRaw !== "string") {
        res.status(400).json({ message: "Invalid period" });
        return;
      }

      const metric = metricRaw as TrendMetricType;
      const period = periodRaw as TrendPeriod;

      if (!Object.values(TrendMetricType).includes(metric)) {
        res.status(400).json({ message: "Invalid metric" });
        return;
      }

      if (!Object.values(TrendPeriod).includes(period)) {
        res.status(400).json({ message: "Invalid period" });
        return;
      }

      const result = await this.query.getTrend(metric, period);
      res.status(200).json(result);
    } catch (err) {
      this.loger.log("[SecurityMaturityController]: getTrend failed: " + err);
      res.status(500).json({ message: "Service error" });
    }
  }

  private async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const recs = await this.recommendationService.getRecommendations();
      res.status(200).json(recs);
    } catch (err) {
      this.loger.log("[SecurityMaturityController]: getRecommendations failed: " + err);
      res.status(500).json({ message: "Service error" });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
