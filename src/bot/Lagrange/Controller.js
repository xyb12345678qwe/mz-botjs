//controller
import { LagrangeWS } from "./ws.js"
/**
 * LLOneBot主动控制器
 */
export class controllerLagrange {
    ws = null //LLOneBot 加载时添加
    /**
     * LLOneBot群聊主动消息
     * @param {*} group_id 群聊id
     * @param {*} msg 要发送的消息
     */
    reply(group_id, msg) {
        LagrangeWS.sendMsg({
            "message_type": "group",
            "group_id": group_id,
            "message": msg
        })
    }
    /**
     * LLOneBot私聊主动消息
     * @param {*} user_id 用户id
     * @param {*} msg 要发送的消息
     */
    replyPrivate(user_id, msg) {
        LagrangeWS.sendMsg({
            "message_type": "private",
            "user_id": user_id,
            "message": msg
        })
    }
    /**
 * 获取好友列表
 * @returns 
 */
    async getFriendList() {
        return await LagrangeWS.getFriendList()
    }
    /**
             * 获取群列表
             * @returns 
             */
    async getGroupList() {
        return await LagrangeWS.getGroupList()
    }
}
export const ControllerLagrange = new controllerLagrange()