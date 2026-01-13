import { existsSync, mkdir, mkdirSync } from "fs";

export function ensureDirectoryExists(dir: string): void {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}