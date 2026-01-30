import { Router, Request, Response } from "express";
import { ICorrelationService } from "../../Domain/services/ICorrelationService";
import { ILLMChatAPIService } from "../../Domain/services/ILLMChatAPIService";
import { validateRecommendationContextDto } from "../validators/validateRecommendationContext";

export class AnalysisEngineController {

    private readonly router: Router;

    constructor(private readonly correlationService: ICorrelationService, private readonly llmChatAPIService: ILLMChatAPIService) {
        this.router = Router();
        this.initializeRoutes();
    }

    public getRouter(): Router {
        return this.router;
    }

    private initializeRoutes(): void {
        this.router.post("/AnalysisEngine/processEvent", this.processEvent.bind(this));
        this.router.post("/AnalysisEngine/recommendations", this.getRecommendations.bind(this));
    }


    private async getRecommendations(req: Request, res: Response): Promise<void> {
        try {
            const contextDto = req.body;
            const validation = validateRecommendationContextDto(contextDto);
            if (!validation.ok) {
                //dodati logera
                console.log("Invalid RecommendationContextDto:", validation.error);
                res.status(400).json({ error: validation.error });
                return;
            }
            
            const recommendations = await this.llmChatAPIService.sendRecommendationsPrompt(validation.value);

            res.status(200).json(recommendations);
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }

    private async processEvent(req: Request, res: Response): Promise<void> {
        try {
            const rawMessage = req.body.message as string;

             if (!rawMessage || rawMessage.trim().length === 0) {
                 res.status(400).json({ error: "Message is required" });
                 return;
            }

            const processedEventJson = await this.llmChatAPIService.sendNormalizationPrompt(rawMessage);
            
            res.status(200).json({ eventData: processedEventJson });
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    }


}
