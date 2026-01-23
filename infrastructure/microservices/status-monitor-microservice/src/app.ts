import express from "express";
import cors from "cors";
import "reflect-metadata";
import dotenv from "dotenv";
import { initialize_database } from "./Database/InitializeConnection";
import { Repository } from "typeorm";
import { Db } from "./Database/DbConnectionPool";
import { ServiceThreshold } from "./Domain/models/ServiceThreshold";
import { ServiceCheck } from "./Domain/models/ServiceCheck";
import { IMonitoringService } from "./Domain/services/IMonitoringService";
import { MonitoringService } from "./Services/MonitoringService";
import { RecurringMonitoringJob } from "./Services/RecurringMonitoringJob";
import { IntervalScheduler } from "./System/schedulers/IntervalScheduler";
import { StatusMonitorController } from "./WebAPI/controllers/StatusMonitorController";

dotenv.config({ quiet: true });

const app = express();

const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["GET", "POST"];

app.use(cors({ origin: corsOrigin, methods: corsMethods }));
app.use(express.json());

initialize_database();

// Repos
const thresholdRepo: Repository<ServiceThreshold> = Db.getRepository(ServiceThreshold);
const checkRepo: Repository<ServiceCheck> = Db.getRepository(ServiceCheck);

// Service (DI)
const monitoringService: IMonitoringService = new MonitoringService(thresholdRepo, checkRepo);

// Health
app.get("/health", (_req, res) => res.status(200).json({ status: "OK", service: "ServiceStatusMonitor" }));

const controller = new StatusMonitorController();
app.use("/api/v1", controller.getRouter());

// Jobs
export function startRecurringJobs() {
  const job = new RecurringMonitoringJob(monitoringService);
  const intervalSec = Number(process.env.DEFAULT_CHECK_INTERVAL_SEC ?? "30");
  const scheduler = new IntervalScheduler(job, intervalSec * 1000);
  scheduler.start();
}

export default app;
