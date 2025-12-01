import { EventDTO } from "../DTOs/EventDTO";

export type ParseResult = {
    doesMatch: boolean;
    event?: EventDTO;
}