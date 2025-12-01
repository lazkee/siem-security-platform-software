import { Repository } from "typeorm";
import { ParserEvent } from "../Domain/models/ParserEvent";
import { IParserRepositoryService } from "../Domain/services/IParserRepositoryService";

export class ParserRepositoryService implements IParserRepositoryService {
    constructor(private parserEventRepository: Repository<ParserEvent>) { }

    async getAll(): Promise<ParserEvent[]> {
        const events = await this.parserEventRepository.find();
        return events;
    }

    async getParserEventById(id: number): Promise<ParserEvent> {
        const event = await this.parserEventRepository.findOne({ where: { parserId: id } });
        if (!event) {
            throw new Error(`Parser Event with id=${id} not found.`);
        }
        return event;
    }

    async deleteById(id: number): Promise<boolean> {
        const result = await this.parserEventRepository.delete({ parserId: id })
        return result.affected !== undefined && result.affected !== null && result.affected > 0;
    }
}