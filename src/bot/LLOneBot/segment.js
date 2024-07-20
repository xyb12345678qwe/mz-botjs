import { MBuffer } from '../../core/index.js'
export const segmentLLOneBot = {
  at: (uid) => {
    return `[CQ:at,qq=${uid}]`
  },
  atAll: () => '',
  img: MBuffer.getPath,
  qrcode: MBuffer.qrcode,
  http: (url) => '',
  link: (name, url) => '',
  atChannel: (channel_id) => '',
  /**
   *
   * @param role_id 角色
   */
  role: (role_id) => '',
  /**
   *
   * @param name  服务器表情名
   * @param id   服务器表情id
   */
  expression: (name, id) => txt,
  /**
   * 加粗
   * @param txt
   */
  Bold: (txt) => txt,
  /**
   * 斜体
   * @param txt
   */
  italic: (txt) => txt,
  /**
   * 加粗斜体
   */
  boldItalic: (txt) => txt,
  /**
   * 删除线
   * @param txt
   */
  strikethrough: (txt) => txt,
  /**
   * 代码块
   * @param txt
   */
  block: (txt) =>  txt,
  spoiler: (content) => content
}
