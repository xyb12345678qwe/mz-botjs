import { getIntentsMask } from './intents'
import { ClientNTQQ } from './api.js'
import { Counter } from '../../core/index.js'
import { config } from './config.js'

export class NTQQ {
  // 标记是否已连接
  #isConnected = false
  // 存储最新的消息序号
  #heartbeat_interval = 30000
  // 鉴权
  #IntervalID = null
  // url
  #gatewayUrl = null
  #counter = new Counter(1) // 计数器初始值为1
  #ws //ws连接
  //设置bot信息
  setBot(opstion) {
    config.set('appID', String(opstion.appID))
    config.set('token', opstion.token)
    config.set('intents', getIntentsMask(config.get('intents')))
    config.set('shard', opstion.shard)
    config.set('secret', opstion.secret)
  }
  /**
* 定时鉴权
* @param cfg
* @returns
*/
  async #setTimeoutBotConfig() {
    const callBack = async () => {
      const appID = config.get('appID')
      const secret = config.get('secret')
      // 发送请求
      // {
      //     access_token: string
      //     expires_in: number
      //     cache: boolean
      // } 

      const data = await ClientNTQQ.getAuthentication(appID, secret).then(
        res => res.data
      )

      config.set('token', data.access_token) //设置token
      logger.info('refresh', data.expires_in, 's')
      setTimeout(callBack, data.expires_in * 1000)
    }
    await callBack()
    return
  }
  /**
 * 鉴权数据
 * @returns
 */
  #aut() {
    const token = config.get('token')
    const intents = config.get('intents')
    const shard = config.get('shard')
    return {
      op: 2, // op = 2
      d: {
        token: `QQBot ${token}`,
        intents: intents,
        shard: shard,
        properties: {
          $os: process.platform,
          $browser: 'alemonjs',
          $device: 'alemonjs'
        }
      }
    }
  }
  /**
*
* @param cfg
* @param conversation
*/
  async connect(conversation) {
    // 定时模式
    await this.#setTimeoutBotConfig()
    // 请求url
    if (!this.#gatewayUrl) {
      this.#gatewayUrl = await ClientNTQQ.gateway().then(res => res?.url)
      logger.info(this.#gatewayUrl)
    }
    if (!this.#gatewayUrl) return
    // 重新连接的逻辑
    const reconnect = async () => {
      if (this.#counter.get() >= 5) {
        logger.info(
          'The maximum number of reconnections has been reached, cancel reconnection'
        )
        return
      }
      setTimeout(() => {
        logger.info('[ws] reconnecting...')
        // 重新starrt
        start()
        // 记录
        this.#counter.getNextID()
      }, 5000)
    }

    const start = () => {
      if (this.#gatewayUrl) {
        const map = {
          0: async ({ t, d }) => {
            // 存在,则执行t对应的函数
            await conversation(t, d)
            // Ready Event，鉴权成功
            if (t === 'READY') {
              this.#IntervalID = setInterval(() => {
                if (this.#isConnected) {
                  this.#ws.send(
                    JSON.stringify({
                      op: 1, //  op = 1
                      d: null // 如果是第一次连接，传null
                    })
                  )
                }
              }, this.#heartbeat_interval)
            }
            // Resumed Event，恢复连接成功
            if (t === 'RESUMED') {
              logger.info('[ws] restore connection')
              // 重制次数
              this.#counter.reStart()
            }
            return
          },
          6: ({ d }) => {
            logger.info('[ws] connection attempt', d)
            return
          },
          7: async ({ d }) => {
            // 执行重新连接
            logger.info('[ws] reconnect', d)
            // 取消鉴权发送
            if (this.#IntervalID) clearInterval(this.#IntervalID)
            return
          },
          9: ({ d, t }) => {
            logger.info('[ws] parameter error', d)
            return
          },
          10: ({ d }) => {
            // 重制次数
            this.#isConnected = true
            // 记录新循环
            this.#heartbeat_interval = d.heartbeat_interval
            // 发送鉴权
            this.#ws.send(JSON.stringify(this.#aut()))
            return
          },
          11: () => {
            // OpCode 11 Heartbeat ACK 消息，心跳发送成功
            logger.info('[ws] heartbeat transmission')
            // 重制次数
            this.#counter.reStart()
            return
          },
          12: ({ d }) => {
            logger.info('[ws] platform data', d)
            return
          }
        }
        // 连接
        this.#ws = new WebSocket(this.#gatewayUrl)
        // WebSocket连接打开事件
        this.#ws.onopen = () => {
          logger.info('[ws] open');
        };
        // WebSocket消息接收事件
        this.#ws.onmessage = async msg => {
          try {
            const message = JSON.parse(msg.data.toString('utf8'))
            logger.info('[ws] message', message);
            // 根据opcode处理消息
            if (map[message.op]) {
              await map[message.op](message);
            }
          } catch (error) {
            logger.error('Error parsing message:', error);
          }
        };
        // WebSocket连接关闭事件
        this.#ws.onclose = async (event) => {
          logger.info('[ws] close', event.reason);

          // 尝试重新连接
          await reconnect();
        };
      }
    }
    start()
  }
}
export * from './conversion.js'