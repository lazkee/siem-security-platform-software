import { runShellCommand } from "./RunShellCommand";

export function ensureMysqlToolsExist(mysqlBin: string, mysqldumpBin: string): boolean {
    try {
        runShellCommand(`"${mysqldumpBin}" --version`);
        runShellCommand(`"${mysqlBin}" --version`);
        return true;
    } catch {
        return false;
    }

}