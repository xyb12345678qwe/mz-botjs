export class LLOneBotws {
    ws = null
    sendMsg(params) {
        let { message, group_id, user_id, message_type } = params
        if (this.ws.readyState === WebSocket.OPEN) {
            if (Buffer.isBuffer(message)) {
                let base64 = message.toString('base64')
                logger.info(`[LLOneBot][sendMsg]: 发送图片`)
                message = `[CQ:image,file=base64://${base64}]`
            }

            this.ws.send(JSON.stringify({
                "action": "send_msg",
                params: {
                    message,
                    group_id,
                    user_id,
                    message_type
                }
            }))
        } else if (this.ws.readyState === WebSocket.OPENING) {
            // 如果WebSocket正在打开，可以设置一个事件监听，一旦连接打开就发送消息
            this.ws.onopen = () => {
                this.sendMsg(params); // 重新调用sendMsg函数
            };
        }
    }
    /**
     * 点赞
     * @param {*} user_id 
     * @param {*} times 
     */
    sendLike(user_id, times) {
        this.ws.send(JSON.stringify({
            "action": "send_like",
            "params": {
                "user_id": user_id,
                "times": times
            }
        }))
    }
    /**
             * 踢出群聊
             * @param {*} user_id 要踢的 QQ 号
             * @param {*} group_id 群号
             * @param {*} reject_add_request 拒绝此人的加群请求 boolean
             */
    setGroupKick(user_id, group_id, reject_add_request = false) {
        this.ws.send(JSON.stringify({
            "action": "set_group_kick",
            "params": {
                "user_id": user_id,
                "group_id": group_id,
                "reject_add_request": reject_add_request
            }
        }))
    }
    /**
            * 群组单人禁言
            * @param {*} user_id 要禁言的 QQ 号
            * @param {*} group_id 群号
            * @param {*} duration 禁言时长，单位秒，0 表示取消禁言
            */
    setGroupBan(user_id, group_id, duration) {
        this.ws.send(JSON.stringify({
            "action": "set_group_ban",
            "params": {
                "user_id": user_id,
                "group_id": group_id,
                "duration": duration
            }
        }))
    }
    /**
             * 群组全员禁言
             * @param {*} group_id 群号
             * @param {*} enable 是否禁言
             */
    setGroupWholeBan(group_id, enable) {
        this.ws.send(JSON.stringify({
            "action": "set_group_whole_ban",
            "params": {
                "group_id": group_id,
                "enable": enable
            }
        }))
    }
    /**
             * 群组设置管理员
             * @param {*} user_id 要设置管理员的 QQ 号
             * @param {*} group_id 群号
             * @param {*} enable true 为设置，false 为取消
             */
    setGroupAdmin(user_id, group_id, enable) {
        this.ws.send(JSON.stringify({
            "action": "set_group_admin",
            "params": {
                "user_id": user_id,
                "group_id": group_id,
                "enable": enable
            }
        }))
    }
    /**
             * 设置群名片（群备注）
             * @param {*} user_id 要设置的 QQ 号
             * @param {*} group_id 群号
             * @param {*} card 群名片内容，不填或空字符串表示删除群名片
             */
    setGroupCard(user_id, group_id, card) {
        this.ws.send(JSON.stringify({
            "action": "set_group_card",
            "params": {
                "user_id": user_id,
                "group_id": group_id,
                "card": card
            }
        }))
    }
    /**
            * 设置群名
            * @param {*} group_id 群号
            * @param {*} group_name 新群名
            */
    setGroupName(group_id, name) {
        this.ws.send(JSON.stringify({
            "action": "set_group_name",
            "params": {
                "group_id": group_id,
                "name": name
            }
        }))
    }
    /**
             * 退出群组
             * @param {*} group_id 群号
             * @param {*} is_dismiss 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散
             */
    setGroupLeave(group_id, is_dismiss) {
        this.ws.send(JSON.stringify({
            "action": "set_group_leave",
            "params": {
                "group_id": group_id,
                "is_dismiss": is_dismiss
            }
        }))
    }
    /**
             * 处理加好友请求
             * @param {*} flag 加好友请求的 flag（需从上报的数据中获得）
             * @param {*} approve 是否同意请求	
             * @param {*} remark 添加后的好友备注（仅在同意时有效）
             */
    setFriendAddRequest(flag, approve, remark) {
        this.ws.send(JSON.stringify({
            "action": "set_friend_add_request",
            "params": {
                "flag": flag,
                "approve": approve,
                "remark": remark
            }
        }))
    }
    /**
             * 处理加群请求／邀请
             * @param {*} flag 加群请求的 flag（需从上报的数据中获得）
             * @param {*} sub_type add 或 invite，请求类型（需要和上报消息中的 sub_type 字段相符）
             * @param {*} approve 是否同意请求／邀请
             * @param {*} reason 拒绝理由（仅在拒绝时有效）
             */
    setGroupAddRequest(flag, sub_type, approve, reason) {
        this.ws.send(JSON.stringify({
            "action": "set_group_add_request",
            "params": {
                "flag": flag,
                "sub_type": sub_type,
                "approve": approve,
                "reason": reason
            }
        }))
    }
    /**
 * 获取好友列表
 * @returns 
 */
    getFriendList() {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "get_friend_list"
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data)
            }
        })
    }
    /**
             * 获取群信息
             * @param {*} group_id 群号
             * @param {*} no_cache 是否不使用缓存（使用缓存可能更新不及时，但响应更快）
             * @returns 
             */
    getGroupInfo(group_id, no_cache) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "get_group_info",
                "params": {
                    "group_id": group_id,
                    "no_cache": no_cache
                }
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data)
            }
        })
    }
    /**
             * 获取群列表
             * @returns 
             */
    getGroupList() {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "get_group_list"
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data)
            }
        }
        )
    }
    /**
             * 获取群成员信息
             * @param {*} group_id 	群号
             * @param {*} user_id QQ 号
             * @param {*} no_cache 是否不使用缓存（使用缓存可能更新不及时，但响应更快)
             * @returns 
             */
    getGroupMemberInfo(group_id, user_id, no_cache) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "get_group_member_info",
                "params": {
                    "group_id": group_id,
                    "user_id": user_id,
                    "no_cache": no_cache
                }
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data
                )
            }
        })
    }
}
export const LLOneBotWS = new LLOneBotws()