import { EventDTO } from "./EventDTO";

export class EventsResultDTO{
    total!: number;
    data!: EventDTO[];
    page!: number;
    limit!: number;
}