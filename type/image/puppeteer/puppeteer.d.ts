// createPicture.d.ts
export interface CreatePictureOptions {
    AppName: string;
    tplFile: string;
    data?: any; // 具体类型依据实际使用场景定义
    tab?: string;
    timeout?: number;
    DirPath: string;
    SOptions?: {
        type: 'jpeg' | 'png' | 'gif' | 'webp'; // 可以根据实际支持的图片类型扩展
        quality: number;
    };
}

/**
 * 创建图片的异步函数类型定义
 * @param Options 创建图片的参数选项
 * @returns Promise，表示异步操作的完成
 */
export declare function createPicture(Options: CreatePictureOptions): Promise<Buffer>;
