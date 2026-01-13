import { BackupValidationResultDTO } from "../DTOs/BackupValidationResultDTO";
import { BackupValidationLog } from "../models/BackupValidationLog";

export interface IBackupValidationQueryService {
    getAllLogs(): Promise<BackupValidationLog[]>;
    getLastValidation(): Promise<BackupValidationLog | null>;
    getSummary(): Promise<BackupValidationResultDTO>;
}