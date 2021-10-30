import { cpus } from "os";
import { testcase, result, report } from "./types";
import run from "./run";
import Pool from "./pool";

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

    /**
     * @param exePath
     * @param options
     */
    public async run(exePath: string, { timeout = 5000, core = cpus().length - 1 || 1 } = {}): Promise<report[]> {
        if (core > cpus().length) core = cpus().length;

        const reports: report[] = [];
        for (let i = 0; i < this.testcases.length; i++) {
            const cases = this.testcases[i].testcase.split("\n\n").filter(Boolean);

            const pool = new Pool(core);
            for (let j = 0; j < cases.length; j++) pool.push(() => run(exePath, { input: cases[j], timeout }));
            await pool.go();

            reports.push({ testcase: this.testcases[i], results: pool.results as result[] });
        }

        return reports;
    }
}

export default Runner;
