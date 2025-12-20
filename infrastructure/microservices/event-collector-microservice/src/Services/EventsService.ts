import { Repository } from "typeorm";
import { Event } from "../Domain/models/Event";
import { EventDTO } from "../Domain/DTOs/EventDTO";
import { IEventsService } from "../Domain/services/IEventsService";
import { Between } from "typeorm"
import { EventType } from "../Domain/enums/EventType";
import { toDTO } from "../Utils/Converters/ConvertToDTO";

export class EventsService implements IEventsService {
    constructor(
        private readonly eventRepository: Repository<Event>,
    ) {}


    async getSortedEventsByDate(): Promise<Event[]> {
       return await this.eventRepository.find({
        order: {
            timestamp: "DESC", 
        },
    });
    }
    async getEventPercentagesByEvent(): Promise<Number[]> {
        const total = await this.eventRepository.count();

    if (total === 0) {
        return [0, 0, 0];
    }

    const infoCount = await this.eventRepository.count({
        where: { type: EventType.INFO },
    });

    const warningCount = await this.eventRepository.count({
        where: { type: EventType.WARNING },
    });

    const errorCount = await this.eventRepository.count({
        where: { type: EventType.ERROR },
    });
    //ide procenat za info,warning pa error 
    return [
        (infoCount / total) * 100,
        (warningCount / total) * 100,
        (errorCount / total) * 100,
    ];
    }

   

    async createEvent(eventDto: EventDTO): Promise<EventDTO> {
        const timestamp = eventDto.timestamp ? new Date(eventDto.timestamp) : new Date();

        const entity = this.eventRepository.create({
            source: eventDto.source,
            type: eventDto.type,
            description: eventDto.description,
            timestamp,
        });

        const saved = await this.eventRepository.save(entity);
        return toDTO(saved);
    }

    async getAll(): Promise<Event[]> {
        return this.eventRepository.find();
    }

    async getById(id: number): Promise<EventDTO> {
        const event = await this.eventRepository.findOne({ where: { id } });
        if (!event) {
            const emptyEvent:EventDTO={
                id:-1
            }
            return emptyEvent;
        }
        return event;
    }

    async deleteById(id: number): Promise<boolean> {
        const result = await this.eventRepository.delete({ id:id });
        return !!result.affected && result.affected > 0;
    }

     async deleteOldEvents(oldIds:number[]): Promise<boolean> {
        var deletedOnes = 0;
        for(const id of oldIds){
           var sucessfulDelete= await this.deleteById(id);
           if(sucessfulDelete){
            deletedOnes++
           }
        }
        return deletedOnes > 0
    }
    
    async getMaxId(): Promise<EventDTO> {
        const event = await this.eventRepository.findOne({
        order: { id: "DESC" }
    });
        if (!event) {
             const emptyEvent:EventDTO={
                id:-1
            }
            return emptyEvent;
        }
        return event;
    }
    async getEventsFromId1ToId2(fromId: number, toId: number): Promise<Event[]> {
      return await this.eventRepository.find({
        where: {
            id: Between(fromId, toId)
        },
        order: {
            id: "ASC"
        }
    });
    }

    
}
