import { IRecurringJob } from "../../Domain/contracts/IRecurringJob";
import { IKpiSnapshotService } from "../../Domain/services/IKpiSnapshotService";


export class CalculateHourlyKpiSnapshotJob implements IRecurringJob {
  constructor(private readonly kpiSnapshotService: IKpiSnapshotService) {}

  public async execute(): Promise<void> {
    const { windowFrom, windowTo } = this.getPreviousHourWindow(new Date());
    await this.kpiSnapshotService.createSnapshotForWindow(windowFrom, windowTo);
  }

  private getPreviousHourWindow(now: Date): { windowFrom: Date; windowTo: Date } {
    const windowTo = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      0, 0, 0
    ));

    const windowFrom = new Date(windowTo.getTime() - 60 * 60 * 1000);
    return { windowFrom, windowTo };
  }
}
