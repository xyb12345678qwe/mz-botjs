
export class botConfigSet {
    bot: {
        LLOneBot: any;
        ntqq: any;
    };

    async runSelect(): Promise<string>;

    async configureNTQQ(): Promise<void>;

    async promptsForInput(message: string): Promise<string>;

    async chooseBot(): Promise<string[]>;

    async run(): Promise<void>;
}
