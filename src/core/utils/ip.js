import { publicIp } from 'public-ip'
class Ip {
  #data
  set(val) {
    this.#data = val
  }
  async get(options) {
    if (this.#data) return this.#data
    return await publicIp({
      onlyHttps: true,
      ...options
    }).then(ip => {
      if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) this.#data = ip
      return this.#data ?? false
    })
  }
}
export const IP = new Ip()
