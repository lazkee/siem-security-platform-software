import { EventDTO } from "../DTOs/EventDTO";
import { ParserEvent } from "../models/ParserEvent";

export interface IParserRepositoryService {
    getAll(): Promise<ParserEvent[]>;
    getParserEventById(id: number): Promise<ParserEvent>;
    deleteById(id: number): Promise<boolean>;
}