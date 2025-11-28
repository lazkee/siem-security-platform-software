import {Repository} from "typeorm";
import { ICorrelationService } from "../Domain/Services/ICorrelationService";
import { Correlation } from "../Domain/models/Correlation";
import { CorrelationEventMap } from "../Domain/models/CorrelationEventMap";
import axios, { AxiosInstance } from "axios";

export class CorrelationService implements ICorrelationService{

    //TODO dogovoriti sa juganom da li da napravimo poseban
    //servis za komunikaciju sa ostalim mikroservisima
    private readonly parserClient: AxiosInstance;
    private readonly alertClient: AxiosInstance;

    constructor(private correlationRepo: Repository<Correlation>, private correlationEventMap: Repository<CorrelationEventMap>) {

        console.log(`\x1b[35m[CorrelationService@1.45.4]\x1b[0m Service started`);

        const parserServiceURL = process.env.PARSER_SERVICE_API;
        const alertServiceURL = process.env.ALERT_SERVICE_API;

        this.parserClient = axios.create({
            baseURL: parserServiceURL,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });

        this.alertClient = axios.create({
            baseURL: alertServiceURL,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
    }
    

    async findCorrelations(): Promise<void> {
        throw new Error("Method not implemented.");
        //na svakih 15 minuta 
        //salje podatke u poslednjih sat vremena
        //LLM vrsi analizu u cilju pronalazenja korelacija
        //mozda ne bi bilo lose za korelacije koristiti 
        //DeepSeek-R1-Distill-Qwen-7B ili neki slican malo jaci model



    }

}