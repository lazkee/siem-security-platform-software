import { JsonObject } from "../types/JsonValue";

export interface ILoggerService {
  info(message: string, meta?: JsonObject): Promise<void>;
  warn(message: string, meta?: JsonObject): Promise<void>;
  error(message: string, meta?: JsonObject): Promise<void>;
}
