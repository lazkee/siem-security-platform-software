import { Router, Request, Response } from "express";
import { ILoggerService } from "../../Domain/services/ILoggerService";

export class RiskScoringController {
  private readonly router: Router;

  constructor(
    private readonly logger: ILoggerService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {

  }

  public getRouter(): Router {
    return this.router;
  }
}
