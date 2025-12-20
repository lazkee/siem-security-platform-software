import { EventDTO } from "../DTOs/EventDTO";
import { Event } from "../models/Event";

export interface IEventsService {
    createEvent(event: EventDTO): Promise<EventDTO>;
    getAll(): Promise<Event[]>;
    getById(id: number): Promise<EventDTO>;
    deleteById(id: number): Promise<boolean>;
    deleteOldEvents(expiredIds:Number[]): Promise<boolean>;
    getMaxId():Promise<EventDTO>;
    getEventsFromId1ToId2(fromId: number, toId: number): Promise<Event[]>
    getSortedEventsByDate(): Promise<Event[]>
    getEventPercentagesByEvent(): Promise<Number[]>
}
