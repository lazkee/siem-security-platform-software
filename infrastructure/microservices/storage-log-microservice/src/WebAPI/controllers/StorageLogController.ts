import { Router, Request, Response } from "express";
import { IStorageLogService } from "../../Domain/services/IStorageLogService";

export class StorageLogController{
    private readonly router: Router;

    constructor(
        private readonly storageLogService: IStorageLogService
    ){
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/storageLog", this.getAllArchives.bind(this));
        this.router.post("/storageLog/run", this.runArchiveProcess.bind(this));
        this.router.get("/storageLog/search", this.searchArchives.bind(this));
        this.router.get("/storageLog/sort", this.sortArchives.bind(this));
        this.router.get("/storageLog/stats", this.getStats.bind(this));
        this.router.get("/storageLog/file/:id", this.getArchiveFile.bind(this));
        this.router.get("/storageLog/top", this.getTopArchives.bind(this));
        this.router.get("/storageLog/volume", this.getArchiveVolume.bind(this));
    }

    private async getAllArchives(req: Request, res: Response): Promise<void>{
        try{
            const archives = await this.storageLogService.getArchives();
            res.status(200).json(archives);
        } catch (err){
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async runArchiveProcess(req: Request, res: Response): Promise<void>{
        try{
            const response = await this.storageLogService.runArchiveProcess();
            res.status(200).json(response);
        } catch (err){
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async searchArchives(req: Request, res: Response): Promise<void> {
        try{
            const query = (req.query.q as string) || "";
            const result = await this.storageLogService.searchArchives(query);
            res.status(200).json(result);
        } catch (err){
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async sortArchives(req: Request, res: Response): Promise<void>{
        try{
            const by = req.query.by as "date" | "size" | "name";
            const order = req.query.order as "asc" | "desc";

            const result = await this.storageLogService.sortArchives(by, order);
            res.status(200).json(result);
        } catch (err){
            res.status(500).json({ message: (err as Error).message });
        }
    }

    private async getStats(req: Request, res: Response): Promise<void> {
        try{
            const result = await this.storageLogService.getStats();
            res.status(200).json(result);
        }catch (err){
            res.status(500).json({message: (err as Error).message});
        }
    }  
    
    private async getArchiveFile(req: Request, res: Response): Promise<void>{ 
        try{
            const id = Number(req.params.id);
            const filePath = await this.storageLogService.getArchiveFilePath(id);

            if(!filePath) {
                res.status(404).json({error: "Archive not found"});
                return;
            }

            res.download(filePath);
        }catch(err) {
            res.status(500).json({message: (err as Error).message});
        }
    }

    private async getTopArchives(req: Request, res: Response): Promise<void> {
        try {
            const type = req.query.type as "events" | "alerts";
            const limit = Number(req.query.limit) || 5;
            const result = await this.storageLogService.getTopArchives(type, limit);
            res.status(200).json(result);
        } catch(err) {
            res.status(500).json({message: (err as Error).message});
        }
    }  
    
    private async getArchiveVolume(req: Request, res: Response): Promise<void> {
        try {
            const period = req.query.period as "daily" | "monthly" | "yearly";
            const result = await this.storageLogService.getArchiveVolume(period);
            res.status(200).json(result);
        } catch(err) {
            res.status(500).json({message: (err as Error).message});
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}