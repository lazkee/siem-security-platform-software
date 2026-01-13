export function runShellCommand(command: string): void {
    if (process.platform === "win32") {
        require("child_process").execSync(`cmd /c "${command}"`, {
            stdio: "pipe",
            encoding: "utf-8"
        });
    } else {
        require("child_process").execSync(`/bin/sh -c "${command}"`, {
            stdio: "pipe",
            encoding: "utf-8"
        });
    }
}