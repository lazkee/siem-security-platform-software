import { EventDTO } from "../DTOs/EventDTO";

export interface IParserService {
    normalizeAndSaveEvent(
        eventMessage: string, 
        eventSource: string, 
        ipAddress?: string,
        userId?: number,
        userRole?: string
    ): Promise<EventDTO>;
}