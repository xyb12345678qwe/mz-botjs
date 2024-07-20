import { logger } from "../../core";

export class GSUIDCore {
    #wsUrl = `ws://127.0.0.1:8765/ws/Mz-bot`
    ws = null

    run() {
        // ws连接
        this.ws = new WebSocket(this.#wsUrl);
        // 当WebSocket连接打开时的事件处理函数
        this.ws.onopen = () => {
            logger.info("GSUIDCore[ws]连接成功");
        };
        // 当WebSocket连接发生错误时的事件处理函数
        this.ws.onerror = (error) => {
            logger.error(`GSUIDCore[ws]连接发生错误: ${error.message}`);
        };
        // 当WebSocket连接关闭时的事件处理函数
        this.ws.onclose = () => {
            logger.info("GSUIDCore[ws]连接已关闭");
        };
        // 设置WebSocket接收到消息时的事件处理函数
        this.ws.onmessage = (event) => this.handleMessage(event);

    }
    handleMessage(event) {
        const message = JSON.parse(event.data.toString('utf-8'));
        logger.info(`[GSUIDCore]${logger.info(message)}`);
    }
    pushMessage(data) {
        const { bot_id, bot_self_id, msg_id, user_type, group_id, user_id, user_pm, nickname, avatar,content } = data
        return new Promise((resolve, reject) => {
             const message = {
                bot_id: String(bot_id) || 'qq',
                bot_self_id: String(bot_self_id),
                 msg_id: String(msg_id),
                 target_type: user_type || 'group',
                 target_id: String(group_id) || '0',
                user_type: user_type || 'group',
                group_id: String(group_id) || '0',
                user_id: String(user_id),
                user_pm: user_pm || 6,
                content,
                sender: {
                    nickname,
                    avatar
                 }
                 
            };

            this.ws.send(JSON.stringify(message));

            // 监听返回的信息
            const handleResponse = (e) => {
                try {
                    const response = JSON.parse(e.data);
                    resolve(response.data);
                } catch (error) {
                    reject(`解析响应时发生错误: ${error.message}`);
                }
            };

            this.ws.onmessage = handleResponse;
        })
    }
}