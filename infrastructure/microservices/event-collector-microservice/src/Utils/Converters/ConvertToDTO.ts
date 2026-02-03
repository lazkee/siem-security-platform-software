import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { Event as EventEntity } from "../../Domain/models/Event";

export function toDTO(event: EventEntity): EventDTO {
  return {
    id: event.id,
    source: event.source,
    userId: event.userId,        
    userRole: event.userRole,    
    type: event.type,
    description: event.description,
    timestamp: event.timestamp,
    ipAddress: event.ipAddress
  };
}