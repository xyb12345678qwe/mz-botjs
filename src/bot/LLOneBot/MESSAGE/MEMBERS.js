import { APPEvent } from "../../../plugins/index.js";
import { LLOneBotWS } from '../ws.js'
import { segmentLLOneBot } from "../segment.js";
export const SUB_TYPE = ['leave', 'kick', 'kick_me', 'approve', 'invite']
//成员处理
class members {
    /**
     * 响应
     */
    response(event) {
        const message = JSON.parse(event.data);
        APPEvent.MEMBERS(this.configuratione(message))
    }
    /**
     * 构造e
     * @param {*} message 
     */
    configuratione(message) {
        let e = {
            event: "MEMBERS",
            typing: 'CREATE' ,
            bot: {
                qq: message.self_id,
            },
            post_type: message.post_type, //上报类型
            notice_type: message.notice_type,//通知类型
            sub_type: message.sub_type,//事件子类型
            //leavel 主动退群
            //kick 成员被踢
            //kick_me 登录号被踢
            // approve 加群申请
            //invite 邀请入群
            group_id: message.group_id,
            operator_id: message.operator_id,//操作者 QQ 号（如果是主动退群，则和 user_id 相同）
            user_id: message.user_id, //离开者 QQ 号
            leavel: null,
            kick: null,
            kick_me: null,
            type: null,
            isadd: false,
            approve: null,
            invite: null,
            reply(msg) {
                LLOneBotWS.sendMsg({
                    "message_type": "group",
                    group_id: message.group_id,
                    message: msg
                })
            },
            segment:segmentLLOneBot         
        }
        if (e.sub_type == "leave") {
            e.leavel = true;
            e.type = "主动退群";
            e.typing = 'DELETE'
        } else if (e.sub_type == "kick") {
            e.kick = true;
            e.type = "成员被踢";
            e.typing = 'DELETE'
        } else if (e.sub_type == "kick_me") {
            e.kick_me = true;
            e.type = "登录号被踢"
            e.typing = 'DELETE'
        } else if (e.sub_type == "approve") {
            e.type = "加群申请"
            e.approve = true
            e.isadd = true
            e.typing = 'CREATE'
        } else if (e.sub_type == "invite") {
            e.type = "邀请入群"
            e.invite = true
            e.isadd = true
            e.typing = 'CREATE'
        }
        return e
    }

}
export const MEMBERS = new members();