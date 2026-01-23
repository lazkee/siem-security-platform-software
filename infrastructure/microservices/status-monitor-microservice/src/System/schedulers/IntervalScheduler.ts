export class IntervalScheduler {
    private timer: NodeJS.Timeout | null = null;
    private isRunning = false;

    constructor(private job: { run: () => Promise<void> }, private intervalMs: number) {}

    start() {
        if (this.timer) return;

        // run once immediately
        this.safeRun();

        this.timer = setInterval(() => this.safeRun(), this.intervalMs);
    }

    stop() {
        if (!this.timer) return;
            clearInterval(this.timer);
            this.timer = null;
    }

    private async safeRun() {
        if (this.isRunning) return;
            this.isRunning = true;
        try {
            await this.job.run();
        } catch (e) {
        console.error("[IntervalScheduler] job failed:", e);
        } finally {
            this.isRunning = false;
        }
    }
}
