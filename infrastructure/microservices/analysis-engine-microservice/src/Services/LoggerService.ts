import { ILoggerService } from "../Domain/services/ILoggerService";
import { JsonObject } from "../Domain/types/JsonValue";

export class LoggerService implements ILoggerService {
  public constructor() {
    
    console.log(`\x1b[35m[Logger]\x1b[0m Service started`);
  }

  public async info(message: string, meta?: JsonObject): Promise<void> {
    if (meta) console.info(`\x1b[34m[INFO]\x1b[0m ${message}`, meta);
    else console.info(`\x1b[34m[INFO]\x1b[0m ${message}`);
  }

  public async warn(message: string, meta?: JsonObject): Promise<void> {
    if (meta) console.warn(`\x1b[33m[WARN]\x1b[0m ${message}`, meta);
    else console.warn(`\x1b[33m[WARN]\x1b[0m ${message}`);
  }

  public async error(message: string, meta?: JsonObject): Promise<void> {
    if (meta) console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`, meta);
    else console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`);
  }
}
