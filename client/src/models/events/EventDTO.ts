export type EventType = "INFO" | "WARNING" | "ERROR";

export interface EventDTO {
  id: number;
  source: string;
  type: EventType;
  description: string;
  timestamp: string;
}