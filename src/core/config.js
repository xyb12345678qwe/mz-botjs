/**
 * 基础配置结构
 */
export class BaseConfig{
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
    this.#data[key] = val
    return this
  }
  /**
   *
   * @param key
   * @returns
   */
  has(key) {
    if (Object.prototype.hasOwnProperty.call(this.#data, key)) {
      true
    }
    return false
  }
  /**
   * 读取配置
   * @param key
   * @returns
   */
  all() {
    return this.#data
  }
  /**
   * 读取配置
   * @param key
   * @returns
   */
  get(key){
    return this.#data[key]
  }
}
