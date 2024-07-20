import { LLOneBotrun } from '../bot/index.js'
import { APP } from '../plugins/index.js'
import { APPEvent } from '../plugins/pluginEvent.js'
import { execSync } from 'child_process';
import { NTQQ, Lagrange, GSUIDCore } from '../bot/index.js';
import { BotConfig } from './login.js';
import { NTQQconversation, KookClient, Kookconversation, KookBotMessage, ClientKOOK } from '../bot/index.js'
import { FileConfig } from '../file/index.js'
import { File } from './file.js'
import { logger } from '../core/index.js';

class run {
    async run(data) {
        const { isBot } = data
        if (!isBot) return
        logger.info("Mz-Bot start .....")
        global.isrl = true
        const server = File.readFile("server")
        const serverKeys = Object.keys(server)
        for (const serverKey of serverKeys) {
            if (FileConfig.get(serverKey)) {
                FileConfig.set(serverKey, server[serverKey])
            }
        }
        const args = process.argv.slice(2);
        await APP.loadAPP() //加载APP
        await APPEvent.load() //加载事件
        const bot = BotConfig.getLoginConfig()
        if (args.includes("LLOneBot")) {
            logger.info("LLOneBot start .....")
            new LLOneBotrun().run()
        }
        if (args.includes("ntqq")) {
            logger.info("NTQQ start .....")
            const netNtqq = new NTQQ()
            netNtqq.setBot(bot.ntqq)
            netNtqq.connect(NTQQconversation)
        }
        if (args.includes('Lagrange') || args.includes('lagrange') || args.includes('le')) {
            logger.info(`Lagrange start ....`)
            const newle = new Lagrange()
            newle.setWsUrl()
            newle.run()
        }
        if (args.includes('kook')) {
            logger.info(`kook start ....`)
            const newkook = new KookClient()
            newkook.set(bot.kook)
            newkook.connect(Kookconversation)
                .then(async () => {
                    const data = await ClientKOOK.userMe().then(res => res?.data)
                    if (data) {
                        KookBotMessage.set('id', data.id)
                        KookBotMessage.set('name', data.username)
                        KookBotMessage.set('avatar', data.avatar)
                    }
                })
        }
        if (args.includes('GSUIDCore')) {
            const GSUIDCoreBot = new GSUIDCore()
            GSUIDCoreBot.run()
            global.GSUIDCoreBot = GSUIDCoreBot
        }
        process.title = 'Mz-bot running'
    }
}
export const RunBot = new run()
