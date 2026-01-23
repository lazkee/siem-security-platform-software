import axios, { AxiosInstance, AxiosResponse } from "axios";
import { IBackupValidationAPI } from "./IBackupValdationAPI";
import { BackupValidationLogDTO } from "../../models/backup/BackupValidationLogDTO";
import { BackupValidationResultDTO } from "../../models/backup/BackupValidationResultDTO";
import { BackupHealthDTO } from "../../models/backup/BackupHealthDTO";
import { BackupStatsDTO } from "../../models/backup/BackupStatsDTO";

export class BackupValidationAPI implements IBackupValidationAPI {
    private readonly axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_FIREWALL_PROXY_URL,
            headers: { "Content-Type": "application/json" },
            timeout: 30000,
        });
    }

    async runValidation(): Promise<boolean> {
        const response: AxiosResponse = await this.axiosInstance.post("", {
            url: "backup/validate",
            method: "POST",
        });
        
        return response.data.response;
    }

    async getAllLogs(/*token: string*/): Promise<BackupValidationLogDTO[]> {
        const response: AxiosResponse = await this.axiosInstance.post("", {
            url: "backup/logs",
            method: "GET",
        });

        return response.data.response;
    }

    async getLastValidation(/*token: string*/): Promise<BackupValidationLogDTO | null> {
        const response: AxiosResponse = await this.axiosInstance.post("", {
            url: "backup/last",
            method: "GET",
        });

        return response.data.response;
    }
    
    async getSummary(/*token: string*/): Promise<BackupValidationResultDTO> {
        const response: AxiosResponse = await this.axiosInstance.post("", {
            url: "backup/summary",
            method: "GET",
        });

        return response.data.response;
    }

    async getHealth(/*token: string*/): Promise<BackupHealthDTO> {
        const response: AxiosResponse = await this.axiosInstance.post("", {
            url: "backup/health",
            method: "GET",
        });

        return response.data.response;
    }

    async getStats(rangeDays: number): Promise<BackupStatsDTO[]> {
        const response: AxiosResponse = await this.axiosInstance.post("", {
            url: "backup/stats",
            method: "GET",
            params: { range: rangeDays },
        });

        return response.data.response;
    }
}