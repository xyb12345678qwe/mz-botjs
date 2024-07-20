export class Lagrangews {
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
    /**
     * 获取收藏表情
     * @returns 
     */
    fetchCustomFace() {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "fetch_custom_face"
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data
                )
            }
        })
    }
    /**
     * 
     * @param {*} user_id 好友 ID
     * @param {*} message_id 要获取的消息的最后一条的 ID
     * @param {*} count 获取的消息数量
     */
    getFriendMsgHistory(user_id, message_id, count) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "get_friend_msg_history",
                "params": {
                    "user_id": user_id,
                    "message_id": message_id,
                    "count": count
                }
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data
                )
            }
        })
    }
    /**
     * 
     * @param {*} group_id 群组 ID
     * @param {*} message_id 要获取的消息的最后一条的 ID
     * @param {*} count 获取的消息数量
     * @returns 
     */
    getGroupMsgHistory(group_id, message_id, count) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "get_group_msg_history",
                "params": {
                    "group_id": group_id,
                    "message_id": message_id,
                    "count": count
                }
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data
                )
            }
        })
    }
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
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "send_forward_msg",
                "params": {
                    "messages": messages
                }
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data
                )
            }
        })
    }
    /**
     * 发送合并转发 (群聊)
     * @param {*} group_id 
     * @param {*} messages 
     * @returns 
     */
    sendGroupForwardMsg(group_id, messages) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "send_group_forward_msg",
                "params": {
                    "group_id": group_id,
                    "messages": messages
                }
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data
                )
            }
        })
    }
    /**
     * 发送合并转发 (好友)
     * @param {*} user_id 	好友 QQ 号
     * @param {*} messages 
     * @returns 
     */
    sendPrivateForwardMsg(user_id, messages) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "send_private_forward_msg",
                "params": {
                    "user_id": user_id,
                    "messages": messages
                }
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data
                )
            }
        })
    }
    /**
     * 上传群文件
     * @param {*} group_id 群号
     * @param {*} file 本地文件路径
     * @param {*} name 	储存名称
     * @param {*} folder_id 父目录 ID（可选）
     */
    uploadGroupFile(group_id, file, name, folder_id) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "upload_group_file",
                "params": {
                    "group_id": group_id,
                    "file": file,
                    "name": name,
                    "folder_id": folder_id
                }
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data
                )
            }
        })
    }
    /**
     * 获取群根目录文件列表
     * @param {*} group_id 群号
     * @returns 
     */
    getGroupRootFiles(group_id) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "get_group_root_files",
                "params": {
                    "group_id": group_id

                }
            }))
            this.ws.onmessage = function (e) {

                resolve(JSON.parse(e.data).data
                )

            }
        })
    }
    /**
     * 获取群子目录文件列表
     * @param {*} group_id 	群号
     * @param {*} folder_id 文件夹 ID
     * @returns 
     */
    getGroupFilesByFolder(group_id, folder_id) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "get_group_files_by_folder",
                "params": {
                    "group_id": group_id,
                    "folder_id": folder_id
                }
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data
                )
            }
        })
    }
    /**
     * 获取群文件资源链接
     * @param {*} group_id 群号
     * @param {*} file_id 文件 ID
     * @param {*} busid 文件类型
     */
    getGroupFileUrl(group_id, file_id, busid) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "get_group_file_url",
                "params": {
                    "group_id": group_id,
                    "file_id": file_id,
                    "busid": busid
                }
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data
                )
            }
        })
    }
    /**
     * 好友戳一戳
     * @param {*} user_id 对方 QQ 号
     * @returns 
     */
    friendPoke(user_id) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "send_private_poke",
                "params": {
                    "user_id": user_id
                }
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data
                )
            }
        })
    }
    /**
     * 群组戳一戳
     * @param {*} group_id 群号
     * @param {*} user_id 	对方 QQ 号
     * @returns 
     */
    groupPoke(group_id, user_id) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "send_group_poke",
                "params": {
                    "group_id": group_id,
                    "user_id": user_id
                }
            }))
            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data
                )
            }
        })
    }
    /**
     * 设置群组专属头衔
     * @param {*} group_id 群号
     * @param {*} user_id 要设置的 QQ 号
     * @param {*} special_title 	专属头衔, 空字符串表示删除专属头衔
     * @returns 
     */
    setGroupSpecialTitle(group_id, user_id, special_title) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify({
                "action": "set_group_special_title",
                "params": {
                    "group_id": group_id,
                    "user_id": user_id,
                    "special_title": special_title
                }
            }))

            this.ws.onmessage = function (e) {
                resolve(JSON.parse(e.data).data

                )
            }
        }
        )
    }
}

export const LagrangeWS = new Lagrangews()