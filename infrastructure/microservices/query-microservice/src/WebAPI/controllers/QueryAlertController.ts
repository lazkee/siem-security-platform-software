import { Router, Request, Response } from "express";
import { IQueryAlertService } from "../../Domain/services/IQueryAlertService";
import { IQueryAlertRepositoryService } from "../../Domain/services/IQueryAlertRepositoryService";

export class QueryAlertContoller{
    private readonly router: Router;

    constructor(
        private readonly queryAlertService: IQueryAlertService,
        private readonly queryAlertRepositoryService: IQueryAlertRepositoryService
    ){
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get("/query/oldAlerts/:hours", this.getOldAlerts.bind(this));
        this.router.get("/query/alerts", this.getAllAlerts.bind(this));
        this.router.post("/query/searchAlerts", this.searchAlerts.bind(this));
        this.router.get("/query/alertsCount", this.getAlertsCount.bind(this));
        this.router.get("/query/alerts/user/:userId", this.getAlertsByUserId.bind(this));
        this.router.get("/query/alerts/role/:userRole", this.getAlertsByUserRole.bind(this));
        this.router.get("/query/userIds", this.getAllUserIds.bind(this));
        this.router.get("/query/roles", this.getAllRoles.bind(this));
    }
    private async getOldAlerts(req: Request, res: Response): Promise<void>{
        try {
            const hours = Number(req.params.hours);
            if (isNaN(hours) || hours <= 0) {
                res.status(400).json({ message: "Invalid hours parameter." });
                return;
            }
            const oldEvents = await this.queryAlertRepositoryService.getOldAlerts(hours);

            res.status(200).json(oldEvents);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving old events." });
        }
    }
     private async getAllAlerts(req: Request, res: Response): Promise<void> {
        try {
            const allAlerts = await this.queryAlertRepositoryService.getAllAlerts();
            res.status(200).json(allAlerts);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving all events." });
        }
    }
    private async searchAlerts(req: Request, res: Response): Promise<void> {
        try {
            const alertQueryDTO = req.body;
            const results = await this.queryAlertService.searchAlerts(alertQueryDTO);
            res.status(200).json(results);
        } catch (err) {
            res.status(500).json({ message: "Error while searching events." });
        }
    }
    private async getAlertsCount(req: Request, res: Response): Promise<void> {
        try {
            const eventsCount = this.queryAlertRepositoryService.getAlertsCount();
            res.status(200).json({ count: eventsCount });
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving events count." });
        }
    }

    private async getAlertsByUserId(req: Request, res: Response): Promise<void> {
        try {
            const userId = Number(req.params.userId);
            if (isNaN(userId) || userId <= 0) {
                res.status(400).json({ message: "Invalid userId parameter." });
                return;
            }
            const alerts = await this.queryAlertRepositoryService.getAlertsByUserId(userId);
            res.status(200).json(alerts);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving alerts by user ID." });
        }
    }

    private async getAlertsByUserRole(req: Request, res: Response): Promise<void> {
        try {
            const userRole = req.params.userRole as string;
            if (!userRole || userRole.trim().length === 0) {
                res.status(400).json({ message: "Invalid userRole parameter." });
                return;
            }
            const alerts = await this.queryAlertRepositoryService.getAlertsByUserRole(userRole);
            res.status(200).json(alerts);
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving alerts by user role." });
        }
    }

    private async getAllUserIds(req: Request, res: Response): Promise<void> {
        try {
            const userIds = await this.queryAlertRepositoryService.getAllUserIds();
            res.status(200).json({ userIds });
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving user IDs." });
        }
    }

    private async getAllRoles(req: Request, res: Response): Promise<void> {
        try {
            const roles = await this.queryAlertRepositoryService.getAllRoles();
            res.status(200).json({ roles });
        } catch (err) {
            res.status(500).json({ message: "Error while retrieving user roles." });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}