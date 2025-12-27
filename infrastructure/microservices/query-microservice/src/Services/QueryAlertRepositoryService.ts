import { Repository } from "typeorm";
import { Alert } from "../Domain/models/Alert";
import { IQueryAlertRepositoryService } from "../Domain/services/IQueryAlertRepositoryService";

export class QueryAlertRepositoryService implements IQueryAlertRepositoryService {

    constructor(private readonly alertRepository: Repository<Alert>){
        
    }

    getAllAlerts(): Promise<Alert[]> {
        return this.alertRepository.find();
    } 
    
}   