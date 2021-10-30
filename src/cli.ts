#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, dirname, basename } from "path";
import { Runner, testcase, result, report } from "./";

if (
    process.argv.findIndex((arg) => arg === "--version") !== -1 ||
    process.argv.findIndex((arg) => arg === "-v") !== -1 ||
    process.argv.findIndex((arg) => arg === "-V") !== -1
) {
    console.log("testcase-run version: " + "\u001b[1;93m" + require("../package.json").version + "\u001b[0m");
    console.log(
        "Usage: testcase-run --executable [executable path] --testcase [testcase path] --output [output path] --timeout [timeout (ms)] --core [core number]",
    );
    console.log("\t--executable (-e): Executable File Path.");
    console.log("\t--testcase (-t): Testcase File Path.");
    console.log("\t--output (-o): Output (Report) File Path.");
    console.log("\t--timeout (-ti): Timeout (ms).");
    console.log("\t--core (-c): Core Number.");
    console.log("\t--version (-V) or (-v): Show version.");
    console.log("Homepage: " + "\u001b[94m" + require("../package.json").homepage + "\u001b[0m");
    process.exit(0);
}

let executablePath = "",
    testcasePath = "",
    outputPath = "",
    timeout = 5000,
    core = 1;
if (process.argv.findIndex((arg) => arg === "--executable") !== -1 || process.argv.findIndex((arg) => arg === "-e") !== -1) {
    executablePath =
        process.argv[
            process.argv.findIndex((arg) => arg === "--executable") === -1
                ? process.argv.findIndex((arg) => arg === "-e") + 1
                : process.argv.findIndex((arg) => arg === "--executable") + 1
        ];
}
if (process.argv.findIndex((arg) => arg === "--testcase") !== -1 || process.argv.findIndex((arg) => arg === "-t") !== -1) {
    testcasePath =
        process.argv[
            process.argv.findIndex((arg) => arg === "--testcase") === -1
                ? process.argv.findIndex((arg) => arg === "-t") + 1
                : process.argv.findIndex((arg) => arg === "--testcase") + 1
        ];
}
if (process.argv.findIndex((arg) => arg === "--output") !== -1 || process.argv.findIndex((arg) => arg === "-o") !== -1) {
    outputPath =
        process.argv[
            process.argv.findIndex((arg) => arg === "--output") === -1
                ? process.argv.findIndex((arg) => arg === "-o") + 1
                : process.argv.findIndex((arg) => arg === "--output") + 1
        ];
}
if (process.argv.findIndex((arg) => arg === "--timeout") !== -1 || process.argv.findIndex((arg) => arg === "-ti") !== -1) {
    timeout =
        parseInt(
            process.argv[
                process.argv.findIndex((arg) => arg === "--timeout") === -1
                    ? process.argv.findIndex((arg) => arg === "-ti") + 1
                    : process.argv.findIndex((arg) => arg === "--timeout") + 1
            ],
        ) || 5000;
}
if (process.argv.findIndex((arg) => arg === "--core") !== -1 || process.argv.findIndex((arg) => arg === "-c") !== -1) {
    core =
        parseInt(
            process.argv[
                process.argv.findIndex((arg) => arg === "--core") === -1
                    ? process.argv.findIndex((arg) => arg === "-c") + 1
                    : process.argv.findIndex((arg) => arg === "--core") + 1
            ],
        ) || 1;
}

if (!executablePath || !existsSync(executablePath)) {
    console.log("File path to recipe not specified or file does not exist.");
    process.exit(1);
}
if (!testcasePath) testcasePath = join(dirname(executablePath), basename(executablePath, ".exe") + ".tc.json");
if (!existsSync(testcasePath)) process.exit(1);
if (!outputPath) outputPath = join(dirname(executablePath), basename(executablePath, ".exe") + ".report.json");

const runner = new Runner(readFileSync(testcasePath, "utf8"));
runner.run(executablePath, { timeout, core }).then((report) => {
    writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf8");
    console.log("\u001b[1;92m" + `Successfully ran ${report.reduce((acc, cur) => acc + cur.results.length, 0)} testcases.` + "\u001b[0m");
});
