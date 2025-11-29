import { IQueryService } from "../Domain/services/IQueryService";

export class QueryService implements IQueryService {
    constructor(
    ) {}

    searchEvents(query: string): Promise<any[]> {
        // TODO:
        // prvo pozovemo getAllEvents iz IQueryRepositoryService
        // onda filtriramo rezultate na osnovu query stringa
        // i na kraju vracamo filtrirane rezultate
        throw new Error("Method not implemented.");
    }
    
}