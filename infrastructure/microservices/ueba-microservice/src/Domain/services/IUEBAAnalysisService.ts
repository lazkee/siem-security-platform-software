import { AnomalyResultDTO } from "../DTOs/AnomalyResultDTO";


export interface IUEBAAnalysisService {
    analyzeUserBehavior(userId: number): Promise<AnomalyResultDTO[]>;
    analyzeRoleBehavior(userRole: string): Promise<AnomalyResultDTO[]>;
    getAllAnomalies(): Promise<AnomalyResultDTO[]>;
    getAllUserIds(): Promise<number[]>;
    getAllRoles(): Promise<string[]>;
}
