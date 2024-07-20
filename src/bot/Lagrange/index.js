import { APP } from '../../plugins/index.js'
import { File } from '../../run/file.js'
import { LagrangeWS } from './ws.js'
import { ControllerLagrange } from './Controller.js'
import { Message } from '../../run/index.js'
import { segmentLLOneBot } from '../LLOneBot/segment.js'
import { SUB_TYPE,MEMBERS } from './message/index.js'
export class Lagrange {
    #wsUrl
    ws
    #originalOnmessage
    constructor() {
        this.#originalOnmessage = this.handleMessage.bind(this); // 使用闭包确保正确的上下文
    }
    setWsUrl() {
        let appsetting = File.readFile('appsettings')
        if (!appsetting) {
            logger.error(`[Lagrange] appsettings.json not found,启动失败`);
            return;
        }
        if (!appsetting.Implementations.find(item => item.Type == 'ForwardWebSocket')) {
            appsetting.Implementations.push({
                "Type": "ForwardWebSocket",
                "Host": "127.0.0.1",
                "Port": 8081,
                "HeartBeatInterval": 5000,
                "HeartBeatEnable": true,
                "AccessToken": "",
            })
            File.writeFileJson('appsettings', appsetting)
        } else {
            const wsSetting = appsetting.Implementations.find(item => item.Type == 'ForwardWebSocket')
            this.#wsUrl = `ws://${wsSetting.Host}:${wsSetting.Port}`
        }
    }
    run() {
        if (!this.#wsUrl) {
            this.setWsUrl()
            this.run()
            return;
        }
        this.ws = new WebSocket(this.#wsUrl);

        // 当WebSocket连接打开时的事件处理函数
        this.ws.onopen = () => {
            logger.info("Lagrange[ws]连接成功");
            LagrangeWS.ws = this.ws;
            ControllerLagrange.ws = this.ws
            Message.runLagrange()
        };
        // 当WebSocket连接发生错误时的事件处理函数
        this.ws.onerror = (error) => {
            logger.error(`Lagrange[ws]连接发生错误: ${error.message}`);
        };
        // 当WebSocket连接关闭时的事件处理函数
        this.ws.onclose = () => {
            logger.info("Lagrange[ws]连接已关闭");
        };
        // 设置WebSocket接收到消息时的事件处理函数
        this.ws.onmessage = this.#originalOnmessage;
    }
    handleMessage(event) {
        const message = JSON.parse((event.data).toString('utf-8'));
        if (message.meta_event_type == "heartbeat") {
            logger.info(`[Lagrange]收到心跳包`)
        } else if (message.message_type == 'group') {
            logger.info(`[Lagrange][group][${message.sender.nickname}(${message.sender.user_id})]${message.raw_message}`)
            const e = this.configuratione(message)
            APP.response(e)
        }else if (SUB_TYPE.includes(message.sub_type)) {
            //直接扔给MEMBERS处理
            MEMBERS.response(event)
        }
    }
    /**
     * 构造e
     * @param {*} message 
     */
    configuratione(message) {
        let e = {
            event: 'MESSAGES',
            platform: 'Lagrange',
            user_id: message.sender.user_id,
            user_name: message.sender.nickname,
            msg: message.raw_message,
            message: message.raw_message,
            message_type: message.message_type,
            at_user: null,
            at_users: [],
            group_id: message.group_id,
            segment:segmentLLOneBot ,
            reply: (msg) =>
                LagrangeWS.sendMsg({
                    "message_type": "group",
                    "group_id": message.group_id,
                    "message": msg
                })
            ,
            replyPrivate: (user_id, msg) =>
                LagrangeWS.sendMsg({
                    "message_type": "private",
                    "user_id": user_id,
                    "message": msg
                })
            , //发送私聊消息
            sendLike: function (user_id, times) {
                LagrangeWS.sendLike(user_id, times)
            }, //点赞
            /**
             * 踢出群聊
             * @param {*} user_id 要踢的 QQ 号
             * @param {*} group_id 群号
             * @param {*} reject_add_request 拒绝此人的加群请求 boolean
             */
            setGroupKick: function (user_id, group_id, reject_add_request = false) {
                LagrangeWS.setGroupKick(user_id, group_id, reject_add_request)
            },
            /**
             * 群组单人禁言
             * @param {*} user_id 要禁言的 QQ 号
             * @param {*} group_id 群号
             * @param {*} duration 禁言时长，单位秒，0 表示取消禁言
             */
            setGroupBan: function (user_id, group_id, duration) {
                LagrangeWS.setGroupBan(user_id, group_id, duration)
            },
            /**
             * 群组全员禁言
             * @param {*} group_id 群号
             * @param {*} enable 是否禁言
             */
            setGroupWholeBan: function (group_id, enable) {
                LagrangeWS.setGroupWholeBan(group_id, enable)
            },
            /**
             * 群组设置管理员
             * @param {*} user_id 要设置管理员的 QQ 号
             * @param {*} group_id 群号
             * @param {*} enable true 为设置，false 为取消
             */
            setGroupAdmin: function (user_id, group_id, enable) {
                LagrangeWS.setGroupAdmin(user_id, group_id, enable)
            },
            /**
             * 设置群名片（群备注）
             * @param {*} user_id 要设置的 QQ 号
             * @param {*} group_id 群号
             * @param {*} card 群名片内容，不填或空字符串表示删除群名片
             */
            setGroupCard: function (user_id, group_id, card) {
                LagrangeWS.setGroupCard(user_id, group_id, card)
            },
            /**
             * 设置群名
             * @param {*} group_id 群号
             * @param {*} group_name 新群名
             */
            setGroupName: function (group_id, group_name) {
                LagrangeWS.setGroupName(group_id, group_name)
            },
            /**
             * 退出群组
             * @param {*} group_id 群号
             * @param {*} is_dismiss 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散
             */
            setGroupLeave: function (group_id, is_dismiss) {
                LagrangeWS.setGroupLeave(group_id, is_dismiss)
            },
            /**
             * 处理加好友请求
             * @param {*} flag 加好友请求的 flag（需从上报的数据中获得）
             * @param {*} approve 是否同意请求	
             * @param {*} remark 添加后的好友备注（仅在同意时有效）
             */
            setFriendAddRequest: function (flag, approve, remark) {
                LagrangeWS.setFriendAddRequest(flag, approve, remark)
            },
            /**
             * 处理加群请求／邀请
             * @param {*} flag 加群请求的 flag（需从上报的数据中获得）
             * @param {*} sub_type add 或 invite，请求类型（需要和上报消息中的 sub_type 字段相符）
             * @param {*} approve 是否同意请求／邀请
             * @param {*} reason 拒绝理由（仅在拒绝时有效）
             */
            setGroupAddRequest: function (flag, sub_type, approve, reason) {
                LagrangeWS.setGroupAddRequest(flag, sub_type, approve, reason)
            },
            /**
             * 获取好友列表
             * @returns 
             */
            getFriendList: function () {
                return LagrangeWS.getFriendList()
            },
            /**
             * 获取群信息
             * @param {*} group_id 群号
             * @param {*} no_cache 是否不使用缓存（使用缓存可能更新不及时，但响应更快）
             * @returns 
             */
            getGroupInfo(group_id, no_cache) {
                return LagrangeWS.getGroupInfo(group_id, no_cache)
            },
            /**
             * 获取群列表
             * @returns 
             */
            getGroupList() {
                return LagrangeWS.getGroupList()
            },
            /**
             * 获取群成员信息
             * @param {*} group_id 	群号
             * @param {*} user_id QQ 号
             * @param {*} no_cache 是否不使用缓存（使用缓存可能更新不及时，但响应更快)
             * @returns 
             */
            getGroupMemberInfo(group_id, user_id, no_cache) {
                return LagrangeWS.getGroupMemberInfo(group_id, user_id, no_cache)
            },
            /**
    * 获取收藏表情
    * @returns 
    */
            fetchCustomFace() {
                return LagrangeWS.fetchCustomFace()
            },
            /**
         * 
         * @param {*} user_id 好友 ID
         * @param {*} message_id 要获取的消息的最后一条的 ID
         * @param {*} count 获取的消息数量
         */
            getFriendMsgHistory(user_id, message_id, count) {
                return LagrangeWS.getFriendMsgHistory(user_id, message_id, count)
            },
            /**
     * 
     * @param {*} group_id 群组 ID
     * @param {*} message_id 要获取的消息的最后一条的 ID
     * @param {*} count 获取的消息数量
     * @returns 
     */
            getGroupMsgHistory(group_id, message_id, count) {
                return LagrangeWS.getGroupMsgHistory(group_id, message_id, count)
            },
            /**构造合并转发消息
             *  messages = [
                {
                    "type": "node",
                    "data": {"name": "小助手", "uin": "2854196310", "content": [MessageSegment.text("测试消息")]},
                }
            ]
             * @param {*} messages 
             * @returns 
             */
            sendForwardMsg(messages) {
                return LagrangeWS.sendForwardMsg(messages)

            },
            /**
             * 发送合并转发 (群聊)
             * @param {*} group_id 
             * @param {*} messages 
             * @returns 
             */
            sendGroupForwardMsg(group_id, messages) {
                return Lagrange.sendGroupForwardMsg(group_id, messages)
            },
            /**
             * 发送合并转发 (好友)
             * @param {*} user_id 	好友 QQ 号
             * @param {*} messages 
             * @returns 
             */
            sendPrivateForwardMsg(user_id, messages) {
                return Lagrange.sendPrivateForwardMsg(user_id, messages)
            },
            /**
             * 上传群文件
             * @param {*} group_id 群号
             * @param {*} file 本地文件路径
             * @param {*} name 	储存名称
             * @param {*} folder_id 父目录 ID（可选）
             */
            uploadGroupFile(group_id, file, name, folder_id) {
                return Lagrange.uploadGroupFile(group_id, file, name, folder_id)
            },
            /**
             * 获取群根目录文件列表
             * @param {*} group_id 群号
             * @returns 
             */
            getGroupRootFiles(group_id) {
                return Lagrange.getGroupRootFiles(group_id)
            },
            /**
             * 获取群子目录文件列表
             * @param {*} group_id 	群号
             * @param {*} folder_id 文件夹 ID
             * @returns 
             */
            getGroupFilesByFolder(group_id, folder_id) {
                return Lagrange.getGroupFilesByFolder(group_id, folder_id)
            },
            /**
             * 获取群文件资源链接
             * @param {*} group_id 群号
             * @param {*} file_id 文件 ID
             * @param {*} busid 文件类型
             */
            getGroupFileUrl(group_id, file_id, busid) {
                return Lagrange.getGroupFileUrl(group_id, file_id, busid)
            },
            /**
             * 好友戳一戳
             * @param {*} user_id 对方 QQ 号
             * @returns 
             */
            friendPoke(user_id) {
                return Lagrange.friendPoke(user_id)
            },
            /**
             * 群组戳一戳
             * @param {*} group_id 群号
             * @param {*} user_id 	对方 QQ 号
             * @returns 
             */
            groupPoke(group_id, user_id) {
                return Lagrange.groupPoke(group_id, user_id)
            },
            /**
             * 设置群组专属头衔
             * @param {*} group_id 群号
             * @param {*} user_id 要设置的 QQ 号
             * @param {*} special_title 	专属头衔, 空字符串表示删除专属头衔
             * @returns 
             */
            setGroupSpecialTitle(group_id, user_id, special_title) {
                return Lagrange.setGroupSpecialTitle(group_id, user_id, special_title)
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
export { ControllerLagrange }