import { APP } from '../../../plugins/index.js'
import { segmentKOOK } from '../segment.js'
import { KookBotMessage } from '../bot.js'
import { directController } from '../direct.js'

/**
 * 私聊消息
 * @param event
 * @returns
 */
export const MESSAGES = async (event) => {
    if (event.extra?.author?.bot) return false

    const open_id = event.extra.code


    const avatar = event.extra.author.avatar

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
        guild_id: '', // 频道号
        guild_name: '',
        guild_avatar: '',
        channel_name: event.extra.channel_name,
        channel_id: event.target_id, // 子频道
        attachments: [],
        specials: [],
        //
        at: false,
        at_users: [],
        at_user: undefined,
        msg: event?.extra?.kmarkdown?.raw_content ?? event.content,
        message: event?.extra?.kmarkdown?.raw_content ?? event.content,
        msg_txt: event?.extra?.kmarkdown?.raw_content ?? event.content,
        msg_id: event.msg_id,
        quote: '',
        open_id: open_id,
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
            const channel_id = select?.channel_id ?? event.target_id
            return await directController(msg, channel_id, select?.open_id ?? open_id)
        }
    }
    APP.response(e)
    return
}
