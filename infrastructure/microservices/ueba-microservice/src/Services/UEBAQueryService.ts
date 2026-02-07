import { AxiosInstance } from "axios";
import { IUEBAQueryService } from "../Domain/services/IUEBAQueryService";
import { createAxiosClient } from "../Utils/AxiosClient";
import { AlertDTO } from "../Domain/DTOs/AlertDTO";

export class UEBAQueryService implements IUEBAQueryService {
    private readonly queryClient: AxiosInstance;

    constructor() {
        this.queryClient = createAxiosClient(process.env.QUERY_SERVICE_API ?? "");
    }

    async getAlertsByUserId(userId: number): Promise<AlertDTO[]> {
        try {
            const response = await this.queryClient.get<AlertDTO[]>(`/query/alerts/user/${userId}`);
            return response.data;
        } catch (err) {
            console.error(`[UEBA] Error fetching alerts for user ${userId}:`, err);
            return [];
        }
    }

    async getAlertsByUserRole(userRole: string): Promise<AlertDTO[]> {
        try {
            const response = await this.queryClient.get<AlertDTO[]>(`/query/alerts/role/${userRole}`);
            return response.data;
        } catch (err) {
            console.error(`[UEBA] Error fetching alerts for role ${userRole}:`, err);
            return [];
        }
    }

    async getAllUserIds(): Promise<number[]> {
        try {
            const response = await this.queryClient.get<{ userIds: number[] }>("/query/userIds");
            console.log(response)
            return response.data.userIds;
        } catch (err) {
            console.error("[UEBA] Error fetching user IDs from Query Service:", err);
            return [];
        }
    }

    async getAllRoles(): Promise<string[]> {
        try {
            const response = await this.queryClient.get<{ roles: string[] }>("/query/roles");
            return response.data.roles;
        } catch (err) {
            console.error("[UEBA] Error fetching roles from Query Service:", err);
            return [];
        }
    }

    private parseDate(value: string | Date | undefined | null): Date | null {
        if (!value) return null;
        const date = value instanceof Date ? value : new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }
}
