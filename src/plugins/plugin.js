import { join } from 'path'
import fs from 'fs'
import { promisify } from 'util';
import chalk from 'chalk'
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
class App {
    #plugins = {} //插件
    #command = [] //指令
    #bigRegex  //大正则
    MEMBERS = {}
    #example = []
    async load() {
        const dir = join(process.cwd(), 'plugins')
        //创建文件夹
        if (!fs.existsSync(dir)) {
            await mkdir(dir);
        }
        const flies = await readdir(dir);
        if (flies.length == 0) return []
        // 读取配置
        const open = /.+/
        const close = undefined
        // 排除
        const apps = flies
            .filter(item => open.test(item))
            .filter(item => {
                if (!close) return true
                return !close.test(item)
            })
        const main = 'index'
        const types = ['js', 'ts']
        const promises = apps.flatMap(appname =>
            types.map(typing => {
                const path = `${dir}/${appname}/${main}.${typing}`;
                return fs.existsSync(path) ? this.readScript(path) : null;
            }).filter(Boolean) // 使用 Boolean 函数过滤掉 null 值
        );
        return Promise.all(promises)
    }
    async loadAPP() {
        let pluginId = 1;
        let MEMBERSId = 1;
        const apps = await this.load();
        // 使用 Promise.all 和 map 来处理并行操作
        const appInstancesPromises = apps.map(app => {
            return Object.values(app.apps).map(appInstance => {
                const newappInstance = new appInstance();
                if(newappInstance.event != 'MEMBERS'){
                    this.#plugins[pluginId++] = appInstance;
                }
                // 创建 appInstance 的实例
                return newappInstance
            });
        });

        // flat() 方法用于将嵌套数组拍平
        const appInstances = (await Promise.all(appInstancesPromises)).flat();

        // 遍历所有实例，并将它们的 rule 属性合并到 #command 中
        appInstances.forEach(instance => {
            if (instance.event == 'MEMBERS') { //处理成员变化
                this.MEMBERS[MEMBERSId] = instance //直接存实例
                MEMBERSId++
            } else if (instance.event == 'MESSAGES') { //处理正常消息
                this.#command = this.#command.concat(instance.rule);
            }
            
        });

        this.configuredBigRegex() //构造大正则
    }
    /**
     * 构造大正则
     */
    configuredBigRegex() {
        const regexParts = this.#command.map(expr => `(?:${expr.reg.source})`).join('|');
        this.#bigRegex = new RegExp(`^(${regexParts})$`);
    }
    async readScript(path) {
        return await import(`file://${path}`).catch(err => {
            logger.error(`file://${path}`)
            this.loadError('local dev', err)
        })
    }
    loadError(appname, err) {
        // 属于依赖缺失
        const match = /Cannot find package '(.+)' imported from/.exec(err.message)
        if (match && match[1]) {
            const packageName = match[1]
            logger.error(`[APP] [${appname}] 缺失 ${packageName} 包`)
            // 发送消息
            process.send?.({
                type: 'lack-of-package',
                message: {
                    packageName
                }
            })
            return
        } else {
            // 其他错误
            logger.error(`[APP] [${appname}]`, err)
            process.send?.({
                type: 'error',
                message: err
            })
        }
    }
    async response(e) {
        const s = e.message;
        if (!this.#bigRegex.test(s)) return;

        // 获取匹配的组，以确定是哪个正则表达式匹配的
        const match = s.match(this.#bigRegex);
        // 找到匹配的正则表达式对象
        const expr = this.#command.find(expr => expr.reg.test(match[0]));

        // 避免在循环中重复测试相同的字符串
        const plugins = Object.values(this.#plugins)

        for (let plugin of plugins) {
            const newPlugin = new plugin();
            if (newPlugin.event == 'MEMBERS') continue;
            newPlugin.e = e;
            newPlugin.rule.filter(rule => rule.reg.test(s)).map(async rule => {
                if (rule.reg.test(s)) {
                    const gold = chalk.hex('#FFD700'); // 金色代码
                    let startTime = new Date().getTime()
                    await newPlugin[rule.fnc](e)
                    let endTime = new Date().getTime(); // 操作结束后的时间戳
                    let duration = Math.round(endTime - startTime) + 'ms'; // 计算持续时间（毫秒）
                    logger.info(`[APP] [${newPlugin.constructor.name}] [${rule.fnc}] [${gold(duration)}]`)
                }
            })
        }

    }
    addExample(module) { }
    get(key) {
        return this[key]
    }

}
export const APP = new App()
