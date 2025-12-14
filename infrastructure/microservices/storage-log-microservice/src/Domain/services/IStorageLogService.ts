import { ArchiveStatsDTO } from "../DTOs/ArchiveStatsDTO";
import { ArchiveVolumeDTO } from "../DTOs/ArchiveVolumeDTO";
import { TopArchiveDTO } from "../DTOs/TopArchiveDTO";
import { StorageLog } from "../models/StorageLog";

export interface IStorageLogService {
    runArchiveProcess(): Promise<Boolean>;
    getArchives(): Promise<any[]>;
    searchArchives(query: string): Promise<StorageLog[]>;
    sortArchives(by: "date" | "size" | "name", order: "asc" | "desc"): Promise<StorageLog[]>;
    getStats(): Promise<ArchiveStatsDTO>;
    getArchiveFilePath(id: number): Promise<string|null>;
    getTopArchives(type: "events" | "alerts", limit: number): Promise<TopArchiveDTO[]>;
    getArchiveVolume(period: "daily" | "monthly" | "yearly"): Promise<ArchiveVolumeDTO[]>;
}