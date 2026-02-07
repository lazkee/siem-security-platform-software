import { Router, Request, Response } from "express";
import { IUEBAAnalysisService } from "../../Domain/services/IUEBAAnalysisService";
import { ILoggerService } from "../../Domain/services/ILoggerService";

export class UEBAController {
    private readonly router: Router;

    constructor(
        private readonly uebaAnalysisService: IUEBAAnalysisService,
        private readonly logger: ILoggerService
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/ueba/analyze/user/:userId", this.analyzeUserBehavior.bind(this));
        this.router.post("/ueba/analyze/role/:userRole", this.analyzeRoleBehavior.bind(this));
        this.router.get("/ueba/anomalies", this.getAllAnomalies.bind(this));
        this.router.get("/ueba/userIds", this.getAllUserIds.bind(this));
        this.router.get("/ueba/roles", this.getAllRoles.bind(this));
    }

    public getRouter(): Router {
        return this.router;
    }

    private async analyzeUserBehavior(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.params.userId);

            if (isNaN(userId) || userId <= 0) {
                res.status(400).json({ success: false, message: "Invalid userId parameter." });
                return;
            }

            const results = await this.uebaAnalysisService.analyzeUserBehavior(userId);
            console.log("aaaaaaaaaaaaaaaaa")
            res.status(200).json({
                success: true,
                userId,
                suspiciousBehaviors: results,
                count: results.length
            });
        } catch (err) {
            await this.logger.log(`[UEBAController] Error analyzing user behavior: ${err}`);
            res.status(500).json({ success: false, message: "Error while analyzing user behavior." });
        }
    }

    private async analyzeRoleBehavior(req: Request, res: Response): Promise<void> {
        try {
            const userRole = req.params.userRole as string;

            if (!userRole || userRole.trim().length === 0) {
                res.status(400).json({ success: false, message: "Invalid userRole parameter." });
                return;
            }
            
            const results = await this.uebaAnalysisService.analyzeRoleBehavior(userRole);

            res.status(200).json({
                success: true,
                userRole,
                suspiciousBehaviors: results,
                count: results.length
            });
        } catch (err) {
            await this.logger.log(`[UEBAController] Error analyzing role behavior: ${err}`);
            res.status(500).json({ success: false, message: "Error while analyzing role behavior." });
        }
    }

    private async getAllAnomalies(req: Request, res: Response): Promise<void> {
        try {
            
            const anomalies = await this.uebaAnalysisService.getAllAnomalies();
            
            res.status(200).json({
                success: true,
                anomalies,
                count: anomalies.length
            });
        } catch (err) {
            await this.logger.log(`[UEBAController] Error fetching all anomalies: ${err}`);
            res.status(500).json({ success: false, message: "Error while fetching anomalies." });
        }
    }

    private async getAllUserIds(req: Request, res: Response): Promise<void> {
        try {
            const userIds = await this.uebaAnalysisService.getAllUserIds();
            
            res.status(200).json({
                success: true,
                userIds,
                count: userIds.length
            });
            
        } catch (err) {
            await this.logger.log(`[UEBAController] Error fetching user IDs: ${err}`);
            res.status(500).json({ success: false, message: "Error while fetching user IDs." });
        }
    }

    private async getAllRoles(req: Request, res: Response): Promise<void> {
        try {
            const roles = await this.uebaAnalysisService.getAllRoles();
            
            res.status(200).json({
                success: true,
                roles,
                count: roles.length
            });
        } catch (err) {
            await this.logger.log(`[UEBAController] Error fetching roles: ${err}`);
            res.status(500).json({ success: false, message: "Error while fetching roles." });
        }
    }
}
