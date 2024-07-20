
/**
 * 机器人信息缓存
 */
export class BaseBotMessage{
  #data = null
  constructor(val) {
    this.#data = val
  }
  /**
   * 设置配置
   * @param key
   * @param val
   */
  set(key, val) {
    if (Object.prototype.hasOwnProperty.call(this.#data, key)) {
      this.#data[key] = val
    }
    return this
  }
  /**
   * 读取配置
   * @param key
   * @returns
   */
  get() {
    return this.#data
  }
}