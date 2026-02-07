import axios, { AxiosInstance, AxiosResponse } from "axios";
import { IIntegrityAPI } from "./IIntegrityAPI";

export class IntegrityAPI implements IIntegrityAPI {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_FIREWALL_PROXY_URL,
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    });
  }

  async verifyLogs(token: string): Promise<any> {
    console.log("da li udje ovde");
    const response: AxiosResponse = await this.axiosInstance.post("", {
      url: `integrity/verify`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  }

  async getCompromisedLogs(token: string): Promise<any[]> {
    const response: AxiosResponse = await this.axiosInstance.post("", {
      url: `integrity/compromised`,
      method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  }
}