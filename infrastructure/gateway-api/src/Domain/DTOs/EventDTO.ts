import { EventType } from "../enums/EventType";

export interface EventDTO {
    source: string; 
    timestamp: Date;
    type: EventType;
    description: string;
    userId?: number;     
    userRole?: string;   
}