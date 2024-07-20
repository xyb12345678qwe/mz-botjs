import {
  ClientKOOK,
} from '../api.js'
import { segmentKOOK } from '../segment.js'
import { KookBotMessage } from '../bot.js'
import { replyController } from '../reply.js'
import { directController } from '../direct.js'
import { APP } from '../../../plugins/index.js'
/**
 *
 * @param event
 * @returns
 */
export const REACTIONS = async (event) => {
  const body = event.extra.body 


  const data = await ClientKOOK.userChatCreate(body.user_id).then(
    res => res?.data
  )

  const e = {
    platform: 'kook',
    event: 'MESSAGES',
    typing: 'CREATE' ,
    boundaries: 'private',
    attribute:
      event.channel_type == 'GROUP'
        ? 'group'
        : 'single' ,
    bot:  KookBotMessage.get(),
    guild_id: event.target_id, // 频道
    guild_name: '',
    guild_avatar: '',
    channel_name: '',
    channel_id: event.target_id, // 子频道
    attachments: [],
    specials: [],
    //
    at: false,
    at_users: [],
    at_user: undefined,
      msg: '',
    message: '',
    msg_txt: event.content,
    msg_id: event.msg_id,
    quote: '',
    open_id: data?.code ?? '', // 私聊标记 空的 需要创建私聊 每次请求都自动创建
    //
    user_id: body.user_id,
    user_name: '',
    user_avatar: '',
    segment: segmentKOOK,
    send_at: event.msg_timestamp,
    /**
     * 消息发送机制
     * @param content 消息内容
     * @param obj 额外消息 可选
     */
    reply: async (
      msg,
      select
    ) => {
      const channel_id = select?.channel_id ?? event.target_id // 子频道
      if (select?.open_id) {
        directController(msg, channel_id, select?.open_id)
        return false
      }
      return await replyController(msg, channel_id)
    }
  }
  return
}
