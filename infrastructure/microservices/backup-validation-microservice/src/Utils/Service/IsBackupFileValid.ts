import { existsSync, statSync } from "fs";

export function isBackupFileValid(path: string): boolean {
    if (!existsSync(path))
        return false;

    try {
        const stats = statSync(path);
        return stats.size > 100;
    } catch {
        return false;
    }
}