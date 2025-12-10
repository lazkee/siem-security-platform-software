import { ArchiveDTO } from "../../models/storage/ArchiveDTO";
import { ArchiveStatsDTO } from "../../models/storage/ArchiveStatsDTO";

export interface IStorageAPI {
    getAllArchives(): Promise<ArchiveDTO[]>;
    searchArchives(query: string): Promise<ArchiveDTO[]>;
    sortArchives(by: "date" | "size" | "name", order: "asc" | "desc"): Promise<ArchiveDTO[]>;
    getStats(): Promise<ArchiveStatsDTO>;
    downloadArchive(id: number): Promise<Blob>; // ide u <a href=... download>
}