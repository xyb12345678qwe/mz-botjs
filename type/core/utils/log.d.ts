//定义类型
interface Log4jsLogger {
    info: (msg: any, ...args: any[]) => void;
    warn: (msg: any, ...args: any[]) => void;
    error: (msg: any, ...args: any[]) => void;
    debug: (msg: any, ...args: any[]) => void;
    trace: (msg: any, ...args: any[]) => void;
    log: (msg: any, ...args: any[]) => void;

}

declare global {
    interface Global {
        logger: Log4jsLogger;
    }
    var logger: Log4jsLogger;
}

export { logger };
