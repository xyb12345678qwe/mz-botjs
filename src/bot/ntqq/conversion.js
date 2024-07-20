import { BotMessage } from './bot.js'
import { GROUP_AT_MESSAGE_CREATE } from './message/index.js'
/**
 *
 * @param t
 * @param d
 */
export function NTQQconversation(t, d) {
  switch (t) {
    case 'READY': {
      BotMessage.set('id', d.user.id)
      BotMessage.set('name', d.user.name)
      break
    }
    case 'GROUP_AT_MESSAGE_CREATE': {
      logger.info(`[ntqq]群聊消息:${d.content}`)
      GROUP_AT_MESSAGE_CREATE(d)
      break
    }
  }
}
