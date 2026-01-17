import { EventDTO } from "../DTOs/EventDTO";

export interface IParserService {
    normalizeAndSaveEvent(eventMessage: string, eventSource: string, ipAddress?: string): Promise<EventDTO>;
}