/**
 * Mz-bot plugin
 * 插件标准类
 * @class
 */
export class MzPlugin {
  /**
   * this.e 方法
   */
  e
  /**
   * 应用名
   */
  name = 'Mz-bot'
  /**
   * 层级
   */
  acount = 0
  /**
   * 实例名
   */
  example = 'Plugin'
  /**
   * 事件枚举
   */
  event = 'MESSAGES'
  /**
   * 事件类型
   */
  typing = 'CREATE'

  /**
   * 匹配集
   */
  rule= []

  /**
   * @param event 事件类型       default MESSAGES
   * @param typing 消息类型   default CREATE
   * @param rule.reg 命令正则    RegExp | string
   * @param rule.fnc 命令函数    function
   * @param rule.dsc 指令示范    sdc
   * @param rule.doc 指令文档    doc
   */
  constructor(init) {
    this.event = init?.event ?? 'MESSAGES'
    this.typing = init?.typing ?? 'CREATE'
    this.priority = init?.priority ?? 9000
      this.rule = init?.rule ?? []
      
  }

  /**
   * @param content 内容
   * @returns 是否处理完成
   */
  async reply(
    content,
  ) {
    return this.e.reply(content)
  }


}
