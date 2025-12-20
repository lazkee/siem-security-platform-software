import { writeFileSync } from "fs";
import path from "path";

export function WriteGroupedFiles(
    baseDir: string,
    groups: Record<string, string[]>
): string[] {
    const files: string[] = [];

    for(const [slot, content] of Object.entries(groups)){
         const name = `logs_${slot}.txt`;
        writeFileSync(path.join(baseDir, name), content.join("\n"));
        files.push(name);
    }
    return files;
}