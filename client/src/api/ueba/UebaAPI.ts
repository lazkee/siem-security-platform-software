import axios, { AxiosInstance } from 'axios';
import { IUebaAPI } from './IUebaAPI';
import { AnomalyResultDTO } from '../../types/ueba/AnomalyResultDTO';


export class UebaAPI implements IUebaAPI {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_FIREWALL_PROXY_URL,
      headers: { "Content-Type": "application/json" },
      timeout: 120000, // 2 minutes for UEBA analysis
    });
  }

  async analyzeUserBehavior(token: string, userId: number): Promise<AnomalyResultDTO[]> {
    try {
      const response = await this.axiosInstance.post("", {
        url: `anomalies/user/${userId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        data: {},
      });
      return response.data.response;
    } catch (error) {
      console.error('Error analyzing user behavior:', error);
      throw error;
    }
  }

  async analyzeRoleBehavior(token: string, userRole: string): Promise<AnomalyResultDTO[]> {
    try {
      const response = await this.axiosInstance.post("", {
        url: `anomalies/role/${userRole}`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        data: {},
      });
      return response.data.response;
    } catch (error) {
      console.error('Error analyzing role behavior:', error);
      throw error;
    }
  }

  async getAllAnomalies(token: string): Promise<AnomalyResultDTO[]> {
    try {
      const response = await this.axiosInstance.post("", {
        url: "anomalies",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.response;
    } catch (error) {
      console.error('Error fetching all anomalies:', error);
      throw error;
    }
  }

  async getAllUserIds(token: string): Promise<number[]> {
    try {
      const response = await this.axiosInstance.post("", {
        url: "anomalies/userIds",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.response;
    } catch (error) {
      console.error('Error fetching user IDs:', error);
      throw error;
    }
  }

  async getAllRoles(token: string): Promise<string[]> {
    try {
      const response = await this.axiosInstance.post("", {
        url: "anomalies/roles",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.response;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }
}
