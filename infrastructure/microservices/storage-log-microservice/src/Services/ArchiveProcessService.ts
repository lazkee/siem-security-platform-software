import { AxiosInstance } from "axios";
import { IArchiveProcessService } from "../Domain/services/IArchiveProcessService";
import { Repository } from "typeorm";
import { StorageLog } from "../Domain/models/StorageLog";
import { ILogerService } from "../Domain/services/ILogerService";
import { createAxiosClient } from "../Utils/Client/AxiosClient";
import { mkdirSync, statSync } from "fs";
import { ARCHIVE_DIR, ARCHIVE_RETENTION_HOURS, TEMP_DIR } from "../Domain/constants/ArchiveConstants";
import { EventDTO } from "../Domain/DTOs/EventDTO";
import { getTimeGroup } from "../Utils/Service/TimeGroup";
import { WriteGroupedFiles } from "../Utils/Service/WriteGroupedFiles";
import path from "path";
import { execSync } from "child_process";
import { ArchiveType } from "../Domain/enums/ArchiveType";
import { CleanUpFiles } from "../Utils/Service/CleanUpFiles";
import { CorrelationDTO } from "../Domain/DTOs/CorrelationDTO";

export class ArchiveProcessService implements IArchiveProcessService {
    private readonly queryClient: AxiosInstance;
    private readonly eventClient: AxiosInstance;
    private readonly correlationClient: AxiosInstance;

    constructor(
        private readonly storageRepo: Repository<StorageLog>,
        private readonly logger: ILogerService
    ) {
        this.queryClient = createAxiosClient(process.env.QUERY_SERVICE_API ?? "");
        this.eventClient = createAxiosClient(process.env.EVENT_SERVICE_API ?? "");
        this.correlationClient = createAxiosClient(process.env.ALERT_API ?? "");

        //radi proveru 
        mkdirSync(ARCHIVE_DIR, { recursive: true });
        mkdirSync(TEMP_DIR, { recursive: true });
    }

    public async runArchiveProcess(): Promise<Boolean> {
        await this.logger.log("Starting archive process...");

        const eventsOk = await this.archiveEvents();
        const alertsOk = await this.archiveAlerts();
        // zakomentarisano jer ne radimo jos uvek arhiviranje alertova

        // stavljeno alerts = true jer nije pozvano arhiviranje alertova
        await this.logger.log(`Archive process result: events:${eventsOk}, alerts=${alertsOk}`);

        // vracamo true za alertove
        return eventsOk && alertsOk;
    }

    public async archiveEvents(): Promise<boolean> {
        try {
            await this.logger.log("Archiving events started...");

            const events = (await this.queryClient.get<EventDTO[]>(`/query/oldEvents/${ARCHIVE_RETENTION_HOURS}`)).data;

            if (events.length === 0) {
                await this.logger.log("No events to archive.");
                return true;
            }

            const groups: Record<string, string[]> = {};

            for (const e of events) {
                const eventDate = new Date(e.timestamp as any);
                const line = `EVENT | ID = ${e.id} | TYPE = ${e.type} | SOURCE = ${e.source} | ${e.description} | ${eventDate.toISOString()}`;

                const key = getTimeGroup(eventDate);
                if (!groups[key])
                    groups[key] = [];

                groups[key].push(line);
            }

            const hourGroups = WriteGroupedFiles(TEMP_DIR, groups);

            for (const hourKey of hourGroups) {

                const hourDir = path.join(TEMP_DIR, hourKey);
                const tarName = `events_${hourKey}_00.tar`;
                const tarPath = path.join(ARCHIVE_DIR, tarName);

                // taruje ceo sat
                await execSync(`tar -cf "${tarPath}" -C "${hourDir}" .`);

                const stats = statSync(tarPath);

                await this.storageRepo.save(this.storageRepo.create({
                    fileName: tarName,
                    archiveType: ArchiveType.EVENT,
                    recordCount: groups[hourKey].length,
                    fileSize: stats.size
                }));

                // brise se folder za taj sat - u njemu su bili .txt fajlovi
                CleanUpFiles(hourDir);
            }

            await this.logger.log(`Deleting ${events.length} events from Event service`);

            await this.eventClient.delete("/events/old",
                { data: events.map(e => e.id) }
            );

            await this.logger.log(`Archived ${events.length} events.`);
            return true;

        } catch (err) {
            console.error("ARCHIVE EVENTS ERROR FULL:", err);
            await this.logger.log("ERROR archiving events"); return false;
        }
    }

    public async archiveAlerts(): Promise<boolean> {
        try {
            await this.logger.log("Archiving alerts started...");

            const alerts = (await this.queryClient.get<CorrelationDTO[]>(`/query/oldAlerts/${ARCHIVE_RETENTION_HOURS}`)).data;

            if (alerts.length === 0) {
                await this.logger.log("No alerts to archive.");
                return true;
            }

            const groups: Record<string, string[]> = {};

            for (const a of alerts) {
                const alertDate = new Date(a.createdAt as any);
                const line = `ALERT | ID = ${a.id} | SOURCE = ${a.source} | ${alertDate.toISOString()}`;

                const key = getTimeGroup(alertDate);
                if (!groups[key])
                    groups[key] = [];

                groups[key].push(line);
            }

            const hourGroups = WriteGroupedFiles(TEMP_DIR, groups);

            for (const hourKey of hourGroups) {

                const hourDir = path.join(TEMP_DIR, hourKey);
                const tarName = `alerts_${hourKey}_00.tar`;
                const tarPath = path.join(ARCHIVE_DIR, tarName);

                await execSync(`tar -cf "${tarPath}" -C "${hourDir}" .`);

                const stats = statSync(tarPath);

                await this.storageRepo.save(this.storageRepo.create({
                    fileName: tarName,
                    archiveType: ArchiveType.ALERT,
                    recordCount: groups[hourKey].length,
                    fileSize: stats.size
                }));

                CleanUpFiles(hourDir);
            }

            await this.logger.log(`Deleting ${alerts.length} events from Analysis Engine service`);

            await this.correlationClient.delete("/alerts/deleteArchivedAlerts",
                { data: alerts.map(a => a.id) }
            );

            await this.logger.log(`Archived ${alerts.length} alerts.`);
            return true;

        } catch (err) {
            console.error("ARCHIVE ALERTS ERROR FULL:", err);
            await this.logger.log("ERROR archiving alerts");
            return false;
        }
    }
}