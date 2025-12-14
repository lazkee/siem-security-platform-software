import { exec } from "child_process";
import path from "path";
import util from "util";
import { getTimeGroup } from "./TimeGroup";
import { mkdirSync, unlinkSync, writeFileSync } from "fs";

const execAsync = util.promisify(exec);

const ARCHIVE_DIR = process.env.ARCHIVE_PATH || path.join(__dirname, "../../archives");
const TEMP_DIR = path.join(ARCHIVE_DIR, "tmp");

export async function createArchive(lines: string[]): Promise<string> {
    mkdirSync(TEMP_DIR, { recursive: true});
    
    const groups: Record<string, string[]> = {};

    for(const line of lines) {
        const ts = line.split("|").pop();
        const key = getTimeGroup(new Date(ts!));
        if(!groups[key])
            groups[key] = [];
        groups[key].push(line);
    }

    const txtFiles: string[] = [];

    for(const [slot, content] of Object.entries(groups)){
        const name = `logs_${slot}.txt`;
        writeFileSync(path.join(TEMP_DIR, name), content.join("\n"));
        txtFiles.push(name);
    }

    const tarName = `logs_${new Date().toISOString().replace(/[:.]/g, "_")}.tar`;
    const tarPath = path.join(ARCHIVE_DIR, tarName);
    
    await execAsync(`tar -cf "${tarPath}" -C "${TEMP_DIR}" ${txtFiles.join(" ")}`);

    txtFiles.forEach(f => unlinkSync(path.join(TEMP_DIR, f)));

    return tarName;
}