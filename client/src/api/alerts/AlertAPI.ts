import axios, { AxiosInstance } from "axios";
import { IAlertAPI } from "./IAlertAPI";
import { AlertDTO } from "../../models/alerts/AlertDTO";
import { AlertQueryDTO, PaginatedAlertsDTO } from "../../models/alerts/AlertQueryDTO";

export class AlertAPI implements IAlertAPI {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
      headers: { "Content-Type": "application/json" },
    });
  }

  async getAllAlerts(token: string): Promise<AlertDTO[]> {
    const response = await this.client.get<AlertDTO[]>("/siem/alerts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getAlertById(id: number, token: string): Promise<AlertDTO> {
    const response = await this.client.get<AlertDTO>(`/siem/alerts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
  
  async searchAlerts(query: AlertQueryDTO, token: string): Promise<PaginatedAlertsDTO> {
    const response = await this.client.get<PaginatedAlertsDTO>("/siem/alerts/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: query
    });
    return response.data;
  }

  async resolveAlert(id: number, resolvedBy: string, status: string, token: string): Promise<AlertDTO> {
    const response = await this.client.put<AlertDTO>(`/siem/alerts/${id}/resolve`, 
      { resolvedBy, status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  async updateAlertStatus(id: number, status: string, token: string): Promise<AlertDTO> {
    const response = await this.client.put<AlertDTO>(`/siem/alerts/${id}/status`, 
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
}