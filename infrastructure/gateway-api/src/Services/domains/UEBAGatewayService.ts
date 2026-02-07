import axios, { AxiosInstance } from "axios";
import { AnomalyResultDTO } from "../../Domain/DTOs/AnomalyResultDTO";
import { defaultAxiosClient } from "../../Domain/constants/AxiosClient";
import { serviceConfig } from "../../Domain/constants/ServiceConfig";
import { IUEBAGatewayService } from "../../Domain/services/IUEBAGatewayService";

export class UEBAGatewayService implements IUEBAGatewayService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: serviceConfig.ueba,
      ...defaultAxiosClient,
      timeout: 120000, // 2 minutes for UEBA analysis
    });
  }

  async analyzeUserBehavior(userId: number): Promise<AnomalyResultDTO[]> {
  
    const response = await this.client.post<{ suspiciousBehaviors: AnomalyResultDTO[] }>(
      `/ueba/analyze/user/${userId}`,
      {}
    );
    return response.data.suspiciousBehaviors;
  }

  async analyzeRoleBehavior(userRole: string): Promise<AnomalyResultDTO[]> {
    const response = await this.client.post<{ suspiciousBehaviors: AnomalyResultDTO[] }>(
      `/ueba/analyze/role/${userRole}`,
      {}
    );
    return response.data.suspiciousBehaviors;
  }

  async getAllAnomalies(): Promise<AnomalyResultDTO[]> {
    
    const response = await this.client.get<{ anomalies: AnomalyResultDTO[] }>(
      `/ueba/anomalies`
    );
    return response.data.anomalies;
  }

  async getAllUserIds(): Promise<number[]> {
    const response = await this.client.get<{ userIds: number[] }>(
      `/ueba/userIds`
    );
    return response.data.userIds;
  }

  async getAllRoles(): Promise<string[]> {
    const response = await this.client.get<{ roles: string[] }>(
      `/ueba/roles`
    );
    return response.data.roles;
  }
}
