import { Router } from "express";
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
        throw new Error("Method not implemented.");
    }
}