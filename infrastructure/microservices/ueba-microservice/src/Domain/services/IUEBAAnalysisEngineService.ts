import { SuspiciousBehaviorDTO } from "../DTOs/SuspiciousBehaviorDTO";
import { AnomalyResultDTO } from "../DTOs/AnomalyResultDTO";

export interface IUEBAAnalysisEngineService {
    detectAnomaliesByUser(anomalyInput: SuspiciousBehaviorDTO): Promise<AnomalyResultDTO[]>;
    detectAnomaliesByRole(anomalyInput: SuspiciousBehaviorDTO): Promise<AnomalyResultDTO[]>;
}
