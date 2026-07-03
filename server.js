const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const rootDir = __dirname;
const port = Number(process.env.PORT || 3000);
const env = loadEnv(path.join(rootDir, ".env"));

const config = {
  appId: process.env.FEISHU_APP_ID || env.FEISHU_APP_ID,
  appSecret: process.env.FEISHU_APP_SECRET || env.FEISHU_APP_SECRET,
  defaultReceiveId: process.env.FEISHU_DEFAULT_RECEIVE_ID || env.FEISHU_DEFAULT_RECEIVE_ID,
  defaultReceiveIdType: process.env.FEISHU_DEFAULT_RECEIVE_ID_TYPE || env.FEISHU_DEFAULT_RECEIVE_ID_TYPE || "chat_id",
  notifyMode: process.env.FEISHU_NOTIFY_MODE || env.FEISHU_NOTIFY_MODE || "webhook",
  webhookUrl: process.env.FEISHU_WEBHOOK_URL || env.FEISHU_WEBHOOK_URL,
  webhookSecret: process.env.FEISHU_WEBHOOK_SECRET || env.FEISHU_WEBHOOK_SECRET,
  apiBase: process.env.FEISHU_API_BASE || env.FEISHU_API_BASE || "https://open.feishu.cn",
};

let tokenCache = {
  token: "",
  expiresAt: 0,
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/api/health") {
      sendJson(res, 200, { ok: true, service: "canva-ppt-workflow-console" });
      return;
    }

    if (req.method === "GET" && req.url === "/api/feishu/status") {
      await handleFeishuStatus(res);
      return;
    }

    if (req.method === "POST" && req.url === "/api/feishu/notify") {
      await handleFeishuNotify(req, res);
      return;
    }

    if (req.method === "GET" || req.method === "HEAD") {
      serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message });
  }
});

server.listen(port, () => {
  console.log(`Canva PPT workflow console: http://localhost:${port}`);
});

async function handleFeishuStatus(res) {
  const webhookConfigured = Boolean(config.webhookUrl);
  const appConfigured = Boolean(config.appId && config.appSecret);
  const status = {
    mode: config.notifyMode,
    configured: config.notifyMode === "webhook" ? webhookConfigured : appConfigured,
    webhookConfigured,
    appConfigured,
    webhookSigned: Boolean(config.webhookSecret),
    hasDefaultReceiver: Boolean(config.defaultReceiveId),
    defaultReceiveIdType: config.defaultReceiveIdType,
    apiBase: config.apiBase,
    tokenReady: false,
  };

  if (config.notifyMode === "webhook") {
    sendJson(res, 200, {
      status,
      ok: status.configured,
      error: status.configured ? undefined : "缺少 FEISHU_WEBHOOK_URL。",
    });
    return;
  }

  if (!status.configured) {
    sendJson(res, 200, {
      ok: false,
      status,
      error: "缺少 FEISHU_APP_ID 或 FEISHU_APP_SECRET。",
    });
    return;
  }

  try {
    await getTenantAccessToken();
    status.tokenReady = true;
    sendJson(res, 200, { ok: true, status });
  } catch (error) {
    sendJson(res, 200, {
      ok: false,
      status,
      error: error.message,
    });
  }
}

async function handleFeishuNotify(req, res) {
  const body = await readJson(req);
  const mode = body.mode || config.notifyMode;
  if (mode === "webhook") {
    await sendWebhookMessage(body, res);
    return;
  }

  await sendAppMessage(body, res);
}

async function sendWebhookMessage(body, res) {
  const webhookUrl = body.webhookUrl || config.webhookUrl;
  const webhookSecret = body.webhookSecret || config.webhookSecret;
  const text = String(body.text || "").trim();

  if (!webhookUrl) {
    sendJson(res, 400, { ok: false, error: "缺少 FEISHU_WEBHOOK_URL 或页面中的 Webhook 地址。" });
    return;
  }

  if (!/^https:\/\/(open\.feishu\.cn|open\.larksuite\.com)\/open-apis\/bot\/v2\/hook\//.test(webhookUrl)) {
    sendJson(res, 400, { ok: false, error: "Webhook 地址格式不正确。" });
    return;
  }

  if (!text) {
    sendJson(res, 400, { ok: false, error: "缺少要发送的消息内容。" });
    return;
  }

  const payload = {
    msg_type: "text",
    content: { text },
  };

  if (webhookSecret) {
    const timestamp = Math.floor(Date.now() / 1000);
    payload.timestamp = String(timestamp);
    payload.sign = createWebhookSign(timestamp, webhookSecret);
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok || result.code !== 0) {
    sendJson(res, 502, {
      ok: false,
      error: result.msg || "飞书 Webhook 消息发送失败。",
      feishu: result,
    });
    return;
  }

  sendJson(res, 200, { ok: true, data: result });
}

async function sendAppMessage(body, res) {
  if (!config.appId || !config.appSecret) {
    sendJson(res, 500, {
      ok: false,
      error: "缺少 FEISHU_APP_ID 或 FEISHU_APP_SECRET，请先配置 .env。",
    });
    return;
  }

  const receiveId = body.receiveId || config.defaultReceiveId;
  const receiveIdType = body.receiveIdType || config.defaultReceiveIdType;
  const text = String(body.text || "").trim();

  if (!receiveId) {
    sendJson(res, 400, { ok: false, error: "缺少飞书接收 ID。" });
    return;
  }

  if (!text) {
    sendJson(res, 400, { ok: false, error: "缺少要发送的消息内容。" });
    return;
  }

  const token = await getTenantAccessToken();
  const url = `${config.apiBase}/open-apis/im/v1/messages?receive_id_type=${encodeURIComponent(receiveIdType)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      receive_id: receiveId,
      msg_type: "text",
      content: JSON.stringify({ text }),
    }),
  });

  const result = await response.json();
  if (!response.ok || result.code !== 0) {
    sendJson(res, 502, {
      ok: false,
      error: result.msg || "飞书消息发送失败。",
      feishu: result,
    });
    return;
  }

  sendJson(res, 200, { ok: true, data: result.data });
}

function createWebhookSign(timestamp, secret) {
  const stringToSign = `${timestamp}\n${secret}`;
  return crypto.createHmac("sha256", stringToSign).update("").digest("base64");
}

async function getTenantAccessToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const response = await fetch(`${config.apiBase}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      app_id: config.appId,
      app_secret: config.appSecret,
    }),
  });

  const result = await response.json();
  if (!response.ok || result.code !== 0) {
    throw new Error(result.msg || "获取 tenant_access_token 失败。");
  }

  tokenCache = {
    token: result.tenant_access_token,
    expiresAt: Date.now() + Math.max(60, result.expire - 120) * 1000,
  };
  return tokenCache.token;
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(rootDir, pathname));

  if (filePath !== rootDir && !filePath.startsWith(`${rootDir}${path.sep}`)) {
    sendJson(res, 403, { ok: false, error: "Forbidden" });
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(res, 404, { ok: false, error: "Not found" });
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    res.end(content);
  });
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        req.destroy();
        reject(new Error("请求体过大。"));
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("请求体不是有效 JSON。"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return fs.readFileSync(filePath, "utf8").split(/\r?\n/).reduce((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return acc;
    const separator = trimmed.indexOf("=");
    if (separator === -1) return acc;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    acc[key] = value;
    return acc;
  }, {});
}
