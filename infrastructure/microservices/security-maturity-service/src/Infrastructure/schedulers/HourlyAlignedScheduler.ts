import { IRecurringJob } from "../../Domain/contracts/IRecurringJob";

export class HourlyAlignedScheduler {
  private running = false;
  private intervalId: NodeJS.Timeout | null = null;
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(private readonly job: IRecurringJob) {}

  public start(): void {
    const now = new Date();
    const msUntilNextHour = this.msUntilNextHour(now);

    console.log(
      `[HourlyAlignedScheduler] Starting. Next run in ${msUntilNextHour} ms (aligned to next hour).`
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
      console.warn("[HourlyAlignedScheduler] Job still running, skipping...");
      return;
    }

    this.running = true;
    console.log("[HourlyAlignedScheduler] Triggering scheduled job...");

    try {
      await this.job.execute();
    } catch (err) {
      console.error(
        "[HourlyAlignedScheduler] Job execution failed:",
        err 
      );
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
