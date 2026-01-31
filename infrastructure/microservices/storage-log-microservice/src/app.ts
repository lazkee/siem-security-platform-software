import express from 'express';
import cors from 'cors';
import "reflect-metadata";
import { initialize_database } from './Database/InitializeConnection';
import dotenv from 'dotenv';
import { StorageLog } from './Domain/models/StorageLog';
import { Db } from './Database/DbConnectionPool';
import { StorageLogController } from './WebAPI/controllers/StorageLogController';
import { ILogerService } from './Domain/services/ILogerService';
import { LogerService } from './Services/LogerService';
import { IArchiveProcessService } from './Domain/services/IArchiveProcessService';
import { ArchiveProcessService } from './Services/ArchiveProcessService';
import { IArchiveQueryService } from './Domain/services/IArchiveQueryService';
import { ArchiveQueryService } from './Services/ArchiveQueryService';
import { IArchiveStatsService } from './Domain/services/IArchiveStatsService';
import { ArchiveStatsService } from './Services/ArchiveStatsService';

dotenv.config({ quiet: true });

const app = express();

//parsiranje JSON body-ja
app.use(express.json());

// Read CORS settings from environment
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["GET", "POST"];

// Protected microservice from unauthorized access
app.use(cors({
  origin: corsOrigin,
  methods: corsMethods,
}));

app.get("/health", async (req, res) => {
  try {
    // Provera baze: 
    await Db.query("SELECT 1");

    res.status(200).json({
      status: "OK",
      service: "StorageLogService", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(503).json({
      status: "DOWN",
      service: "StorageLogService",
      timestamp: new Date().toISOString()
    });
  }
});

async function startApp() {
  try {
    // Initialize the database first
    await initialize_database();
    console.log("Database initialized successfully.");

    // Now it's safe to get the repository
    const storageRepo = Db.getRepository(StorageLog);

    // Initialize services
    const logerService: ILogerService = new LogerService();
    const archiveProcessService: IArchiveProcessService = new ArchiveProcessService(storageRepo, logerService);
    const archiveQueryService: IArchiveQueryService = new ArchiveQueryService(storageRepo, logerService);
    const archiveStatsService: IArchiveStatsService = new ArchiveStatsService(storageRepo, logerService);

    // Initialize controllers
    const storageController = new StorageLogController(
      archiveProcessService,
      archiveQueryService,
      archiveStatsService
    );

    // Set up Express
    const app = express();
    app.use(express.json());
    app.use("/api/v1", storageController.getRouter());

    // Start periodic archiving
    const FIFTEEN_MINUTES = 15 * 60 * 1000;
    setInterval(async () => {
      console.log("Starting automatic StorageLog archiving...");
      try {
        await archiveProcessService.runArchiveProcess();
        console.log("Archiving completed.");
      } catch (err) {
        console.error("Error in archiving:", err);
      }
    }, FIFTEEN_MINUTES);

    // Run the first archive immediately
    await archiveProcessService.runArchiveProcess();
    console.log("First archiving complete.");

    // Start server
    const PORT = process.env.PORT ?? 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    
  } catch (err) {
    console.error("Failed to start app:", err);
  }
}

// Start everything
void startApp();

  
export default app;