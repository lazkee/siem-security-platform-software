import { AxiosInstance } from "axios";
import { IUEBAAnalysisEngineService } from "../Domain/services/IUEBAAnalysisEngineService";
import { createAxiosClient } from "../Utils/AxiosClient";
import { SuspiciousBehaviorDTO } from "../Domain/DTOs/SuspiciousBehaviorDTO";
import { AnomalyResultDTO } from "../Domain/DTOs/AnomalyResultDTO";

export class UEBAAnalysisEngineService implements IUEBAAnalysisEngineService {
    private readonly analysisClient: AxiosInstance;

    constructor() {
        this.analysisClient = createAxiosClient(process.env.ANALYSIS_ENGINE_API ?? "", 30000);
    }

    async detectAnomaliesByUser(anomalyInput: SuspiciousBehaviorDTO): Promise<AnomalyResultDTO[]> {
        try {
            const response = await this.analysisClient.post<AnomalyResultDTO[]>("/anomalies/detect-by-user", anomalyInput);
            return response.data;
        } catch (err) {
            console.error(`[UEBA] Error detecting anomalies for user ${anomalyInput.userId}:`, err);
            return [];
        }
    }

    async detectAnomaliesByRole(anomalyInput: SuspiciousBehaviorDTO): Promise<AnomalyResultDTO[]> {
        try {
            const response = await this.analysisClient.post<AnomalyResultDTO[]>("/anomalies/detect-by-role", anomalyInput);
            return response.data;
        } catch (err) {
            console.error(`[UEBA] Error detecting anomalies for role ${anomalyInput.userRole}:`, err);
            return [];
        }
    }
}
