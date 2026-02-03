import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from "typeorm";
import { LogHash } from './Domain/models/LogHash.js';
import { IntegrityService } from './Services/IntegrityService.js';
import { IntegrityController } from './WebAPI/controllers/IntegrityController.js';

dotenv.config();

const app = express();
app.use(express.json());

const corsOrigin = process.env.CORS_ORIGIN?.split(",").map((m) => m.trim()) ?? ["*"];
app.use(cors({ origin: corsOrigin, methods: ["GET", "POST"] }));

const AppDataSource = new DataSource({
    type: "mongodb",
    url: process.env.MONGO_URI || "mongodb://user:1234@localhost:27017/integrity_db?authSource=admin",
    entities: [LogHash],
    synchronize: true, 
    logging: true
});

void (async () => {
    try {
        console.log("Pokušaj povezivanja na MongoDB...");
        await AppDataSource.initialize();
        console.log("\x1b[32m[DB]\x1b[0m Uspešno povezan na bazu: integrity_db");

        const logHashRepository = AppDataSource.getRepository(LogHash);
        const integrityService = new IntegrityService(logHashRepository);
        const integrityController = new IntegrityController(integrityService);

        app.use('/api/v1', integrityController.getRouter());
    } catch (error: any) {
        console.error("❌ GREŠKA PRILIKOM POKRETANJA:");
        console.error(error.message || error);
    }
})();

export default app;