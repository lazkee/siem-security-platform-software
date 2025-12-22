import { unlinkSync } from "fs";
import path from "path";

export function CleanUpFiles(dir: string, files: string[]) {
    for(const file of files) {
        unlinkSync(path.join(dir, file));
    }
}