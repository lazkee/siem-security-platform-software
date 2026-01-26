import { DataSource } from "typeorm";
import { ILoggerService } from "../Domain/services/ILoggerService";

export async function initialize_database(
  dataSource: DataSource,
  logger: ILoggerService
): Promise<void> {
  try {
    if (dataSource.isInitialized) {
      await logger.warn("[Database] DataSource already initialized");
      return;
    }

    await dataSource.initialize();
    await logger.info("[Database] Connection established");
  } catch (e) {
    await logger.error("[Database] Initialization failed", {
      error: "datasource_init_failed",
    });
  }
}
