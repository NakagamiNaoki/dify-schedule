import nodemailer from "nodemailer";
import axios from "axios";
import env from "./env.js";
import pkg from "../package.json" with { type: "json" };

export class Notify {
  /**
   * メール送信
   * @param options
   */
  async email(options) {
    const auth = {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    };

    if (!auth.user || !auth.pass || auth.user === "" || auth.pass === "") {
      throw new Error("メールアドレスが設定されていません。");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp." + auth.user.match(/@(.*)/)[1],
      secure: true,
      port: 465,
      auth,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const template = `
<style>
  .dify-header {
    padding: 10px 0;
    border-bottom: 1px solid #f1f1f1;
    text-align: center;
  }
  .dify-header img {
    width: auto;
    height: 40px;
    object-fit: contain;
    vertical-align: middle;
  }
  .dify-update-tip {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    font-size: 12px;
    background: #fff4e5;
    color: #663c00;
    text-decoration: none;
  }
  .dify-main {
    padding: 10px;
  }
  .dify-footer {
    padding: 10px 0;
    border-top: 1px solid #f1f1f1;
    text-align: center;
    font-size: 12px;
    color: #6e6e73;
  }
</style>
<section>
  <header class="dify-header">
    <img src="cid:logo-site.png" width="120" height="24" alt="dify" />
  </header>
  ${
    this.newVersion.has
      ? `<a class="dify-update-tip" href="${this.newVersion.url}" target="_blank"><span>Difyワークフロースケジューラー ${this.newVersion.name} が利用可能です ›</span></a>`
      : ""
  }
  <main class="dify-main">
    ${
      options.msgtype === "html"
        ? options.content
        : `<pre style="margin: 0;">${options.content}</pre>`
    }
  </main>
  <footer class="dify-footer">
    <span>Difyワークフロースケジューラー v${pkg.version}</span> |
    <span>Copyright © ${new Date().getFullYear()} <a href="https://github.com/leochen-g" target="_blank">Leo_chen</a></span>
  </footer>
</section>
`.trim();

    await transporter.sendMail({
      from: `Difyワークフロースケジューラー <${auth.user}>`,
      to: env.EMAIL_TO,
      subject: options.title,
      html: template,
      attachments: [
        {
          filename: "logo.svg",
          path: "https://cloud.dify.ai/logo/logo-site.png",
          cid: "logo-site.png",
        },
      ],
    });
  }

  /**
   * PushPlus通知
   * @param options
   */
  async pushplus(options) {
    const token = env.PUSHPLUS_TOKEN;
    if (!token || token === "") {
      throw new Error("PushPlus Tokenが設定されていません。");
    }

    const config = {
      token,
      title: options.title,
      content: options.content,
      topic: "",
      template: "html",
      channel: "wechat",
      webhook: "",
      callbackUrl: "",
      timestamp: "",
    };

    return axios.post("http://www.pushplus.plus/send", config, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Server酱通知
   * @param options
   */
  async serverPush(options) {
    const token = env.SERVERPUSHKEY;
    if (!token || token === "") {
      throw new Error("Server酱のKeyが設定されていません。");
    }

    const config = {
      title: options.title,
      desp: options.content,
      channel: "9",
    };

    return axios.post(`https://sctapi.ftqq.com/${token}.send`, config, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * DingTalk Webhook通知
   * @param options
   */
  async dingtalkWebhook(options) {
    const url = env.DINGDING_WEBHOOK;
    if (!url || url === "") {
      throw new Error("DingTalk Webhookが設定されていません。");
    }

    return axios.post(url, {
      msgtype: "text",
      text: {
        content: `${options.content}`,
      },
    });
  }

  /**
   * Feishu Webhook通知
   * @param options
   */
  async feishuWebhook(options) {
    const url = env.FEISHU_WEBHOOK;
    if (!url || url === "") {
      throw new Error("Feishu Webhookが設定されていません。");
    }

    return axios.post(url, {
      msg_type: "interactive",
      card: {
        elements: [
          {
            tag: "markdown",
            content: options.content,
            text_align: "left",
          },
        ],
        header: {
          template: "blue",
          title: {
            content: options.title,
            tag: "plain_text",
          },
        },
      },
    });
  }

  /**
   * WeCom（企業WeChat）Webhook通知
   * @param options
   */
  async wecomWebhook(options) {
    const url = env.WEIXIN_WEBHOOK;
    if (!url || url === "") {
      throw new Error("WeCom Webhookが設定されていません。");
    }

    return axios.post(url, {
      msgtype: "text",
      text: {
        content: `${options.content}`,
      },
    });
  }

  async weixinWebhook(options) {
    return this.wecomWebhook(options);
  }

  /**
   * 微秘書 Webhook通知
   * @param options
   */
  async wimishuWebhook(options) {
    const url = env.AIBOTK_HOOK;
    if (!url || url === "") {
      throw new Error("微秘書のHookアドレスが設定されていません。");
    }
    let res = "";
    if (env.AIBOTK_ROOM_RECIVER) {
      console.log(`微秘書 グループへ送信：${env.AIBOTK_CONTACT_RECIVER}`);
      res = await axios.post(url + "/openapi/v1/chat/room", {
        apiKey: env.AIBOTK_KEY,
        roomName: env.AIBOTK_ROOM_RECIVER,
        message: {
          type: 1,
          content: `${options.content}`,
        },
      });
      console.log(`微秘書 グループ送信結果：${res.data}`);
    }
    if (env.AIBOTK_CONTACT_RECIVER) {
      console.log(`微秘書 個人へ送信：${env.AIBOTK_CONTACT_RECIVER}`);
      res = await axios.post(url + "/openapi/v1/chat/contact", {
        apiKey: env.AIBOTK_KEY,
        name: env.AIBOTK_CONTACT_RECIVER,
        message: {
          type: 1,
          content: `${options.content}`,
        },
      });
      console.log(`微秘書 個人送信結果：${res.data}`);
    }
    return res;
  }

  newVersion = {
    has: false,
    name: pkg.version,
    url: pkg.homepage,
  };

  async checkupdate() {
    try {
      const result = await axios.get(pkg.releases_url);
      const data = result.data[0];
      this.newVersion.has = pkg.version < data.tag_name.replace(/^v/, "");
      this.newVersion.name = data.tag_name;
    } catch (e) {}
  }

  async pushMessage(options) {
    const trycatch = async (name, fn) => {
      try {
        await fn(options);
        console.log(`[${name}]: メッセージ送信成功！`);
      } catch (e) {
        console.log(`[${name}]: メッセージ送信失敗！理由: ${e.message}`);
      }
    };

    await this.checkupdate();
    if (this.newVersion.has) {
      console.log(`Difyワークフロースケジューラー ${this.newVersion.name} が利用可能です`);
    }

    await trycatch("メール",     this.email.bind(this));
    await trycatch("DingTalk",  this.dingtalkWebhook.bind(this));
    await trycatch("WeCom",     this.wecomWebhook.bind(this));
    await trycatch("微秘書",    this.wimishuWebhook.bind(this));
    await trycatch("PushPlus",  this.pushplus.bind(this));
    await trycatch("Server酱",  this.serverPush.bind(this));
    await trycatch("Feishu",    this.feishuWebhook.bind(this));
  }
}

export default new Notify();
