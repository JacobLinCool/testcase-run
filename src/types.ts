export interface testcase {
    id: number;
    name: string;
    testcase: string;
}

export interface result {
    code: number | null;
    stdout: string;
    time: number;
}

export interface report {
    testcase: testcase;
    results: result[];
}
