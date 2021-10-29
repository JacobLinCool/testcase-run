# Testcase Runner

Run testcases generated by [**testcase-gen**](https://github.com/JacobLinCool/testcase-gen) and collect stdout and execution time of your code.

 [![NPM](https://img.shields.io/npm/v/testcase-run.svg?style=flat)](https://www.npmjs.com/package/testcase-run)

## Something You Should Know

This tool comes with [**testcase-gen**](https://github.com/JacobLinCool/testcase-gen).

It works with testcases that generated by **testcase-gen**.

But of course, you can use it without **testcase-gen** by generating same-structure testcases manually.

## How to Use

### 1. Install

```bash
npm i -g testcase-run
```

### 2. Run your code

```javascript
const { Runner } = require("testcase-run");
const fs = require("fs");
const path = require("path");

const testcases = fs.readFileSync(path.join(__dirname, "testcases.json"), "utf-8");
const runner = new Runner(testcases);

runner.run("D:\\sum.exe", { timeout: 10_000 }).then((report) => {
    fs.writeFileSync(path.join(__dirname, "report.json"), JSON.stringify(report, null, 2), "utf-8");
    console.log(`runned ${report.reduce((acc, cur) => acc + cur.results.length, 0)} testcases`);
});
```

## CLI Tool

### Install CLI

```bash
npm i -g testcase-run
```

### Use CLI

```bash
testcase-run --executable [executable path] --testcase [testcase path] --output [output path] --timeout [timeout]
        --executable (-e): Executable File Path.
        --testcase (-t): Testcase File Path.
        --output (-o): Output (Report) File Path.
        --timeout (-ti): Timeout (ms).
        --version (-V) or (-v): Show version and help.
```
