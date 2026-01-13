import { BackupValidationStatus } from "../enums/BackupValidationStatus";

export interface BackupValidationLog {
    backupValidationLogId: number;
    status: BackupValidationStatus;
    errorMessage: string | null;
    createdAt: string;
}