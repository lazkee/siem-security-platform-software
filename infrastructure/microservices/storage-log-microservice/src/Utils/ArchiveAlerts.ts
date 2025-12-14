import { AxiosInstance } from "axios";
import path from "path";
import { Repository } from "typeorm";
import { StorageLog } from "../Domain/models/StorageLog";
import { createArchive } from "./CreateArchive";
import { statSync } from "fs";
import { ArchiveType } from "../Domain/enums/ArchiveType";
import { CorrelationDTO } from "../Domain/DTOs/CorrelationDTO";

const ARCHIVE_DIR = process.env.ARCHIVE_PATH || path.join(__dirname, "../../archives");

export async function archiveAlerts(hours: number, queryClient: AxiosInstance, correlationClient: AxiosInstance, storageRepo: Repository<StorageLog>): Promise<void> {
    const alerts = (
        await queryClient.get<CorrelationDTO[]>("/query/oldAlerts", {
            params: { hours },
        })
    ).data;

    if(alerts.length === 0)
        return;
    
    const tarName = await createArchive(
        alerts.map(a => `ALERT | ID=${a.id} | SOURCE = ${a.source} | ${a.description} | ${a.timestamp.toISOString()}`)
    );

    const tarPath = path.join(ARCHIVE_DIR, tarName);
    const stats = statSync(tarPath);

    await storageRepo.save(storageRepo.create({
        fileName: tarName,
        archiveType: ArchiveType.ALERT,
        recordCount: alerts.length,
        fileSize: stats.size,
    }));

    await correlationClient.delete("/AnalysisEngine/correlations/deleteByEventIds",{
        data: alerts.map(a => a.id),
    });
}