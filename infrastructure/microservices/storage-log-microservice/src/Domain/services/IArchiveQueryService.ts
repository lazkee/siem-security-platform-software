import { ArchiveVolumeDTO } from "../DTOs/ArchiveVolumeDTO";
import { LargestArchiveDTO } from "../DTOs/LargestArchiveDTO";
import { TopArchiveDTO } from "../DTOs/TopArchiveDTO";
import { StorageLog } from "../models/StorageLog";

export interface IArchiveQueryService {
    getArchives(): Promise<StorageLog[]>;
    getArchiveFilePath(id: number): Promise<string | null>;
    getTopArchives(type: "events" | "alerts", limit: number): Promise<TopArchiveDTO[]>;
    getArchiveVolume(period: "daily" | "monthly" | "yearly"): Promise<ArchiveVolumeDTO[]>;
    getLargestArchive(): Promise<LargestArchiveDTO | null>;
}