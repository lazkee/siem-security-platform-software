import { Router, Request, Response } from "express";
import { IParserService } from "../../Domain/services/IParserService";
export class ParserController {
    private readonly router: Router;

    constructor(
        private readonly parserService: IParserService,
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        //dodati rute
         this.router.get("/parser/normalize", this.getNormalizeMessage.bind(this));
    }

    private async getNormalizeMessage(req: Request, res: Response): Promise<void>{
        try{
            const rawMessage=req.body.message as string;  //drugi tim mora da nam salje json sa message kako bi mi izvukli poruku
            console.log('raw message je'+rawMessage);
            const response=this.parserService.normalizeAndSaveEvent(rawMessage);
            res.status(201).json(response);
        }catch(err){
            res.status(500).json({ message: (err as Error).message });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}