import { IRecurringJob } from "../../Domain/contracts/IRecurringJob";
import { ILogerService } from "../../Domain/services/ILoggerService";

export class HourlyAlignedScheduler {
  private running = false;
  private intervalId: NodeJS.Timeout | null = null;
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(private readonly job: IRecurringJob, private readonly loger: ILogerService) { }

  public start(): void {
    if (this.timeoutId || this.intervalId) {
      this.loger.log("[HourlyAlignedScheduler] Already started; ignoring start().");
      return;
    }
    const now = new Date();
    const msUntilNextHour = this.msUntilNextHour(now);

    const minutesUntilNextHour = msUntilNextHour / 60000;

    this.loger.log(
      `[HourlyAlignedScheduler] Starting. Next run in ${minutesUntilNextHour.toFixed(2)} minutes.`
    );

    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;

      // First aligned trigger
      void this.trigger();

      // Then every hour
      this.intervalId = setInterval(() => {
        void this.trigger();
      }, 60 * 60 * 1000);
    }, msUntilNextHour);
  }

  public stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async trigger(): Promise<void> {
    if (this.running) {
      this.loger.log("[HourlyAlignedScheduler] Job still running, skipping...");
      return;
    }

    this.running = true;
    this.loger.log("[HourlyAlignedScheduler] Triggering scheduled job...");

    try {
      await this.job.execute();
    } catch (err) {
      this.loger.log("[HourlyAlignedScheduler] Job execution failed: " + err);
    } finally {
      this.running = false;
    }
  }

  private msUntilNextHour(now: Date): number {
    const nextHourUtc = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours() + 1,
      0, 0, 0
    ));
    return nextHourUtc.getTime() - now.getTime();
  }
}
