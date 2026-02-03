import axios, { AxiosInstance } from "axios";
import { IIntegrityGatewayService } from "../../Domain/services/IIntegrityGatewayService";
import { defaultAxiosClient } from "../../Domain/constants/AxiosClient";
import { serviceConfig } from "../../Domain/constants/ServiceConfig";

export class IntegrityGatewayService implements IIntegrityGatewayService {
    private readonly client: AxiosInstance;

    constructor() {
        this.client = axios.create({
          baseURL: serviceConfig.integrity, 
          ...defaultAxiosClient
        });
    }

    async getStatus(): Promise<any> {
        const response = await this.client.post<any>(`/integrity/status`);
        return response.data;
    }

    async getCompromised(): Promise<any> {
        const response = await this.client.get<any>(`/integrity/compromised`);
        return response.data;
    }

    async verify(): Promise<any> {
        const response = await this.client.post<any>(`/integrity/verify`);
        return response.data;
    }
}