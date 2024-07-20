

declare class file {
    filePath: {
        masterL: string;
        config: string;
        server: string;
        appsettings: string;
    };
    defaultconfig: {
        master: {
            masters: any[];
        };
        config: any;
        server: any;
    };

    constructor();

    createFilePath(key: keyof file['filePath']): void;

    readFile(key: keyof file['filePath']): any;

    writeFile(key: keyof file['filePath'], data: any): void;

    writeFileJson(key: 'appsettings', data: any): void;
}

export const File: file;
