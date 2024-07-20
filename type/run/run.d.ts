interface BotData {
    isBot: boolean;
}

declare class Run {
    run(data: BotData): Promise<void>;
}

declare const RunBot: Run;

export { BotData, Run, RunBot };
