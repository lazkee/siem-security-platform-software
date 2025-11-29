import { EventDTO } from "../DTOs/EventDTO";
import { Event } from "../models/Event";

export interface IEventsService {
    createEvent(event: EventDTO): Promise<EventDTO>;
    getAll(): Promise<Event[]>;
    getById(id: number): Promise<Event>;
    deleteById(id: number): Promise<boolean>;
    deleteOldEvents(): Promise<boolean>;
}
