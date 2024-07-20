import * as level from 'level';
import * as sublevel from 'level-sublevel';

/**
 * LevelDb 类用于封装 LevelDB 数据库的操作。
 */
declare class LevelDb {
    options: object;
    db: sublevel.Sublevel<level.Level<string, any>>;

    /**
     * 构造函数。
     * @param dbPath 数据库存储的路径。
     * @param options 数据库选项，默认为空对象。
     */
    constructor(dbPath: string, options?: object);

    /**
     * 将键值对存入数据库。
     * @param key 键。
     * @param value 要序列化为 JSON 的值。
     * @param callback 回调函数，第一个参数为错误对象。
     */
    put(key: string, value: any, callback: (error?: Error) => void): void;

    /**
     * 通过键从数据库中检索值。
     * @param key 键。
     * @param callback 回调函数，参数为错误对象和值。
     */
    get(key: string, callback: (error?: Error, value?: any) => void): void;

    /**
     * 从数据库中删除键值对。
     * @param key 键。
     * @param callback 回调函数，第一个参数为错误对象。
     */
    delete(key: string, callback: (error?: Error) => void): void;

    /**
     * 执行批量操作。
     * @param arr 批量操作对象数组。
     * @param callback 回调函数，参数为错误对象和操作列表。
     */
    batch(arr: Array<{ type: string; key: string; value: any }>, callback: (error?: Error, batchList?: Array<{ type: string; key: string; value: any }>) => void): void;
}
declare const LevelDB: LevelDb;
export { LevelDb, LevelDB };
