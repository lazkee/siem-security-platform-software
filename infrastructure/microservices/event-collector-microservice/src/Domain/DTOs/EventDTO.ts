import { EventType } from "../enums/EventType";

export interface EventDTO {
    id: number;
    source?: string;
    userId?: number;    
    userRole?: string;   
    type?: EventType;
    description?: string;
    timestamp?: Date;
    ipAddress?: string;
}