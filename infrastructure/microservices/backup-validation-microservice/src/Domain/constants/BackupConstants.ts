import path from "path";

export const BACKUP_DIR = process.env.BACKUP_PATH || path.join(__dirname, "../../../backups");

export const BACKUP_FILE_NAME = "security_backup.sql";

export const PROD_DB_NAME = process.env.PROD_DB_NAME || "main_db";

export const SHADOW_DB_NAME = process.env.SHADOW_DB_NAME || "backup_validation_db";

export const BACKUP_TABLES = ["event", "alerts"];

export const ALERT_SERVICE_URL = process.env.ALERT_SERVICE_URL || "http://alerts-service/api/alerts";
