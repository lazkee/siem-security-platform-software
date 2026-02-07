import { Request, Response, Router } from "express";
import { IGatewayService } from "../../Domain/services/IGatewayService";
import { requireSysAdmin } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class UEBAGatewayController {
  private readonly router: Router;

  constructor(private readonly gatewayService: IGatewayService, private readonly authenticate: any) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/anomalies/user/:userId",
      // this.authenticate,     // TODO: DELETE COMMENTS AFTER TESTING!
      // requireSysAdmin,
      this.analyzeUserBehavior.bind(this)
    );

    this.router.post(
      "/anomalies/role/:userRole",
      // this.authenticate,
      // requireSysAdmin,
      this.analyzeRoleBehavior.bind(this)
    );

    this.router.get(
      "/anomalies",
      // this.authenticate,
      // requireSysAdmin,
      this.getAllAnomalies.bind(this)
    );

    this.router.get(
      "/anomalies/userIds",
      // this.authenticate,
      // requireSysAdmin,
      this.getAllUserIds.bind(this)
    );

    this.router.get(
      "/anomalies/roles",
      // this.authenticate,
      // requireSysAdmin,
      this.getAllRoles.bind(this)
    );
  }

  private async analyzeUserBehavior(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.userId);
      const results = await this.gatewayService.analyzeUserBehavior(userId);
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async analyzeRoleBehavior(req: Request, res: Response): Promise<void> {
    try {
      const userRole = req.params.userRole;
      const results = await this.gatewayService.analyzeRoleBehavior(userRole);
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async getAllAnomalies(req: Request, res: Response): Promise<void> {
    try {
      const results = await this.gatewayService.getAllAnomalies();
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async getAllUserIds(req: Request, res: Response): Promise<void> {
    try {
      const results = await this.gatewayService.getAllUserIds();
      res.status(200).json({ response: results });
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  private async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const results = await this.gatewayService.getAllRoles();
      res.status(200).json({ response: results });
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
