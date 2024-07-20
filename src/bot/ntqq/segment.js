import { MBuffer } from '../../core/index.js'
export const segmentNTQQ = {
  at: (uid) => {
    return `<@${uid}>`
  },
  atAll: () => {
    return '@everyone'
  },
  img:MBuffer.getPath,
  qrcode: MBuffer.qrcode,
  http: (url) => {
    return `<http>${url}</http>`
  },
  link: (title, centent) => {
    return `[🔗${title}](${centent})`
  },
  atChannel: (channel_id) => '',
  role: (role_id) => '',
  spoiler: (content) => content,
  expression: (name, id) => '',
  Bold: (txt) => txt,
  italic: (txt) => txt,
  boldItalic: (txt) => txt,
  strikethrough: (txt) => txt,
  block: (txt) => txt
}
