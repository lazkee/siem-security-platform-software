import { EventDTO } from "../DTOs/EventDTO";

export interface IParserService {
    normalizeAndSaveEvent(eventMessage: string, eventSource: string): Promise<EventDTO>;
}