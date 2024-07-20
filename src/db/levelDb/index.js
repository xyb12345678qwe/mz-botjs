import level from 'level'
import sublevel from 'level-sublevel'
import path from 'path'
/**
 * LevelDb 类用于封装 LevelDB 数据库的操作。
 * 
 * @class LevelDb
 * @param {string} dbPath - 数据库存储的路径
 * @param {Object} [options] - 数据库选项，默认为空对象
 */
class LevelDb {
    constructor(dbPath, options = {}) {
        this.options = options;
        // 初始化 sublevel 数据库实例，使用 JSON 作为值编码
        this.db = sublevel(new level.Level(dbPath, { valueEncoding: 'json' }));
        if (logger) {
            logger.info(`LevelDB 数据库路径: ${dbPath}`);
        } else {
            console.log(`LevelDB 数据库路径: ${dbPath}`);
        }
        
    }

    /**
     * 将键值对存入数据库。
     * 
     * @param {string} key - 键
     * @param {Object} value - 要序列化为 JSON 的值
     * @param  callback - 回调函数，第一个参数为错误对象
     */
    put(key, value, callback) {
        if (key && value) {
            this.db.put(key, value, (error) => {
                callback(error);
            });
        } else {
            callback('没有键或值');
        }
    }

    /**
     * 通过键从数据库中检索值。
     * 
     * @param {string} key - 键
     * @param  callback - 回调函数，参数为错误对象和值
     */
    get(key, callback) {
        if (key) {
            this.db.get(key, (error, value) => {
                callback(error, value);
            });
        } else {
            callback('没有键', null);
        }
    }

    /**
     * 从数据库中删除键值对。
     * 
     * @param {string} key - 键
     * @param  callback - 回调函数，第一个参数为错误对象
     */
    delete(key, callback) {
        if (key) {
            this.db.del(key, (error) => {
                callback(error);
            });
        } else {
            callback('没有键');
        }
    }

    /**
     * 执行批量操作。
     * 
     * @param {Array<Object>} arr - 批量操作对象数组
     * @param  callback - 回调函数，参数为错误对象和操作列表
     */
    batch(arr, callback) {
        if (Array.isArray(arr)) {
            const batchList = arr.filter(item =>
                item.hasOwnProperty('type') &&
                item.hasOwnProperty('key') &&
                item.hasOwnProperty('value')
            );

            if (batchList.length > 0) {
                this.db.batch(batchList.map(item => ({ type: item.type, key: item.key, value: item.value })), (error) => {
                    callback(error, null); // 传递错误信息作为第一个参数
                });
            } else {
                callback(new Error('没有有效的批量操作'), null);
            }
        } else {
            callback(new Error('不是数组'), null);
        }
    }
}
const dbPath = path.resolve(process.cwd(), 'data', 'db', 'leveldb');

export const LevelDB = new LevelDb(dbPath, {});