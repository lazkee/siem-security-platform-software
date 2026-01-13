import { Repository } from "typeorm";
import { BackupValidationLog } from "../Domain/models/BackupValidationLog";
import { ILogerService } from "../Domain/services/ILogerService";
import { BackupValidationStatus } from "../Domain/enums/BackupValidationStatus";
import { execSync } from "child_process";
import { existsSync, mkdirSync, statSync } from "fs";
import path from "path";
import { BACKUP_DIR, BACKUP_FILE_NAME, BACKUP_TABLES, PROD_DB_NAME, SHADOW_DB_NAME } from "../Domain/constants/BackupConstants";
import { IBackupValidationService } from "../Domain/services/IBackupValidationService";
import { ensureMysqlToolsExist } from "../Utils/Service/EnsureMysqlToolsExist";
import { ensureDirectoryExists } from "../Utils/Service/EnsureDirectoryExists";
import { runShellCommand } from "../Utils/Service/RunShellCommand";

export class BackupValidationService implements IBackupValidationService {
    private readonly backupFilePath: string;

    constructor(
        private readonly backupLogRepo: Repository<BackupValidationLog>,
        private readonly logger: ILogerService
    ) {
        this.backupFilePath = path.join(BACKUP_DIR, BACKUP_FILE_NAME);
    }

    public async runValidation(): Promise<boolean> {
        await this.logger.log("Starting backup validation...");
        
        if (!ensureMysqlToolsExist(process.env.MYSQL_BIN!, process.env.MYSQLDUMP_BIN!)) {
            return this.handleFailure("MySQL tools not available.");
        }

        ensureDirectoryExists(BACKUP_DIR);

        if (!this.createBackup()) {
            return this.handleFailure("Backup creation failed.");
        }

        if (!this.validateBackupFile()) {
            return this.handleFailure("Backup file validation failed");
        }

        if (!this.simulateRestore()) {
            return this.handleFailure("Restore simulation failed");
        }

        await this.saveLog(BackupValidationStatus.SUCCESS, null);
        await this.logger.log("[BackupValidation] SUCCESS");

        return true;
    }

    private createBackup(): boolean {
        try {
            this.logger.log("Creating MySQL dump...");

            const dumpCommand = 
                `${process.env.MYSQLDUMP_BIN} ` +
                `-h ${process.env.MYSQL_HOST} ` +
                `-P ${process.env.MYSQL_PORT} ` +
                `-u ${process.env.MYSQL_USER} ` +
                `-p${process.env.MYSQL_PASSWORD} ` +
                `${PROD_DB_NAME} ` +
                `--no-tablespaces ` +
                `${BACKUP_TABLES.join(" ")} > "${this.backupFilePath}"`;

            runShellCommand(dumpCommand);
            return true;
        } catch (err: any){
            console.log("DUMP ERROR:", err.message, err.stderr?.toString(), err.stdout?.toString());
            return false;
        }

    }

    private validateBackupFile(): boolean {
        this.logger.log("Validating backup file...");

        if(!existsSync(this.backupFilePath)) {
            return false;
        }

        try {
            const stats = statSync(this.backupFilePath);
            return stats.size > 100;
        } catch {
            return false;
        }
    }

    private simulateRestore(): boolean {
        try {
            this.logger.log("Simulating restore on shadow database...");

            const dropCommand = 
                `${process.env.MYSQL_BIN} ` +
                `-h ${process.env.MYSQL_HOST} ` +
                `-P ${process.env.MYSQL_PORT} ` +
                `-u ${process.env.MYSQL_USER} ` +
                `-p${process.env.MYSQL_PASSWORD} ` +
                `${SHADOW_DB_NAME} ` +
                `-e "DROP TABLE IF EXISTS ${BACKUP_TABLES.join(", ")};"`;

            runShellCommand(dropCommand);

            const restoreCommand = 
                `${process.env.MYSQL_BIN} ` +
                `-h ${process.env.MYSQL_HOST} ` +
                `-P ${process.env.MYSQL_PORT} ` +
                `-u ${process.env.MYSQL_USER} ` +
                `-p${process.env.MYSQL_PASSWORD} ` +
                `${SHADOW_DB_NAME} < "${this.backupFilePath}"`;

            runShellCommand(restoreCommand);
            return true;
        }
        catch {
            return false;
        }
    }

    private async handleFailure(message: string): Promise<boolean> {
        await this.logger.log("[BackupValidation] FAILED: " + message);

        await this.saveLog(BackupValidationStatus.FAILED, message);

        // kreiranje alerta

        return false;
    }

    private async saveLog(status: BackupValidationStatus, errorMessage: string | null): Promise<void> {
        await this.backupLogRepo.save(
            this.backupLogRepo.create({
                status, errorMessage
            })
        );
    }

}