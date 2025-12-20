import { EventDTO } from "../../Domain/DTOs/EventDTO";

export function  toDTO(event: any): EventDTO {
        return {
            id: event.id,
            source: event.source,
            type: event.type,
            description: event.description,
            timestamp: event.timestamp,
        };
}