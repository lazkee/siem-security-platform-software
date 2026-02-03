import axios, { AxiosInstance } from "axios";
import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { ParserEventDto } from "../../Domain/DTOs/ParserEventDTO";
import { serviceConfig } from "../../Domain/constants/ServiceConfig";
import { defaultAxiosClient } from "../../Domain/constants/AxiosClient";
import { IParserGatewayService } from "../../Domain/services/IParserGatewayService";

export class ParserGatewayService implements IParserGatewayService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: serviceConfig.parser,
      ...defaultAxiosClient
    });
  }

  async log(eventMessage: string,eventSource: string, ipAddress?: string, userId?: number, userRole?: string): Promise<EventDTO> {
  const response = await this.client.post<EventDTO>("/parserEvents/log", {
    message: eventMessage,
    source: eventSource,
    ipAddress: ipAddress,
    userId: userId,     
    userRole: userRole, 
  });

    return response.data;
  }

  async getAllParserEvents(): Promise<ParserEventDto[]> {
    const response = await this.client.get<ParserEventDto[]>("/parserEvents");
    return response.data;
  }

  async getParserEventById(id: number): Promise<ParserEventDto> {
    const response = await this.client.get<ParserEventDto>(`/parserEvents/${id}`);
    return response.data;
  }

  async deleteById(id: number): Promise<boolean> {
    const response = await this.client.delete<boolean>(`/parserEvents/${id}`);
    return response.data;
  }
}