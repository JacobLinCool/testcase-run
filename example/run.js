const { Runner } = require("../lib");
const fs = require("fs");
const path = require("path");

const testcases = fs.readFileSync(path.join(__dirname, "testcases.json"), "utf-8");
const runner = new Runner(testcases);

const StartT = Date.now();
runner.run("D:\\JacobLinCool\\Github\\c-learning\\hw2\\hw0203.exe", { timeout: 10_000 }).then((report) => {
    fs.writeFileSync(path.join(__dirname, "report.json"), JSON.stringify(report, null, 2), "utf-8");
    console.log(`runned ${report.reduce((acc, cur) => acc + cur.results.length, 0)} testcases in ${Date.now() - StartT}ms`);
});
