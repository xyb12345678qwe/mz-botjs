import { ClientNTQQ } from './api.js'
import { ClientFile, DrawingBed } from '../../file/index.js'
import { getKeyboardData } from './utils.js'

/**
 * 回复控制器
 * @param msg
 * @param guild_id
 * @param msg_id
 * @returns
 */
export async function replyController(
  msg,
  guild_id,
  msg_id,
  buttons
){
  // is buffer
  if (Buffer.isBuffer(msg)) {
    let url = null
    if (DrawingBed.get('state')) {
      url = await DrawingBed.get('func')(msg)
    } else {
      url = await ClientFile.getFileUrl(msg)
    }
    if (!url) {
      return {
        middle: [],
        backhaul: false
      }
    }
    const file_info = await ClientNTQQ.postRichMediaByGroup(guild_id, {
      srv_send_msg: false,
      file_type: 1,
      url
    }).then(res => res?.file_info)
    if (!file_info) {
      return {
        middle: [],
        backhaul: false
      }
    }
    return {
      middle: [
        {
          url: file_info
        }
      ],
      backhaul: await ClientNTQQ.groupOpenMessages(guild_id, {
        content: '',
        media: {
          file_info
        },
        keyboard: buttons ? getKeyboardData(buttons) : undefined,
        msg_id,
        msg_type: buttons ? 2 : 7,
        msg_seq: ClientNTQQ.getMsgSeq(msg_id)
      })
    }
  }

  if (Array.isArray(msg) && msg.find(item => Buffer.isBuffer(item))) {
    const isBuffer = msg.findIndex(item => Buffer.isBuffer(item))
    const cont = msg
      .map(item => {
        if (typeof item === 'number') return String(item)
        return item
      })
      .filter(element => typeof element === 'string')
      .join('')

    let url = null
    if (DrawingBed.get('state')) {
      url = await DrawingBed.get('func')(msg[isBuffer])
    } else {
      url = await ClientFile.getFileUrl(msg[isBuffer])
    }

    if (!url) {
      return {
        middle: [],
        backhaul: false
      }
    }
    const file_info = await ClientNTQQ.postRichMediaByGroup(guild_id, {
      srv_send_msg: false,
      file_type: 1,
      url
    }).then(res => res?.file_info)
    if (!file_info) {
      return {
        middle: [],
        backhaul: false
      }
    }
    return {
      middle: [
        {
          url: file_info
        }
      ],
      backhaul: await ClientNTQQ.groupOpenMessages(guild_id, {
        content: cont,
        media: {
          file_info
        },
        keyboard: buttons ? getKeyboardData(buttons) : undefined,
        msg_id,
        msg_type: buttons ? 2 : 7,
        msg_seq: ClientNTQQ.getMsgSeq(msg_id)
      })
    }
  }

  const content = Array.isArray(msg)
    ? msg.join('')
    : typeof msg === 'string'
    ? msg
    : typeof msg === 'number'
    ? `${msg}`
    : ''

  if (content == '') {
    if (!buttons) {
      return {
        middle: [],
        backhaul: false
      }
    } else {
      return {
        middle: [],
        backhaul: await ClientNTQQ.groupOpenMessages(guild_id, {
          content,
          keyboard: getKeyboardData(buttons),
          msg_id,
          msg_type: 2,
          msg_seq: ClientNTQQ.getMsgSeq(msg_id)
        })
      }
    }
  }

  const match = content.match(/<http>(.*?)<\/http>/)
  if (match) {
    const getUrl = match[1]
    const file_info = await ClientNTQQ.postRichMediaByGroup(guild_id, {
      srv_send_msg: false,
      file_type: 1,
      url: getUrl
    }).then(res => res?.file_info)
    if (!file_info) {
      return {
        middle: [],
        backhaul: false
      }
    }
    return {
      middle: [
        {
          url: file_info
        }
      ],
      backhaul: await ClientNTQQ.groupOpenMessages(guild_id, {
        content: '',
        media: {
          file_info
        },
        keyboard: buttons ? getKeyboardData(buttons) : undefined,
        msg_id,
        msg_type: buttons ? 2 : 7,
        msg_seq: ClientNTQQ.getMsgSeq(msg_id)
      })
    }
  }

  return {
    middle: [],
    backhaul: await ClientNTQQ.groupOpenMessages(guild_id, {
      content,
      keyboard: buttons ? getKeyboardData(buttons) : undefined,
      msg_id,
      msg_type: buttons ? 2 : 0,
      msg_seq: ClientNTQQ.getMsgSeq(msg_id)
    })
  }
}
