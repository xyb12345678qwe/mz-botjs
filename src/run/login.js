import { logger } from '../core/index.js'
import { File } from './file.js'
const botNames = ['LLOneBot','ntqq','kook','GSUIDCore']
class BaseConfig {
    #data = null
    constructor(val) {
        this.#data = val
    }
    getLoginConfig() {
        const config = File.readFile('config')
        const args = process.argv.slice(2);
        let bot = {}
        if (botNames.includes(args[0])) {
            if (config.test) {
                for (let i of args) {
                    if (!botNames.includes(i)) {
                        logger.info(`${i}启动失败，请输入正确的机器人名称`)
                        return null;
                    } else {
                        bot[i] = config.test[i]
                    }
                }
            }
        } else {
            if (config[args[0]]) {
                let bots = args.slice(1)
                for (let i of bots) {
                    if (!botNames.includes(i)) {
                        logger.info(`${i}启动失败，请输入正确的机器人名称`)
                        return null;
                    } else {
                        bot[i] = config[args[0]][i]
                    }
                }
            }
        }
        return bot
    }
    /**
     * 读取配置
     * @param key
     * @returns
     */
    get(key) {
        return this.#data[key]
    }
}

/**
 * 机器人配置
 */
export const BotConfig = new BaseConfig()
