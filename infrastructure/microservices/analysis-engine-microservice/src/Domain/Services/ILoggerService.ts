export interface ILoggerService {
    info(message: string, meta?: Record<string, any>): Promise<void>
    warn(message: string, meta?: unknown): Promise<void>
    error(message: string, meta?: unknown): Promise<void>;
}