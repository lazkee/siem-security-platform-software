import axios, { AxiosInstance, AxiosResponse } from "axios";
import { FirewallRuleDTO } from "../../types/firewall/FirewallRuleDTO";
import { FirewallModeDTO } from "../../types/firewall/FirewallModeDTO";
import { FirewallTestDTO } from "../../types/firewall/FirewallTestDTO";
import { FirewallLogDTO } from "../../types/firewall/FirewallLogDTO";
import { IFirewallAPI } from "./IFirewallAPI";

export class FirewallAPI implements IFirewallAPI {
    private readonly axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_FIREWALL_URL,
            headers: { "Content-Type": "application/json" },
            timeout: 30000,
        });
    }

    // =============== RULES ===============
    async getAllRules(): Promise<FirewallRuleDTO[]> {
        const response: AxiosResponse = await this.axiosInstance.get("/firewall/rules");
        return response.data;
    }

    async addRule(ipAddress: string, port: number): Promise<FirewallRuleDTO> {
        const response: AxiosResponse = await this.axiosInstance.post("/firewall/rules", { ipAddress, port });
        return response.data;
    }

    async deleteRule(id: number): Promise<{ success: boolean }> {
        const response: AxiosResponse = await this.axiosInstance.delete(`/firewall/rules/${id}`);
        return response.data;
    }

    // =============== MODE ===============
    async getMode(): Promise<FirewallModeDTO> {
        const response: AxiosResponse = await this.axiosInstance.get("/firewall/mode");
        return response.data;
    }

    async setMode(mode: "WHITELIST" | "BLACKLIST"): Promise<FirewallModeDTO & { success: boolean }> {
        const response: AxiosResponse = await this.axiosInstance.put("/firewall/mode", { mode });
        return response.data;
    }

    // =============== TEST CONNECTION ===============
    async testConnection(ipAddress: string, port: number): Promise<FirewallTestDTO> {
        const response: AxiosResponse = await this.axiosInstance.get("/firewall/testConnection", {
            params: { ipAddress, port },
        });
        return response.data;
    }

    // =============== LOGS ===============
    async getAllLogs(): Promise<FirewallLogDTO[]> {
        const response: AxiosResponse = await this.axiosInstance.get("/firewall/logs");
        return response.data;
    }
}