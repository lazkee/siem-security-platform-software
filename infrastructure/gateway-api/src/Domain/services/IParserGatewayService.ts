import { EventDTO } from "../DTOs/EventDTO";
import { ParserEventDto } from "../DTOs/ParserEventDTO";

export interface IParserGatewayService {
  log(eventMessage: string, eventSource: string, ipAddress?: string, userId?: number,userRole?: string): Promise<EventDTO>;
  getAllParserEvents(): Promise<ParserEventDto[]>;
  getParserEventById(id: number): Promise<ParserEventDto>;
  deleteById(id: number): Promise<boolean>;
}