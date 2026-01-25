import { Db } from "./DBConnectionPool";

export async function initialize_database(): Promise<boolean> {
  try {
    await Db.initialize();
    console.log("[DB] initialized");
    return true;
  } catch (err) {
    console.error("[DB] init failed", err);
    return false;
  }
}
