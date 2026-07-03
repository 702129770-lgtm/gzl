# Canva 优先 PPT 工作流操作台

这是一个面向 PPT 制作流程的可视化操作界面，对应 `PPT_Canva_Workflow_Operation_Doc.md` 中的“资料输入 -> Canva 风格选择 -> 样稿确认 -> PPT/PDF 输出”工作流。它可以让非技术用户按步骤执行流程、记录日志、保存配置，并导出交付报告。

当前版本包含一个前端操作台和一个轻量 Node.js 后端。前端负责流程操作，后端负责安全调用飞书通知接口；它不会自动操作 Canva 或自动生成 PPT。

## 使用方式

如果只做本地流程管理，可以直接用浏览器打开 `index.html`。

如果要使用飞书 Webhook 通知，请通过后端启动：

```bash
cp .env.example .env
npm start
```

然后打开：

```text
http://localhost:3000
```

基本流程：

1. 填写项目名称、操作者和输入来源。
2. 在“输入来源”中记录资料位置、用途、目标观众、页数、输出格式和素材使用限制。
3. 点击“开始运行”，按默认的 Canva/PPT 制作步骤推进。
4. 每完成一步，点击对应卡片里的“完成”。
5. 结束后点击“导出报告”，生成 Markdown 交付记录。

默认步骤已经按照长文档整理为：

1. 上传资料
2. 资料读取与分类
3. 确认需求范围
4. Canva 风格搜索
5. 确认风格选项
6. 生成大纲与版式
7. 制作 1 页样稿
8. 样稿确认
9. 制作完整 PPT
10. 质量检查
11. 导出交付

## 给别人使用

可以。当前项目已经可以整理成一个别人直接打开使用的网页版本：

- **纯前端公开版**：发布 `index.html`、`styles.css`、`app.js` 和操作文档即可，适合直接分享链接给别人使用。
- **后端完整功能版**：部署 `server.js` 和 `package.json`，并在服务器环境变量里配置飞书应用密钥，适合团队共享和飞书通知。

具体发布步骤见 `DEPLOY.md`。

如果选择 GitHub Pages，本项目已经内置 `.github/workflows/pages.yml`，推送到 GitHub 后在仓库 `Settings -> Pages` 里选择 `GitHub Actions` 即可自动发布。

只做纯前端流程管理时，把下面文件放在同一个文件夹里发给对方即可：

- `index.html`
- `styles.css`
- `app.js`
- `PPT_Canva_Workflow_Operation_Doc.md`

对方打开 `index.html` 后，可以填写任务信息、运行步骤、导出 Markdown 报告，或下载 JSON 配置供下次导入。`PPT_Canva_Workflow_Operation_Doc.md` 是完整操作规范，适合执行者在遇到确认、素材限制、Canva 权限和质量检查问题时查阅。

如果需要飞书通知，还要一起提供：

- `server.js`
- `package.json`
- `.env.example`
- `README.md`

对方需要把 `.env.example` 复制为 `.env`，填入自己的飞书 Webhook 后，用 `npm start` 启动。

## 功能说明

- “保存配置”：保存到当前浏览器，下次用同一台电脑和同一浏览器打开时会自动恢复。
- “下载配置”：导出 JSON 文件，适合发给别人或备份。
- “导入配置”：读取之前下载的 JSON 文件，恢复项目、步骤和日志。
- “导出报告”：导出 Markdown 文件，适合归档或发给协作者。
- “复制摘要”：复制项目名称、完成进度和输入来源，适合快速发消息同步状态。
- “发送当前进度”：通过后端调用飞书 Webhook 或应用机器人，把当前项目状态发送到飞书。
- “完成步骤时自动通知飞书”：每次点击步骤“完成”时自动发送进度通知。
- “检测飞书配置”：检查后端 Webhook 是否已配置，或应用机器人是否能成功获取飞书 `tenant_access_token`。

## 文件结构

