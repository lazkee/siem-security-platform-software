import { AnomalyResultDTO } from "../../types/ueba/AnomalyResultDTO";

export interface IUebaAPI {
  analyzeUserBehavior(token: string, userId: number): Promise<AnomalyResultDTO[]>;
  analyzeRoleBehavior(token: string, userRole: string): Promise<AnomalyResultDTO[]>;
  getAllAnomalies(token: string): Promise<AnomalyResultDTO[]>;
  getAllUserIds(token: string): Promise<number[]>;
  getAllRoles(token: string): Promise<string[]>;
}
