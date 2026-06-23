const env = process.env || {};

export default {
  /** Dify API エンドポイント（デフォルト: https://api.dify.ai/v1） */
  DIFY_BASE_URL: env.DIFY_BASE_URL || 'https://api.dify.ai/v1',

  /**
   * Dify Token
   * 複数のワークフロートークンを設定可能
   * トークンとトークンの間は「;」で区切ってください
   */
  DIFY_TOKENS: env.DIFY_TOKENS,

  /**
   * Dify Inputs
   * キーと値のペア（Key/Value pairs）を複数含むパラメーター
   * 必ずJSON形式で指定してください
   * 例: { "name": "", "topic": "" }
   */
  DIFY_INPUTS: env.DIFY_INPUTS,

  /**
   * メール設定
   * EMAIL_USER: 送信者のメールアドレス
   * EMAIL_PASS: 送信者のパスワード
   * EMAIL_TO:   受信者のメールアドレス
   */
  EMAIL_USER: env.EMAIL_USER,
  EMAIL_PASS: env.EMAIL_PASS,
  EMAIL_TO: env.EMAIL_TO,

  /**
   * DingTalk 設定
   * https://open.dingtalk.com/document/robots/custom-robot-access
   */
  DINGDING_WEBHOOK: env.DINGDING_WEBHOOK,

  /**
   * PushPlus 設定
   * http://www.pushplus.plus/doc/guide/openApi.html
   */
  PUSHPLUS_TOKEN: env.PUSHPLUS_TOKEN,

  /**
   * WeCom（企業WeChat）ボット設定
   * https://developer.work.weixin.qq.com/document/path/91770
   */
  WEIXIN_WEBHOOK: env.WEIXIN_WEBHOOK,

  /**
   * Server酱 通知Key
   * https://sct.ftqq.com/sendkey
   */
  SERVERPUSHKEY: env.SERVERPUSHKEY,

  /**
   * Feishu（飛書）設定
   */
  FEISHU_WEBHOOK: env.FEISHU_WEBHOOK,

  /**
   * 微秘書 設定
   * https://wechat.aibotk.com
   * APIキーはマイページから取得してください
   */
  AIBOTK_HOOK: env.AIBOTK_HOOK || 'https://api-bot.aibotk.com',
  AIBOTK_KEY: env.AIBOTK_KEY,

  // 通知先グループ名
  AIBOTK_ROOM_RECIVER: env.AIBOTK_ROOM_RECIVER,

  // 通知先の友だちニックネーム
  AIBOTK_CONTACT_RECIVER: env.AIBOTK_CONTACT_RECIVER,
};
