import { Repository } from "typeorm";
import { IArchiveStatsService } from "../Domain/services/IArchiveStatsService";
import { StorageLog } from "../Domain/models/StorageLog";
import { ILogerService } from "../Domain/services/ILogerService";
import { ArchiveStatsDTO } from "../Domain/DTOs/ArchiveStatsDTO";

export class ArchiveStatsService implements IArchiveStatsService {
    constructor(
        private readonly storageRepo: Repository<StorageLog>,
        private readonly logger: ILogerService
    ) {}

    public async getStats(): Promise<ArchiveStatsDTO> {
        try {

            const archives = await this.storageRepo.find();

            const totalSize = archives.reduce((sum, a) => sum + a.fileSize, 0);
            const lastArchive = archives.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0];

            return {
                totalSize,
                retentionHours: 72,
                lastArchiveName: lastArchive ? lastArchive.fileName : null
            };
        } catch (err) {
            await this.logger.log("ERROR fetching archive stats");
            return {
                totalSize: 0,
                retentionHours: 72,
                lastArchiveName: null
            }
        }
    }
}