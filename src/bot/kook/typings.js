/**
 * api枚举
 */
export const ApiEnum = {
  /**
   * ********
   * 频道相关
   * ********
   */
  GuildList: '/api/v3/guild/list',
  GuildView: '/api/v3/guild/view',
  GuildUserList: '/api/v3/guild/user-list',
  GuildNickname: '/api/v3/guild/nickname',
  GuildLeave: '/api/v3/guild/leave',
  GuildKickout: '/api/v3/guild/kickout',
  GuildMuteList: '/api/v3/guild-mute/list',
  GuildMuteCreate: '/api/v3/guild-mute/create',
  GuildMuteDelete: '/api/v3/guild-mute/delete',
  GuildBoostHistory: '/api/v3/guild-boost/history',

  /**
   * *******
   * 子频道接口
   * ******
   */
  /**
   * *******
   * 子频道接口
   * ******
   */
  ChannelMessage: '/api/v3/channel/message',
  ChannelList: '/api/v3/channel/list',
  ChannelView: '/api/v3/channel/view',
  ChannelCreate: '/api/v3/channel/create',
  ChannelUpdate: '/api/v3/channel/update',
  ChannelDelete: '/api/v3/channel/delete',
  ChannelUserList: '/api/v3/channel/user-list',
  ChannelMoveUser: '/api/v3/channel/move-user',
  ChannelRoleIndex: '/api/v3/channel-role/index',
  ChannelRoleCreate: '/api/v3/channel-role/create',
  ChannelRoleUpdate: '/api/v3/channel-role/update',
  ChannelRoleSync: '/api/v3/channel-role/sync',
  ChannelRoleDelete: '/api/v3/channel-role/delete',

  /**
   * ******
   * 消息接口
   * ****
   */
  /**
   * ******
   * 消息接口
   * ****
   */
  MessageList: '/api/v3/message/list',
  MessageView: '/api/v3/message/view',
  MessageCreate: '/api/v3/message/create',
  MessageUpdate: '/api/v3/message/update',
  MessageDelete: '/api/v3/message/delete',
  MessageReactionList: '/api/v3/message/reaction-list',
  MessageAddReaction: '/api/v3/message/add-reaction',
  MessageDeleteReaction: '/api/v3/message/delete-reaction',

  /**
   * *******
   * 频道用户
   * *******
   */
  /**
   * *******
   * 频道用户
   * *******
   */
  GetJoinedChannel: '/api/v3/channel-user/get-joined-channel',

  /**
   * *******
   * 私聊会话
   * *******
   */

  /**
   * *******
   * 私聊会话
   * *******
   */
  UserChatList: '/api/v3/user-chat/list',
  UserChatView: '/api/v3/user-chat/view',
  UserChatCreate: '/api/v3/user-chat/create',
  UserChatDelete: '/api/v3/user-chat/delete',

  /**
   * *******
   * 用户私聊
   * *******
   */
  /**
   * *******
   * 用户私聊
   * *******
   */
  DirectMessageList: '/api/v3/direct-message/list',
  DirectMessageView: '/api/v3/direct-message/view',
  DirectMessageCreate: '/api/v3/direct-message/create',
  DirectMessageUpdate: '/api/v3/direct-message/update',
  DirectMessageDelete: '/api/v3/direct-message/delete',
  DirectMessageReactionList: '/api/v3/direct-message/reaction-list',
  DirectMessageAddReaction: '/api/v3/direct-message/add-reaction',
  DirectMessageDeleteReaction: '/api/v3/direct-message/delete-reaction',

  /**
   * ******
   * 用户接口
   * ******
   */
  /**
   * ******
   * 用户接口
   * ******
   */
  UserMe: '/api/v3/user/me',
  UserView: '/api/v3/user/view',
  UserOffline: '/api/v3/user/offline',

  /**
   * *******
   * 媒体接口
   * *******
   */
  /**
   * *******
   * 媒体接口
   * *******
   */
  AssetCreate: '/api/v3/asset/create',

  /**
   * *******
   * 服务器角色权限相关接口列表
   * *******
   */
  /**
   * *******
   * 服务器角色权限相关接口列表
   * *******
   */
  GuildRoleList: '/api/v3/guild-role/list',
  GuildRoleCreate: '/api/v3/guild-role/create',
  GuildRoleUpdate: '/api/v3/guild-role/update',
  GuildRoleDelete: '/api/v3/guild-role/delete',
  GuildRoleGrant: '/api/v3/guild-role/grant',
  GuildRoleRevoke: '/api/v3/guild-role/revoke',

  /**
   * *******
   * 亲密度相关接口列表
   * *******
   */
  /**
   * *******
   * 亲密度相关接口列表
   * *******
   */
  IntimacyIndex: '/api/v3/intimacy/index',
  IntimacyUpdate: '/api/v3/intimacy/update',

  /**
   * *******
   * 服务器表情相关接口
   * *******
   */
  /**
   * *******
   * 服务器表情相关接口
   * *******
   */
  GuildEmojiList: '/api/v3/guild-emoji/list',
  GuildEmojiCreate: '/api/v3/guild-emoji/create',
  GuildEmojiUpdate: '/api/v3/guild-emoji/update',
  GuildEmojiDelete: '/api/v3/guild-emoji/delete',

  /**
   * *******
   * 邀请相关接口
   * *******
   */
  /**
   * *******
   * 邀请相关接口
   * *******
   */
  InviteList: '/api/v3/invite/list',
  InviteCreate: '/api/v3/invite/create',
  InviteDelete: '/api/v3/invite/delete',

  /**
   * *******
   * 黑名单相关接口
   * *******
   */
  /**
   * *******
   * 黑名单相关接口
   * *******
   */
  BlacklistList: '/api/v3/blacklist/list',
  BlacklistCreate: '/api/v3/blacklist/create',
  BlacklistDelete: '/api/v3/blacklist/delete',

  /**
   * *******
   * Badge 相关文档
   * *******
   */
  /**
   * *******
   * Badge 相关文档
   * *******
   */
  BadgeGuild: '/api/v3/badge/guild',

  /**
   * *******
   * 用户动态相关接口-游戏/进程/音乐
   * *******
   */
  /**
   * *******
   * 用户动态相关接口-游戏/进程/音乐
   * *******
   */
  GameList: '/api/v3/game',
  GameCreate: '/api/v3/game/create',
  GameUpdate: '/api/v3/game/update',
  GameDelete: '/api/v3/game/delete',
  GameActivity: '/api/v3/game/activity',
  GameDeleteActivity: '/api/v3/game/delete-activity',

  /**
   * *******
   * Gateway
   * *******
   */
  /**
   * *******
   * Gateway
   * *******
   */
  OAuth2Token: '/api/oauth2/token',

  /**
   * *******
   * OAuth2.0相关接口
   * *******
   */
  /**
   * *******
   * OAuth2.0相关接口
   * *******
   */
  GatewayIndex: '/api/v3/gateway/index'
}



/**
 * 系统数据可枚举
 */
export const SystemDataEnum = [
  /**
   * 频道进出事件
   */

  // 进入频道
  'exited_guild',
  // 退出
  'joined_guild',

  /**
   * 成员上麦事件
   */

  //进入子频道
  'joined_channel',
  // 退出子频道 --- 多半是音频频道
  'exited_channel',

  /**
   * 成员信息变更事件
   * 身份组信息变更
   */

  // 更新频道信息
  'updated_channel',

  /**
   *
   */

  // 顶置消息
  'pinned_message',

  /**
   *
   */

  // 成员上线
  'guild_member_online',

  /**
   * 频道表态事件
   */

  // 添加表态
  'added_reaction',
  // 移除表态
  'deleted_reaction',

  /**
   * 消息更新
   */
  'updated_message',
  /**
   * 按钮点击事件
   */
  'message_btn_click'
] 
