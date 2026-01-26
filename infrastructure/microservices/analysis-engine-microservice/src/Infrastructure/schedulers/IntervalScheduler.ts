import { IRecurringJob } from "../../Domain/contracts/IRecurringJob";
import { ILoggerService } from "../../Domain/services/ILoggerService";

export class IntervalScheduler {
  private running = false;
  private intervalId: NodeJS.Timeout | null = null;

  public constructor(
    private readonly job: IRecurringJob,
    private readonly intervalMs: number,
    private readonly logger: ILoggerService
  ) {}

  public start(): void {
    if (this.intervalId) return;

    void this.logger.info("[IntervalScheduler] Starting", { intervalMs: this.intervalMs });

    this.intervalId = setInterval(() => {
      void this.tick();
    }, this.intervalMs);
  }

  public stop(): void {
    if (!this.intervalId) return;

    clearInterval(this.intervalId);
    this.intervalId = null;
    void this.logger.info("[IntervalScheduler] Stopped");
  }

  private async tick(): Promise<void> {
    if (this.running) {
      await this.logger.warn("[IntervalScheduler] Previous run still executing, skipping");
      return;
    }

    this.running = true;

    try {
      await this.job.execute();
    } catch (e) {
      await this.logger.error("[IntervalScheduler] Job execution failed", {
        error: "job_execute_failed",
      });
    } finally {
      this.running = false;
    }
  }
}
