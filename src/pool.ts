type PromiseFunction = (...args: any[]) => Promise<any>;

class Pool {
    public readonly size: number;
    private available: number;
    public tasks: PromiseFunction[];
    private resolves: Function[];
    public results: any[];

    constructor(size: number) {
        this.size = size;
        this.available = size;
        this.tasks = [];
        this.resolves = [];
        this.results = [];
    }

    public push(task: Function) {
        this.tasks.push(async () => task());
    }

    public async go() {
        const tasks = [];
        for (let i = 0; i < this.tasks.length; i++) {
            await this.isAvailable();
            tasks.push(
                this.tasks[i]().then((res) => {
                    this.results[i] = res;
                    if (this.resolves.length > 0) (this.resolves.shift() as Function)();
                }),
            );
        }
        await Promise.all(tasks);
        return this.results;
    }

    private isAvailable() {
        return new Promise((resolve) => {
            if (this.available > 0) {
                this.available--;
                resolve(true);
            } else this.resolves.push(resolve);
        });
    }
}

export default Pool;
