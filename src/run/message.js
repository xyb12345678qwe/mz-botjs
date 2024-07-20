import { File } from './file.js'
import { ControllerLLOneBot,ControllerLagrange } from '../bot/index.js'
const master = File.readFile('master')
class message {
    runLLOneBot() {
        if (master.masters.length > 0) {
            for (let qq of master.masters) {
                ControllerLLOneBot.replyPrivate(qq, '[LLOneBot]欢迎使用[Mz-bot]')
            }
        }
    }
    runLagrange() {
        if (master.masters.length > 0) {
            for (let qq of master.masters) {
                ControllerLagrange.replyPrivate(qq, '[Lagrange]欢迎使用[Mz-bot]')
            }
        }
    }
}
export const Message = new message()