- `index.html`：页面结构。
- `styles.css`：界面样式和响应式布局。
- `app.js`：流程状态、日志、导入导出和浏览器本地保存逻辑。
- `server.js`：本地后端，负责静态页面服务和飞书 Webhook / 应用机器人发送消息。
- `.env.example`：飞书应用配置模板。
- `package.json`：Node.js 启动脚本。
- `PPT_Canva_Workflow_Operation_Doc.md`：Canva 优先 PPT 制作工作流的完整操作规范。
- `README.md`：使用说明。

## 飞书 Webhook 配置

个人使用推荐 Webhook 模式。它不需要创建开放平台应用，只要在飞书群里添加自定义机器人即可。

### 1. 添加自定义机器人

在飞书里创建或打开一个群聊，然后添加“自定义机器人”，复制机器人 Webhook 地址。

飞书官方文档：https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot

### 2. 配置环境变量

复制配置文件：

```bash
cp .env.example .env
```

填写：

```text
FEISHU_NOTIFY_MODE=webhook
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

如果自定义机器人开启了“签名校验”，再填写：

```text
FEISHU_WEBHOOK_SECRET=你的签名密钥
```

如果没有开启签名校验，`FEISHU_WEBHOOK_SECRET` 可以留空。

### 3. 启动

```bash
npm start
```

访问 `http://localhost:3000`。左侧“飞书通知”默认是 Webhook 快速模式；如果 `.env` 已经配置了 `FEISHU_WEBHOOK_URL`，页面里的 Webhook 地址可以留空。

注意：不要把 `.env` 发给不该看到 Webhook 或密钥的人。Webhook 地址本身也要当作敏感信息保管。

### 4. 检测配置

启动后先点击页面左侧“检测飞书配置”。

- 如果提示 Webhook 配置可用，说明后端已经读到 Webhook。
- 如果提示缺少配置，检查 `.env` 是否存在并重启 `npm start`。
- 如果发送失败，检查 Webhook 是否复制完整、机器人是否还在群里、安全设置是否要求签名或关键词。

## 飞书应用机器人配置

团队正式使用时，可以把通知模式改为应用机器人：

```text
FEISHU_NOTIFY_MODE=app
FEISHU_APP_ID=cli_xxxxxxxxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FEISHU_DEFAULT_RECEIVE_ID_TYPE=chat_id
FEISHU_DEFAULT_RECEIVE_ID=oc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

应用机器人需要在飞书开放平台创建企业自建应用、开启机器人能力，并申请发送消息相关权限。

飞书官方接口参考：

- 获取自建应用 `tenant_access_token`：https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal
- 发送消息：https://open.feishu.cn/document/server-docs/im-v1/message/create

`FEISHU_DEFAULT_RECEIVE_ID_TYPE` 可选值通常包括：

- `chat_id`：发送到群聊
- `open_id`：发送到用户
- `user_id`：发送到用户
- `email`：发送到用户邮箱对应用户

## 文档关系

- `README.md` 是快速使用说明，适合第一次打开工具的人。
- `PPT_Canva_Workflow_Operation_Doc.md` 是执行标准，适合负责制作 PPT 的人逐条遵守。
- 界面里的默认步骤来自长文档的工作流总览和质量检查要求。

## 接入真实工作流

当前已经接入了飞书通知后端。Webhook 模式下前端调用的是：

```js
await fetch("/api/feishu/notify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    mode: "webhook",
    webhookUrl: "",
    text: "Canva PPT 工作流通知",
  }),
});
```

如果后续还要接入真实 PPT 自动化，可以继续在 `app.js` 的 `runWorkflow()` 或 `markDone()` 中调用新的后端接口，例如：

```js
await fetch("/api/run-step", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ step, project: buildPayload() }),
});
```

如果工作流本身是 Python、Node.js、Canva 插件或命令行脚本，建议再加一个轻量后端，由界面触发后端执行脚本。

常见接入方式：

- 本地使用：用 Node.js、Python Flask 或 FastAPI 启动一个后端服务，由页面请求后端执行脚本。
- 团队使用：把前端和后端部署到同一台服务器，用户通过浏览器访问。
- 只做流程管理：保持当前纯前端版本，人工按步骤执行 Canva/PPT 制作，界面负责记录和交付。
