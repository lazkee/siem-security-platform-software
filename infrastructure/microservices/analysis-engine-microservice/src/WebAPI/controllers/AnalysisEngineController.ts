import { Router } from "express";
import { IAnalysisEngineService } from "../../Domain/services/IAnalysisEngineService";


export class AnalysisEngineController {

    private readonly router: Router;

    constructor(private readonly analysisEngineService: IAnalysisEngineService){
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {

        
    }

    public getRouter(): Router{
        return this.router;
    }
}