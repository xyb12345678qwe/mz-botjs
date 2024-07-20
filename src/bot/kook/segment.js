import { MBuffer } from '../../core/index.js'
export const segmentKOOK = {
  at: (uid) => {
    return `(met)${uid}(met)`
  },
  atAll: () => {
    return `(met)all(met)`
  },
  img: MBuffer.getPath,
  qrcode: MBuffer.qrcode,
  http: (url) => {
    return `<http>${url}</http>`
  },
  link: (name, url) => {
    return `[${name}](${url})`
  },
  atChannel: (channel_id) => {
    return `(chn)${channel_id}(chn)`
  },
  /**
   *
   * @param role_id 角色
   */
  role: (role_id) => {
    return `(rol)${role_id}(rol)`
  },
  /**
   *
   * @param name  服务器表情名
   * @param id   服务器表情id
   */
  expression: (name, id) => {
    return `(emj)${name}(emj)[${id}]`
  },
  /**
   * 加粗
   * @param txt
   */
  Bold: (txt) => {
    return `**${txt}**`
  },
  /**
   * 斜体
   * @param txt
   */
  italic: (txt) => {
    return `*${txt}*`
  },
  /**
   * 加粗斜体
   */
  boldItalic: (txt) => {
    return `***${txt}***`
  },
  /**
   * 删除线
   * @param txt
   */
  strikethrough: (txt) => {
    return `~~${txt}~~`
  },
  /**
   * 代码块
   * @param txt
   */
  block: (txt) => {
    return `\`${txt}\``
  },
  spoiler: (content) => content
}
