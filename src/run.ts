import { spawn } from "child_process";
import { result } from "./types";

function run(exe: string, { input = "", timeout = 5000 } = {}): Promise<result> {
    return new Promise((resolve, reject) => {
        try {
            let stdout = "";
            const program = spawn(exe, { timeout });
            let StartTime = Date.now();

            program.on("close", (code: number | null) => {
                resolve({ code, stdout, time: Date.now() - StartTime });
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
