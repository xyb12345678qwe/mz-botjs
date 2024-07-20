import { APP } from '../../../plugins/index.js'
import { replyController } from '../reply.js'
import { segmentNTQQ } from '../segment.js'
//群聊消息
export async function GROUP_AT_MESSAGE_CREATE(d) {
    const e = {
        event: 'MESSAGES',
        platform: 'ntqq',
        msg: (d.content).trim(),
        message: (d.content).trim(),
        group_id: d.group_id,
        user_id: d.author.user_id,
        at_user: null,
        at_users: [],
        segment:segmentNTQQ,
        /**
    * 消息发送机制
    * @param msg 消息
    * @param img
    * @returns
    */
        reply: async (
            msg
        ) =>{
            const msg_id = d.id
            const group_id =  d.group_id
            return await replyController(msg, group_id, msg_id)
        }
    }
    await APP.response(e)
}