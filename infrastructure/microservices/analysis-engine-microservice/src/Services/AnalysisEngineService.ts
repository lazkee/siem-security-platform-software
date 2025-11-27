import { Repository } from "typeorm";
import { IAnalysisEngineService } from "../Domain/services/IAnalysisEngineService";
import { Correlation } from "../Domain/models/Correlation";
import { CorrelationEventMap } from "../Domain/models/CorrelationEventMap";


export class AnalysisEngineService implements IAnalysisEngineService {

    constructor(private analysisEngineCorrelationRepo: Repository<Correlation>, private analysisEngineCorrelationEventMap: Repository<CorrelationEventMap>){
        
    }

}