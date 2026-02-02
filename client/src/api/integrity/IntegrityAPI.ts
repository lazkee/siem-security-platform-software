
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { IIntegrityAPI } from "./IIntegrityAPI";
import { IntegrityReportDTO, IntegrityStatusDTO } from "../../models/interity/IntegrityLogDTO";

export class IntegrityAPI implements IIntegrityAPI {
  private readonly axiosInstance: AxiosInstance;
  private readonly basePath = "integrity";

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_FIREWALL_PROXY_URL, 
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    });
  }

  async getStatus(token: string): Promise<IntegrityStatusDTO> {
    console.log("token: ", token);
    const response: AxiosResponse = await this.axiosInstance.post("", {
      url: `integrity/status`, 
      method: "POST", 
      headers: { 
        "Authorization": `Bearer ${token}`
      },
    });
    console.log("Stiglo sa servera:", response.data);
    return response.data?.response || response.data;
}

  async verifyIntegrity(token: string): Promise<IntegrityReportDTO> {
    const response: AxiosResponse = await this.axiosInstance.post("", {
      url: `integrity/verify`,
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
    });

    return response.data?.response || response.data;
  }

}