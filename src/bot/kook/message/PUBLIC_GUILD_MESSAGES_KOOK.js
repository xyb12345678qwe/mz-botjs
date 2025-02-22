import { ClientKOOK } from '../api.js'
import { segmentKOOK } from '../segment.js'
import { KookBotMessage } from '../bot.js'
import { replyController } from '../reply.js'
import { directController } from '../direct.js'
import { APP } from '../../../plugins/index.js'
/**
 * 群聊消息
 * @param event
 * @returns
 */
export const PUBLIC_GUILD_MESSAGES_KOOK = async (event) => {
  if (event.extra?.author?.bot) return false

  let at = false
  const at_users = []
  let msg = event?.extra?.kmarkdown?.raw_content ?? event.content
  /**
   * 艾特类型所得到的
   * 包括机器人在内
   */
  const mention_role_part = event.extra.kmarkdown?.mention_role_part ?? []
  for await (const item of mention_role_part) {
    at = true
    at_users.push({
      id: item.role_id,
      name: item.name,
      avatar: '',
      bot: true
    })
    msg = msg.replace(`(rol)${item.role_id}(rol)`, '').trim()
  }
  /**
   * 艾特用户所得到的
   */
  const mention_part = event.extra.kmarkdown?.mention_part ?? []
  for await (const item of mention_part) {
    at = true
    at_users.push({
      id: item.id,
      name: item.username,
      avatar: item.avatar,
      bot: false
    })
    msg = msg.replace(`(met)${item.id}(met)`, '').trim()
  }
  let at_user = undefined
  if (at) {
    if (at_users[0] && at_users[0].bot != true) {
      at_user = at_users[0]
    }
  }


  const avatar = event.extra.author.avatar

  const data = await ClientKOOK.userChatCreate(event.extra.author.id).then(
    res => res?.data
  )

  const e = {
    platform: 'kook',
    event: 'MESSAGES',
    typing: 'CREATE',
    boundaries: 'private',
    attribute:
      event.channel_type == 'GROUP'
        ? 'group'
        : 'single' ,
    bot: KookBotMessage.get(),
    guild_id: event.extra.guild_id, // 频道
    guild_name: '',
    guild_avatar: '',
    channel_name: '',
    channel_id: event.target_id, // 子频道
    attachments: [],
    specials: [],
    //
    at,
    at_users,
    at_user,
    msg,
    message:msg,
    msg_txt: event?.extra?.kmarkdown?.raw_content ?? event.content,
    msg_id: event.msg_id,
    quote: '',
    open_id: data?.code ?? '', // 私聊标记 空的 需要创建私聊 每次请求都自动创建
    //
    user_id: event.extra.author.id,
    user_name: event.extra.author.username,
    user_avatar: avatar.substring(0, avatar.indexOf('?')),
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
      if (select?.open_id && select?.open_id != '') {
        directController(msg, channel_id, select?.open_id)
        return false
      }
      return await replyController(msg, channel_id)
    }
  }
  APP.response(e)
  
  return
}
