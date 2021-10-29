import { testcase, result, report } from "./types";
import run from "./run";

class Runner {
    public testcases: testcase[] = [];

    constructor(testcases: testcase[] | string | null = null) {
        if (testcases) this.load(testcases);
    }

    public load(testcases: testcase[] | string): Runner {
        if (typeof testcases === "string") {
            try {
                testcases = JSON.parse(testcases);
                if (!Array.isArray(testcases)) throw new Error("");
            } catch (err) {
                testcases = [
                    {
                        id: 0,
                        name: "TESTCASE",
                        testcase: testcases as string,
                    },
                ];
            }
        }
        this.testcases = testcases as testcase[];

        return this;
    }

    public async run(exePath: string, { timeout = 5000 } = {}): Promise<report[]> {
        let c = 0;
        const reports: report[] = [];
        for (let i = 0; i < this.testcases.length; i++) {
            const results: result[] = [];
            const cases = this.testcases[i].testcase.split("\n\n").filter(Boolean);
            for (let j = 0; j < cases.length; j++) {
                results.push(await run(exePath, { input: cases[j], timeout }));
            }
            reports.push({ testcase: this.testcases[i], results });
        }

        return reports;
    }
}

export default Runner;
