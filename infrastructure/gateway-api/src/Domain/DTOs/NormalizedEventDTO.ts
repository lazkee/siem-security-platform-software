import { EventType } from "../enums/EventType";
export interface NormalizedEventDTO {
    type: EventType;
    description: string;
}