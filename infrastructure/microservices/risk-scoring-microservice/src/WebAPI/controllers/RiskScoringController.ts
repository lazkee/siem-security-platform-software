import { Router, Request, Response } from "express";
import { ILoggerService } from "../../Domain/services/ILoggerService";
import { IRiskScoreService } from "../../Domain/services/IRiskScoreService";
import { RiskEntityType } from "../../Domain/enums/RiskEntityType";

export class RiskScoringController {
  private readonly router: Router;

  constructor(
    private readonly riskScoreService: IRiskScoreService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
      this.router.post("/riskScore/calculate", this.calculateScore.bind(this));
      this.router.get("/riskScore/getLatestScore", this.getLatestScore.bind(this));
      this.router.get("/riskScore/getScoreHistory", this.getScoreHistory.bind(this));
      this.router.get("/riskScore/getGlobalScore", this.getGlobalScore.bind(this));
  }

  private async calculateScore(req: Request, res: Response): Promise<void> {
    try {
      const { entityType, entityId, hours } = req.body;

      const result = await this.riskScoreService.calculateScore(
        entityType as RiskEntityType,
        entityId,
        Number(hours)
      );

      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ message: "Error while calculating risk score." });
    }
  }

  private async getLatestScore(req: Request, res: Response): Promise<void> {
    try {
      const entityType = req.query.entityType as RiskEntityType;
      const entityId = req.query.entityId as string;

      const result = await this.riskScoreService.getLatestScore(entityType, entityId);
      res.status(200).json(result);
    } catch(err) {
      res.status(500).json({message: "Error while retreiving latest risk score."});
    }
  }

  private async getScoreHistory(req: Request, res: Response): Promise<void> {
    try {
      const entityType = req.query.entityType as RiskEntityType;
      const entityId = req.query.entityId as string;
      const hours = Number(req.query.hours);

      const result = await this.riskScoreService.getScoreHistory(entityType, entityId, hours);
      res.status(200).json(result);
    } catch(err) {
      res.status(500).json({message: "Error while retreiving risk score history."});
    }
  }

  private async getGlobalScore(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.riskScoreService.getGlobalScore();
      res.status(200).json(result);
    } catch(err) {
      res.status(500).json({message: "Error while retreiving global risk score."});
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
