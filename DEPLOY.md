# 发布网页版本

这个项目可以发布成两种网页版本：

1. 纯前端公开版：别人打开链接即可使用流程记录、步骤推进、配置导入导出和报告导出；不包含飞书通知。
2. 后端完整功能版：别人打开链接即可使用，并且支持飞书 Webhook 或应用机器人通知；需要在部署平台配置飞书环境变量。

## 方案 A：纯前端公开版

适合只需要把工作流操作台发给别人使用的场景。

发布文件：

- `index.html`
- `styles.css`
- `app.js`
- `PPT_Canva_Workflow_Operation_Doc.md`

可部署到任意静态网站平台，例如 GitHub Pages、Netlify、Vercel 静态站点或公司内部对象存储。

### GitHub Pages 发布

本项目已经包含 GitHub Pages 自动发布工作流：

```text
.github/workflows/pages.yml
```

发布步骤：

1. 把项目推送到 GitHub 仓库的 `main` 分支。
2. 打开仓库的 `Settings` -> `Pages`。
3. 在 `Build and deployment` 里把 `Source` 选择为 `GitHub Actions`。
4. 回到 `Actions` 页面，等待 `Deploy GitHub Pages` 工作流完成。
5. 打开 Pages 给出的访问地址，例如：

```text
https://你的用户名.github.io/仓库名/
```

后续每次推送到 `main` 分支，GitHub Pages 会自动重新发布。

注意事项：

- 飞书通知按钮会因为没有后端而不可用。
- 配置保存在用户自己的浏览器 `localStorage` 中，不会自动同步到服务器。
- 下载配置和导出报告功能可以正常使用。

## 方案 B：后端完整功能版

适合需要飞书通知的团队使用。个人或小团队优先用 Webhook 快速模式；正式企业应用可切换为应用机器人模式。

部署要求：

- Node.js 18 或更高版本
- 支持 `npm start` 的服务平台
- 可以配置环境变量

启动命令：

```bash
npm start
```

健康检查地址：

```text
/api/health
```

Webhook 快速模式环境变量：

```text
FEISHU_NOTIFY_MODE=webhook
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
FEISHU_WEBHOOK_SECRET=
FEISHU_API_BASE=https://open.feishu.cn
PORT=3000
```

如果飞书自定义机器人没有开启签名校验，`FEISHU_WEBHOOK_SECRET` 可以留空。

应用机器人模式环境变量：

```text
FEISHU_NOTIFY_MODE=app
FEISHU_APP_ID=cli_xxxxxxxxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FEISHU_DEFAULT_RECEIVE_ID_TYPE=chat_id
FEISHU_DEFAULT_RECEIVE_ID=oc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FEISHU_API_BASE=https://open.feishu.cn
PORT=3000
```

多数云平台会自动注入 `PORT`，这种情况下不用手动设置 `PORT`。

## 推荐发布路径

如果只是给外部同事或客户使用，优先发布纯前端公开版，最快也最少权限风险。

如果要把“完成步骤自动通知飞书”也给别人使用，发布后端完整功能版，并把飞书 Webhook、签名密钥或应用密钥只放在部署平台的环境变量里，不要写进前端文件或公开仓库。

## 发布前检查

```bash
npm run check
```

本地完整功能预览：

```bash
cp .env.example .env
npm start
```

打开：

```text
http://localhost:3000
```
