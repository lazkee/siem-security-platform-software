import { ILogerService } from "../Domain/services/ILoggerService";
import { Db } from "./DBConnectionPool";

export async function initialize_database(loger: ILogerService): Promise<boolean> {
  try {
    await Db.initialize();
    loger.log("[DB] initialized");
    return true;
  } catch (err) {
    loger.log("[DB] init failed: " + err);
    return false;
  }
}
