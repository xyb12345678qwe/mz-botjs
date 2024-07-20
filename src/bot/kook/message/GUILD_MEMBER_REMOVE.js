import { KookBotMessage } from '../bot.js'
import { directController } from '../direct.js'
import { replyController } from '../reply.js'
import { segmentKOOK } from '../segment.js'
import { APPEvent } from "../../../plugins/index.js";

/**
 * 当成员移除时
 * @param event
 * @returns
 */
export const GUILD_MEMBER_REMOVE = async (event) => {
  const body = event.extra.body
  const e = {
    platform: 'kook',
    event: 'MEMBERS' ,
    typing: 'DELETE',
    boundaries: 'publick',
    attribute: 'group' ,
    bot:KookBotMessage.get(),
    attachments: [],
    specials: [],
    guild_id: event.target_id,
    guild_name: '',
    guild_avatar: '',
    channel_name: '',
    channel_id: '',
    quote: '',
    open_id: '',
    //
    at: false,
    at_user: undefined,
    at_users: [],
    msg: '',
    msg_txt: '',
    msg_id: event.msg_id,
    //
    user_id: body.user_id,
    user_name: '',
    user_avatar: '',
    segment: segmentKOOK,
    send_at: new Date(body.joined_at).getTime(),
    /**
     * 发现消息
     * @param msg
     * @param img
     * @returns
     */
    reply: async (
      msg,
      select
    ) => {
      const msg_id = select?.msg_id ?? false
      const channel_id = select?.channel_id ?? event.target_id
      if (!msg_id) return false
      if (select?.open_id && select?.open_id != '') {
        return await directController(msg_id, channel_id, body.user_id)
      }
      if (!channel_id) return false
      return await replyController(msg, `${channel_id}`)
    }
  }
  APPEvent.MEMBERS(e)
  return
}
