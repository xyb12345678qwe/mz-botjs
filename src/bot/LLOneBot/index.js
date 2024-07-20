import { APP } from '../../plugins/index.js'
import { MEMBERS, SUB_TYPE } from './MESSAGE/index.js'
import { LLOneBotWS } from './ws.js'
import { ControllerLLOneBot } from './controller.js'
import { Message } from '../../run/message.js'
export class LLOneBotrun {
    #wsUrl = "ws://localhost:3001"
    ws
    #originalOnmessage
    constructor() {
        this.#originalOnmessage = this.handleMessage.bind(this); // 使用闭包确保正确的上下文
    }
    // 动态移除消息处理程序
    removeMessageHandler() {
        if (this.ws) {
            this.ws.onmessage = null;
        }
    }
    run() {
        // ws连接
        this.ws = new WebSocket(this.#wsUrl);
        // 当WebSocket连接打开时的事件处理函数
        this.ws.onopen = () => {
            logger.info("LLOneBot[ws]连接成功");
            LLOneBotWS.ws = this.ws
            ControllerLLOneBot.ws = this.ws
            Message.runLLOneBot()
        };
        // 当WebSocket连接发生错误时的事件处理函数
        this.ws.onerror = (error) => {
            logger.error(`LLOneBot[ws]连接发生错误: ${error.message}`);
        };
        // 当WebSocket连接关闭时的事件处理函数
        this.ws.onclose = () => {
            logger.info("LLOneBot[ws]连接已关闭");
        };
        // 设置WebSocket接收到消息时的事件处理函数
        this.ws.onmessage = this.#originalOnmessage;

    }
    handleMessage(event) {
        const message = JSON.parse(event.data);
        if (message.meta_event_type == "heartbeat") {
            logger.info(`[Lagrange]收到心跳包`)
        } else if (message?.message_type == "group" || message?.message_type == "private") {
            // console.log(message.message);
            logger.info(`[LLOneBot][${message.sender.nickname}(${message.user_id})]: ${message.raw_message}`);

            APP.response(this.configuratione(message))
        } else if (SUB_TYPE.includes(message.sub_type)) {
            //直接扔给MEMBERS处理
            MEMBERS.response(event)
        }
        else {
            logger.info(`[LLOneBot]: ${JSON.stringify(message)}`);
        }
    }

    /**
     * 构造e
     * @param {*} message 
     */
    configuratione(message) {
        let e = {
            event: 'MESSAGES',
            platform: 'LLOneBot',
            user_name: message.sender.nickname,
            user_id: message.user_id,
            msg: message.raw_message,
            message: message.raw_message,
            message_type: message.message_type,
            at_user: null,
            at_users: [],
            group_id: message.group_id,
            reply: (msg) =>
                LLOneBotWS.sendMsg({
                    "message_type": "group",
                    "group_id": message.group_id,
                    "message": msg
                })
            ,
            replyPrivate: (user_id, msg) =>
                LLOneBotWS.sendMsg({
                    "message_type": "private",
                    "user_id": user_id,
                    "message": msg
                })
            , //发送私聊消息
            sendLike: function (user_id, times) {
                LLOneBotWS.sendLike(user_id, times)
            }, //点赞
            /**
             * 踢出群聊
             * @param {*} user_id 要踢的 QQ 号
             * @param {*} group_id 群号
             * @param {*} reject_add_request 拒绝此人的加群请求 boolean
             */
            setGroupKick: function (user_id, group_id, reject_add_request = false) {
                LLOneBotWS.setGroupKick(user_id, group_id, reject_add_request)
            },
            /**
             * 群组单人禁言
             * @param {*} user_id 要禁言的 QQ 号
             * @param {*} group_id 群号
             * @param {*} duration 禁言时长，单位秒，0 表示取消禁言
             */
            setGroupBan: function (user_id, group_id, duration) {
                LLOneBotWS.setGroupBan(user_id, group_id, duration)
            },
            /**
             * 群组全员禁言
             * @param {*} group_id 群号
             * @param {*} enable 是否禁言
             */
            setGroupWholeBan: function (group_id, enable) {
                LLOneBotWS.setGroupWholeBan(group_id, enable)
            },
            /**
             * 群组设置管理员
             * @param {*} user_id 要设置管理员的 QQ 号
             * @param {*} group_id 群号
             * @param {*} enable true 为设置，false 为取消
             */
            setGroupAdmin: function (user_id, group_id, enable) {
                LLOneBotWS.setGroupAdmin(user_id, group_id, enable)
            },
            /**
             * 设置群名片（群备注）
             * @param {*} user_id 要设置的 QQ 号
             * @param {*} group_id 群号
             * @param {*} card 群名片内容，不填或空字符串表示删除群名片
             */
            setGroupCard: function (user_id, group_id, card) {
                LLOneBotWS.setGroupCard(user_id, group_id, card)
            },
            /**
             * 设置群名
             * @param {*} group_id 群号
             * @param {*} group_name 新群名
             */
            setGroupName: function (group_id, group_name) {
                LLOneBotWS.setGroupName(group_id, group_name)
            },
            /**
             * 退出群组
             * @param {*} group_id 群号
             * @param {*} is_dismiss 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散
             */
            setGroupLeave: function (group_id, is_dismiss) {
                LLOneBotWS.setGroupLeave(group_id, is_dismiss)
            },
            /**
             * 处理加好友请求
             * @param {*} flag 加好友请求的 flag（需从上报的数据中获得）
             * @param {*} approve 是否同意请求	
             * @param {*} remark 添加后的好友备注（仅在同意时有效）
             */
            setFriendAddRequest: function (flag, approve, remark) {
                LLOneBotWS.setFriendAddRequest(flag, approve, remark)
            },
            /**
             * 处理加群请求／邀请
             * @param {*} flag 加群请求的 flag（需从上报的数据中获得）
             * @param {*} sub_type add 或 invite，请求类型（需要和上报消息中的 sub_type 字段相符）
             * @param {*} approve 是否同意请求／邀请
             * @param {*} reason 拒绝理由（仅在拒绝时有效）
             */
            setGroupAddRequest: function (flag, sub_type, approve, reason) {
                LLOneBotWS.setGroupAddRequest(flag, sub_type, approve, reason)
            },
            /**
             * 获取好友列表
             * @returns 
             */
            getFriendList: function () {
                return LLOneBotWS.getFriendList()
            },
            /**
             * 获取群信息
             * @param {*} group_id 群号
             * @param {*} no_cache 是否不使用缓存（使用缓存可能更新不及时，但响应更快）
             * @returns 
             */
            getGroupInfo(group_id, no_cache) {
                return LLOneBotWS.getGroupInfo(group_id, no_cache)
            },
            /**
             * 获取群列表
             * @returns 
             */
            getGroupList() {
                return LLOneBotWS.getGroupList()
            },
            /**
             * 获取群成员信息
             * @param {*} group_id 	群号
             * @param {*} user_id QQ 号
             * @param {*} no_cache 是否不使用缓存（使用缓存可能更新不及时，但响应更快)
             * @returns 
             */
            getGroupMemberInfo(group_id, user_id, no_cache) {
                return LLOneBotWS.getGroupMemberInfo(group_id, user_id, no_cache)
            }

        }

        const atMessage = message.message.find(item => item.type == 'at');
        if (atMessage && atMessage.length > 0) {
            e.at_user = atMessage[0].data.qq
            for (let user of atMessage) {
                at_users.push(user.data.qq)
            }
        }
        return e
    }

}
// export const LLOneBotRun = new LLOneBotrun()
export { LLOneBotWS, ControllerLLOneBot }