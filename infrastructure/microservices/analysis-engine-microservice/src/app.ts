import express from 'express';
import cors from 'cors';
import "reflect-metadata";
import { initialize_database } from './Database/InitializeConnection';
import dotenv from 'dotenv';
import { IAnalysisEngineService } from './Domain/services/IAnalysisEngineService';
import { AnalysisEngineService } from './Services/AnalysisEngineService';
import { Repository } from 'typeorm';
import { Correlation } from './Domain/models/Correlation';
import { Db } from './Database/DbConnectionPool';
import { CorrelationEventMap } from './Domain/models/CorrelationEventMap';
import { AnalysisEngineController } from './WebAPI/controllers/AnalysisEngineController';

dotenv.config({ quiet: true });

const app = express();

// Read CORS settings from environment
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["POST"];

// Protected microservice from unauthorized access
app.use(cors({
  origin: corsOrigin,
  methods: corsMethods,
}));

app.use(express.json());

initialize_database();

//======================================ANALYSIS ENGINE===========================================

const CorrelationRepo: Repository<Correlation> = Db.getRepository(Correlation);

const CorrelationMapRepo: Repository<CorrelationEventMap> = Db.getRepository(CorrelationEventMap);

const analysisEngineService: IAnalysisEngineService = new AnalysisEngineService(CorrelationRepo, CorrelationMapRepo);

const analysisEngineController = new AnalysisEngineController(analysisEngineService);

app.use('/api/v1', analysisEngineController.getRouter());

export default app;
