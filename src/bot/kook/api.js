import axios  from 'axios'
import FormData from 'form-data'
import { config } from './config.js'
import { createPicFrom } from '../../core/index.js'
import { ApiEnum } from './typings.js'
/**
 * api接口
 */
class ClientKook {
  API_URL = 'https://www.kookapp.cn'

  /**
   * KOOK服务
   * @param config
   * @returns
   */
  kookService(opstoin) {
    const token = config.get('token')
    const service = axios.create({
      baseURL: this.API_URL,
      timeout: 30000,
      headers: {
        Authorization: `Bot ${token}`
      }
    })
    return service(opstoin)
  }

  /**
   * ************
   * 资源床单
   * ***********
   */

  /**
   * 发送buffer资源
   * @param id 私信传频道id,公信传子频道id
   * @param message {消息编号,图片,内容}
   * @returns
   */
  async postImage(file, Name = 'image.jpg') {
    const from = await createPicFrom(file, Name)
    if (!from) return false
    const { picData, name } = from
    const formdata = new FormData()
    formdata.append('file', picData, name)
    const url = await this.createUrl(formdata)
    if (url) return url
    return false
  }

  /**
   * 发送buffer资源
   * @param id 私信传频道id,公信传子频道id
   * @param message {消息编号,图片,内容}
   * @returns
   */
  async postFile(file, Name = 'image.jpg') {
    const formdata = new FormData()
    formdata.append('file', [file], Name)
    const url = await this.createUrl(formdata)
    if (url) return url
    return false
  }

  /**
   * 转存
   * @param formdata
   * @returns
   */
  async createUrl(formdata){
    return await this.kookService({
      method: 'post',
      url: ApiEnum.AssetCreate,
      data: formdata,
      headers: formdata.getHeaders()
    })
      .then(res => res?.data)
      .catch(err => {
        logger.error(err)
      })
  }

  /**
   * *********
   * 消息api
   * *********
   */

  /**
   * 创建消息
   * @param data
   * @returns
   */
  async createMessage(data) {
    return await this.kookService({
      method: 'post',
      url: ApiEnum.MessageCreate,
      data
    })
      .then(res => res?.data)
      .catch(err => {
        logger.error(err)
      })
  }

  /**
   * 创建私聊消息
   */

  /**
   * 创建消息
   * @param target_id
   * @returns
   */
  async userChatCreate(target_id){
    return this.kookService({
      method: 'post',
      url: ApiEnum.UserChatCreate,
      data: {
        target_id
      }
    })
      .then(res => res?.data)
      .catch(err => {
        logger.error(err)
      })
  }

  /**
   * 创建消息
   * @param data
   * @returns
   */
  async createDirectMessage(data){
    return this.kookService({
      method: 'post',
      url: ApiEnum.DirectMessageCreate,
      data
    })
      .then(res => res?.data)
      .catch(err => {
        logger.error(err)
      })
  }

  /**
   * 删除指定消息
   * @param msg_id
   * @returns
   */
  async messageDelete(msg_id){
    return this.kookService({
      method: 'post',
      url: ApiEnum.MessageDelete,
      data: {
        msg_id
      }
    })
      .then(res => res?.data)
      .catch(err => {
        logger.error(err)
      })
  }

  /**
   * 重编辑指定消息
   * @param data
   * @returns
   */
  async messageUpdate(data){
    return this.kookService({
      method: 'post',
      url: ApiEnum.MessageUpdate,
      data
    })
      .then(res => res?.data)
      .catch(err => {
        logger.error(err)
      })
  }

  /**
   * 删回应
   * @param data
   * @returns
   */
  async messageDeleteReaction(data) {
    return this.kookService({
      method: 'post',
      url: ApiEnum.MessageDeleteReaction,
      data
    })
      .then(res => res?.data)
      .catch(err => {
        logger.error(err)
      })
  }

  /**
   * 发回应
   * @param data
   * @returns
   */
  async messageAddReaction(data){
    return this.kookService({
      method: 'post',
      url: ApiEnum.MessageAddReaction,
      data
    })
      .then(res => res?.data)
      .catch(err => {
        logger.error(err)
      })
  }

  /**
   * 某个回应的所有用户
   * @param data
   * @returns
   */
  async messageReactionList(params){
    return this.kookService({
      method: 'get',
      url: ApiEnum.MessageReactionList,
      params
    })
      .then(res => res?.data)
      .catch(err => {
        logger.error(err)
      })
  }

  /**
   * **********
   * user
   * *********
   */

  /**
   * 得到当前信息
   * @param guild_id
   * @param user_id
   * @returns
   */
  async userMe(){
    return this.kookService({
      method: 'get',
      url: ApiEnum.UserMe
    })
      .then(res => res?.data)
      .catch(err => {
        logger.error(err)
      })
  }

  /**
   * 得到用户信息
   * @param guild_id
   * @param user_id
   * @returns
   */
  async userView(
    guild_id,
    user_id
  ){
    return this.kookService({
      method: 'get',
      url: ApiEnum.UserView,
      params: {
        guild_id,
        user_id
      }
    })
      .then(res => res?.data)
      .catch(err => {
        logger.error(err)
      })
  }

  /**
   * 踢出
   * @param guild_id
   * @param user_id
   * @returns
   */
  async guildKickout(
    guild_id,
    user_id
  ){
    return this.kookService({
      method: 'post',
      url: ApiEnum.GuildKickout,
      data: {
        guild_id,
        target_id: user_id
      }
    })
      .then(res => res?.data)
      .catch(err => {
        logger.error(err)
      })
  }

  /**
   * 创建角色
   * @param channel_id
   * @param type
   * @param value
   * @returns
   */
  async channelRoleCreate(
    channel_id,
    type,
    value
  ){
    return this.kookService({
      method: 'post',
      url: ApiEnum.ChannelRoleCreate,
      data: {
        channel_id,
        type,
        value
      }
    })
      .then(res => res?.data)
      .catch(err => {
        logger.error(err)
      })
  }
}

export const ClientKOOK = new ClientKook()
