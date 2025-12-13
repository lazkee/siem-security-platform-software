import { IRecurringJob } from "../../Domain/contracts/IRecurringJob";

export class IntervalScheduler {
  private running = false;

  constructor(
    private readonly job: IRecurringJob,
    private readonly intervalMs: number
  ) {}

  public start(): void {
    console.log(
      `[IntervalScheduler] Starting with interval ${this.intervalMs} ms`
    );

    setInterval(async () => {
      if (this.running) {
        console.warn("[IntervalScheduler] Job still running, skipping...");
        return;
      }

      this.running = true;
      console.log("[IntervalScheduler] Triggering scheduled job...");

      try {
        await this.job.execute();
      } catch (err) {
        console.error(
          "[IntervalScheduler] Job execution failed:",
          (err as Error).message
        );
      } finally {
        this.running = false;
      }
    }, this.intervalMs);
  }
}
