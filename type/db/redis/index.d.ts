// RedisManager.d.ts
import { RedisClient } from 'redis';

// 定义一个类型，表示 RedisManager 的接口
export interface RedisManager {
    client: RedisClient;
    prefix: string;

    // 构造函数
    new(prefix: string, options?: Redis.ClientOptions): RedisManager;

    // 公共方法
    mapFieldToKey(field: string, uid: string): string;

    setRedisKey(key: string, uid: string, data: any): Promise<string>;

    getRedisKey(key: string, uid: string): Promise<any>;

    delRedisKey(key: string, uid: string): Promise<number>;

    getAllRedisKey(partialKey: string): Promise<any[]>;

    dispose(): void;

    emit(eventName: string, ...args: any[]): void;
}

// 声明一个符合 RedisManager 接口类型的类
declare class RedisManager implements RedisManager {
    client: RedisClient;
    prefix: string;

    constructor(prefix: string, options?: Redis.ClientOptions);

    mapFieldToKey(field: string, uid: string): string;

    setRedisKey(key: string, uid: string, data: any): Promise<string>;

    getRedisKey(key: string, uid: string): Promise<any>;

    delRedisKey(key: string, uid: string): Promise<number>;

    getAllRedisKey(partialKey: string): Promise<any[]>;

    dispose(): void;

    emit(eventName: string, ...args: any[]): void;
}
