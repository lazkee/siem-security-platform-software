import { AlertDTO } from "../DTOs/AlertDTO";

export interface IUEBAQueryService {
    getAlertsByUserId(userId: number): Promise<AlertDTO[]>;
    getAlertsByUserRole(userRole: string): Promise<AlertDTO[]>;
    getAllUserIds(): Promise<number[]>;
    getAllRoles(): Promise<string[]>;
}
