import { BaseConfig } from '../../core/index.js'
export const config = new BaseConfig({
  appID: '', // 应用编号(必填)
  token: '', // 钥匙(必填)
  secret: '',// 密钥(必填)
  shard: [0, 1],
  intents:['INTERACTION_CREATE','GROUP_AT_MESSAGE_CREATE','C2C_MESSAGE_CREATE','FRIEND_ADD','GROUP_ADD_ROBOT']
})
