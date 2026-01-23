import { IMonitoringService } from "../Domain/services/IMonitoringService";

export class RecurringMonitoringJob {
    constructor(private monitoringService: IMonitoringService) {}

    async run(): Promise<void> {
        await this.monitoringService.runChecks();
    }
}
