import { EventType } from "../enums/EventType";

export interface EventDTO {
    id: number;
    source?: string;
    userId?: string;
    type?: EventType;
    description?: string;
    timestamp?: Date;
    ipAddress?: string;
}

