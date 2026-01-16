import express from "express";
import cors from "cors";
import "reflect-metadata";
import dotenv from "dotenv";
import { Repository } from "typeorm";
import { initialize_mysql_database, initialize_alert_database } from "./Database/InitializeConnection";
import { MySQLDb } from "./Database/DbConnectionPool";
import { ILoggerService } from "./Domain/services/ILoggerService";
import { LoggerService } from "./Services/LoggerService";
import { RiskScoringController } from "./WebAPI/controllers/RiskScoringController";

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
initialize_alert_database();

// Repository

// Services
const loggerService: ILoggerService = new LoggerService();

// Controllers
const riskScoringController = new RiskScoringController(loggerService);

// Routing
app.use("/api/v1", riskScoringController.getRouter());

export default app;
