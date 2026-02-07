import express from 'express';
import cors from 'cors';
import "reflect-metadata";
import dotenv from "dotenv";
import { initialize_mysql_database } from './Database/InitializeConnection';
import { Anomaly } from './Domain/models/Anomaly';
import { MySQLDb } from './Database/DbConnectionPool';
import { Repository } from 'typeorm';
import { ILoggerService } from './Domain/services/ILoggerService';
import { LoggerService } from './Services/LoggerService';
import { IUEBAQueryService } from './Domain/services/IUEBAQueryService';
import { UEBAQueryService } from './Services/UEBAQueryService';
import { IUEBAAnalysisEngineService } from './Domain/services/IUEBAAnalysisEngineService';
import { UEBAAnalysisEngineService } from './Services/UEBAAnalysisEngineService';
import { IUEBAAnalysisService } from './Domain/services/IUEBAAnalysisService';
import { UEBAAnalysisService } from './Services/UEBAAnalysisService';
import { UEBAController } from './WebAPI/controllers/UEBAController';
dotenv.config({ quiet: true });

// App initialization
const app = express();

// CORS Configuration
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["GET", "POST", "PUT", "DELETE"];

app.use(cors({ origin: corsOrigin, methods: corsMethods }));
app.use(express.json());

// Database Initialization
initialize_mysql_database();

//Repo
const suspiciousBehaviorRepository: Repository<Anomaly> = MySQLDb.getRepository(Anomaly);

//Services
const loggerService: ILoggerService = new LoggerService();
const queryService: IUEBAQueryService = new UEBAQueryService();
const analysisService: IUEBAAnalysisEngineService = new UEBAAnalysisEngineService();
const uebaService: IUEBAAnalysisService = new UEBAAnalysisService(queryService, analysisService, loggerService, suspiciousBehaviorRepository);

//Controllers
const uebaController = new UEBAController(uebaService, loggerService);

// Routing
app.use("/api/v1", uebaController.getRouter());

  
export default app;