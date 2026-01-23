import { Router, Request, Response } from "express";
import { IKpiRepositoryService } from "../../Domain/services/IKpiRepositoryService";
import { TrendMetricType } from "../../Domain/enums/TrendMetricType";
import { TrendPeriod } from "../../Domain/enums/TrendPeriod";

export class SecurityMaturityController {
  private readonly router: Router;

  constructor(private readonly kpiRepository: IKpiRepositoryService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/current", this.getCurrent.bind(this));
    this.router.get(
      "/incidents-by-category",
      this.getIncidentsByCategory.bind(this),
    );
    this.router.get("/trend", this.getTrend.bind(this));
  }

  private async getCurrent(req: Request, res: Response): Promise<void> {
    try {
      const now = new Date();
      const from = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const snapshots = await this.kpiRepository.getSnapshots(from, now);
      const latest = snapshots.at(-1);

      if (!latest) {
        res.status(200).json({ scoreValue: null, maturityLevel: null });
        return;
      }

      res.status(200).json({
        scoreValue: latest?.scoreValue,
        maturityLevel: latest?.maturityLevel,
      });
    } catch (err) {
      console.error(
        "[SecurityMatuirtyController]: failed to fetch current",
        err,
      );
      res.status(500).json({ message: "Service error" });
    }
  }

  private async getIncidentsByCategory(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const period = req.query.period as TrendPeriod;

      const now = new Date();
      const from =
        period === TrendPeriod.D7
          ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          : new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const counts = await this.kpiRepository.getCategoryCounts(from, now);

      const result: Record<string, number> = {};

      for (const c of counts) {
        result[c.category] = (result[c.category] ?? 0) + c.count;
      }

      res.status(200).json(result);
    } catch (err) {
      console.error(
        "[SecurityMaturityController]: failed to fetch incidents",
        err,
      );
      res.status(500).json({ message: "Service error" });
    }
  }

  private async getTrend(req: Request, res: Response): Promise<void> {
    try {
      const metric = req.query.metric as TrendMetricType;
      const period = req.query.period as TrendPeriod;

      const now = new Date();
      const from =
        period === TrendPeriod.D7
          ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          : new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const snapshots = await this.kpiRepository.getSnapshots(from, now);

      const trend = snapshots.map((s) => ({
        bucketStart: s.windowFrom,
        value:
          metric === TrendMetricType.SMS
            ? s.scoreValue
            : metric === TrendMetricType.MTTD
              ? s.mttdMinutes
              : metric === TrendMetricType.MTTR
                ? s.mttrMinutes
                : s.falseAlarmRate,
      }));

      res.status(200).json(trend);
    } catch (err) {
      console.error("[SecurityMaturityController]: failed to fetch trend");
      res.status(500).json({ message: "Service error" });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
