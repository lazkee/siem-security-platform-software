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

    public getRouter(): Router {
        return this.router;
    }
}