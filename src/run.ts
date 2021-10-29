import { spawn } from "child_process";
import { result } from "./types";

function run(exe: string, { input = "", timeout = 5000 } = {}): Promise<result> {
    return new Promise((resolve, reject) => {
        try {
            let stdout = "",
                time = 0,
                StartTime = Date.now();
            const program = spawn(exe, { timeout });

            program.on("close", (code: number | null) => {
                time = Date.now() - StartTime;
                resolve({ code, stdout, time });
            });

            program.stdout.on("data", (data) => {
                stdout += data;
            });

            if (input) {
                program.stdin.write(input);
                program.stdin.end();
            }
        } catch (err) {
            reject(err);
        }
    });
}

export default run;
