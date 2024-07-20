import { segmentKOOK } from '../segment.js'
import { replyController } from '../reply.js'
import { directController } from '../direct.js'

/**
 * @param event 按钮数据
 */
export async function INTERACTION(event) {
  const body = event.extra.body 
  const msg_id = body.msg_id

  /**
   * 制作e消息对象
   */
  const e = {
    platform: 'kook',
    boundaries: 'publick',
    attribute: 'group' ,
    event: 'INTERACTION',
    typing: 'CREATE',
    bot: {
      id: '',
      name: '',
      avatar: ''
    },
    guild_id: '',
    guild_name: '',
    guild_avatar: '',
    channel_name: '',
    channel_id: String(body.target_id),
    attachments: [],
    specials: [],
    //
    at: false,
    at_users: [],
    at_user: undefined,
    msg_id: msg_id,
    // 回调透传信息
    msg: String(event.msg_id) ?? '',
    msg_txt: body.value,
    quote: '',
    open_id: '',

    //
    user_id: String(body.user_id),
    user_name: '',
    user_avatar: '',
    //
    send_at: 0,
    segment: segmentKOOK,
    /**
     *消息发送
     * @param msg
     * @param img
     * @returns
     */
    reply: async (
      msg,
      select
    ) => {
      const channel_id = select?.channel_id ?? body.channel_id
      if (select?.open_id && select?.open_id != '') {
        return await directController(msg, `${channel_id}`, body.user_id)
      }
      return await replyController(msg, `${channel_id}`)
    }
  }

  return
}
