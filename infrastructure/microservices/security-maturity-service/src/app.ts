import express from "express";
import dotenv from "dotenv";
import { initialize_database } from "./Database/InitializeConnection";
import { KpiRepositoryService } from "./Services/KpiRepositoryService";
import { SecurityMaturityController } from "./WebAPI/controllers/SecurityMaturityController";

dotenv.config();

const app = express();

app.use(express.json());
initialize_database();

// services
const kpiRepositoryService = new KpiRepositoryService();

// controllers
const securityMaturityController = new SecurityMaturityController(
  kpiRepositoryService,
);

app.use("/api/v1", securityMaturityController.getRouter());

export default app;
