import { Repository } from "typeorm";
import { EventDTO } from "../Domain/DTOs/EventDTO";
import { ParserEvent } from "../Domain/models/ParserEvent";
import { IParserService } from "../Domain/services/IParserService";

export class ParserService implements IParserService {
    constructor(private parserEventRepository: Repository<ParserEvent>) {
        console.log(`\x1b[35m[Logger@1.45.4]\x1b[0m Service started`);
    }
   
    async normalizeEvent(message: string): Promise<Event> {
        throw new Error("Method not implemented.");
    }
    async llmAnalysis(message: string): Promise<Event> {
        throw new Error("Method not implemented.");
    }
    async normalizeAndSaveEvent(message: string): Promise<EventDTO> {
        /*const event=await this.normalizeEvent(message);
        if(event.normlize === -1){ //normlize polje da li je normalizovano ili nije
           const eventLlm= await this.llmAnalysis(normalizeMessage);
           return eventLlm;
        }else{
            -pozvati event service dodati u konstruktoru event service i onda ovde pozvati metodu iz event controller
            - await this.parserEventRepository.insert(event);
        }*/
        throw new Error("Method not implemented.");
    }

    
}