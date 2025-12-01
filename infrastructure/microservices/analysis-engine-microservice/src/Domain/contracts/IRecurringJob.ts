export interface IRecurringJob {
    execute(): Promise<void>;
}