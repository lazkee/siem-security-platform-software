import { EventDTO } from "../Domain/DTOs/EventDTO";

export class JsonConverter {
    public static convertEventsToJson(events: EventDTO[]): string {
        try {
            return JSON.stringify(events);
        } catch (error) {
            console.error(error);
            return JSON.stringify([]); 
        }
    }
}