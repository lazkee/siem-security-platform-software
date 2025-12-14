import { AxiosInstance } from "axios";
import path from "path";
import { Repository } from "typeorm";
import { StorageLog } from "../Domain/models/StorageLog";
import { EventDTO } from "../Domain/DTOs/EventDTO";
import { createArchive } from "./CreateArchive";
import { statSync } from "fs";
import { ArchiveType } from "../Domain/enums/ArchiveType";

const ARCHIVE_DIR = process.env.ARCHIVE_PATH || path.join(__dirname, "../../archives");

export async function archiveEvents(hours: number, queryClient: AxiosInstance, eventClient: AxiosInstance, storageRepo: Repository<StorageLog>): Promise<void> {
    const events = (
        await queryClient.get<EventDTO[]>("/query/oldEvents", {
            params: { hours },
        })
    ).data;

    if(events.length === 0)
        return;
    
    const tarName = await createArchive(
        events.map(e => `EVENT | ID=${e.id} | TYPE=${e.type} | SOURCE = ${e.source} | ${e.description} | ${e.timestamp.toISOString()}`)
    );

    const tarPath = path.join(ARCHIVE_DIR, tarName);
    const stats = statSync(tarPath);

    await storageRepo.save(storageRepo.create({
        fileName: tarName,
        archiveType: ArchiveType.EVENT,
        recordCount: events.length,
        fileSize: stats.size,
    }));

    await eventClient.delete("/events/old",{
        data: events.map(e => e.id),
    });
}