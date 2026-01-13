import { ArchiveStatsDTO } from "../DTOs/ArchiveStatsDTO";

export interface IArchiveStatsService {
    getStats(): Promise<ArchiveStatsDTO>;
}