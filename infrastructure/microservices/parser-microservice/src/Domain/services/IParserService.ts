import { EventDTO } from "../DTOs/EventDTO";

export interface IParserService {
    normalizeAndSaveEvent(eventMessage: string): Promise<EventDTO>;
}