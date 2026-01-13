import { Repository } from "typeorm";
import { BackupValidationLog } from "../Domain/models/BackupValidationLog";
import { BackupValidationResultDTO } from "../Domain/DTOs/BackupValidationResultDTO";
import { BackupValidationStatus } from "../Domain/enums/BackupValidationStatus";
import { IBackupValidationQueryService } from "../Domain/services/IBackupValidationQueryService";
import { ILogerService } from "../Domain/services/ILogerService";

export class BackupValidationQueryService implements IBackupValidationQueryService {
    constructor(
        private readonly backupLogRepo: Repository<BackupValidationLog>,
        private readonly logger: ILogerService
    ) {}

    public async getAllLogs(): Promise<BackupValidationLog[]> {
        await this.logger.log("Fetching backup logs...");
        return await this.backupLogRepo.find({
            order: {
                createdAt: "DESC"
            }
        });
    }

    public async getLastValidation(): Promise<BackupValidationLog | null> {
        const result = await this.backupLogRepo.findOne({
            order: {
                createdAt: "DESC"
            }
        });

        return result ?? null;
    }

    public async getSummary(): Promise<BackupValidationResultDTO> {
        const totalRuns = await this.backupLogRepo.count();

        const successRuns = await this.backupLogRepo.count({
            where: { status: BackupValidationStatus.SUCCESS }
        });

        const failedRuns = await this.backupLogRepo.count({
            where: { status: BackupValidationStatus.FAILED }
        });

        const lastLog = await this.getLastValidation();

        return{
            totalRuns,
            successRuns,
            failedRuns,
            lastCheckAt: lastLog ? lastLog.createdAt.toISOString() : null,
            lastStatus: lastLog ? lastLog.status : null
        };
    }

}