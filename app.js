const defaultSteps = [
  {
    title: "上传资料",
    detail: "收集文档、截图、图片、视频、旧 PPT 或 Canva 链接，并记录资料使用限制。",
    status: "pending",
  },
  {
    title: "资料读取与分类",
    detail: "区分内容素材、人物素材、Logo、样张、风格参考和旧 PPT 来源。",
    status: "pending",
  },
  {
    title: "确认需求范围",
    detail: "确认用途、目标观众、页数、语言、输出格式和素材使用权限。",
    status: "pending",
  },
  {
    title: "Canva 风格搜索",
    detail: "优先从 Canva 模板或公开分类中搜索匹配的演示风格方向。",
    status: "pending",
  },
  {
    title: "确认风格选项",
    detail: "给出 2-3 个 Canva 风格选项，并等待用户确认后再进入大纲设计。",
    status: "pending",
  },
  {
    title: "生成大纲与版式",
    detail: "根据确认的用途、受众和风格，生成页面结构与版式方案。",
    status: "pending",
  },
  {
    title: "制作 1 页样稿",
    detail: "先制作一页代表性样稿，体现已确认的 Canva 风格和核心内容。",
    status: "pending",
  },
  {
    title: "样稿确认",
    detail: "确认风格、信息密度、图片处理和视觉方向，未通过则继续修改样稿。",
    status: "pending",
  },
  {
    title: "制作完整 PPT",
    detail: "样稿通过后再制作完整 PPT，统一视觉系统并完成页面美化。",
    status: "pending",
  },
  {
    title: "质量检查",
    detail: "检查内容、大纲、Canva 风格、授权限制、文字、图片和页面遮挡问题。",
    status: "pending",
  },
  {
    title: "导出交付",
    detail: "输出 PPTX、PDF，并按需附上讲稿、Canva 风格说明和素材使用说明。",
    status: "pending",
  },
];

const state = {
  steps: clone(defaultSteps),
  startedAt: null,
  timer: null,
  logs: [],
};

const $ = (selector) => document.querySelector(selector);
const isGitHubPages = window.location.hostname.endsWith(".github.io");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const elements = {
  projectName: $("#projectName"),
  operatorName: $("#operatorName"),
  inputSource: $("#inputSource"),
  workflowTitle: $("#workflowTitle"),
  stepEditor: $("#stepEditor"),
  flowBoard: $("#flowBoard"),
  logList: $("#logList"),
  totalSteps: $("#totalSteps"),
  doneSteps: $("#doneSteps"),
  currentStatus: $("#currentStatus"),
  runtime: $("#runtime"),
  feishuMode: $("#feishuMode"),
  feishuReceiveType: $("#feishuReceiveType"),
  feishuReceiveId: $("#feishuReceiveId"),
  feishuWebhookUrl: $("#feishuWebhookUrl"),
  feishuWebhookSecret: $("#feishuWebhookSecret"),
  feishuAutoNotify: $("#feishuAutoNotify"),
};

function nowLabel() {
  return new Date().toLocaleString("zh-CN", { hour12: false });
}

function addLog(message) {
  state.logs.unshift({ time: nowLabel(), message });
  renderLogs();
}

function loadFeishuSettings() {
  const saved = localStorage.getItem("workflow-console-feishu");
  if (!saved) return;
  try {
    const settings = JSON.parse(saved);
    elements.feishuMode.value = settings.mode || "webhook";
    elements.feishuReceiveType.value = settings.receiveIdType || "chat_id";
    elements.feishuReceiveId.value = settings.receiveId || "";
    elements.feishuWebhookUrl.value = settings.webhookUrl || "";
    elements.feishuWebhookSecret.value = settings.webhookSecret || "";
    elements.feishuAutoNotify.checked = Boolean(settings.autoNotify);
    updateFeishuModeFields();
  } catch {
    localStorage.removeItem("workflow-console-feishu");
  }
}

function saveFeishuSettings() {
  localStorage.setItem(
    "workflow-console-feishu",
    JSON.stringify({
      mode: elements.feishuMode.value,
      receiveIdType: elements.feishuReceiveType.value,
      receiveId: elements.feishuReceiveId.value.trim(),
      webhookUrl: elements.feishuWebhookUrl.value.trim(),
      webhookSecret: elements.feishuWebhookSecret.value.trim(),
      autoNotify: elements.feishuAutoNotify.checked,
    }),
  );
}

function updateFeishuModeFields() {
  document.querySelectorAll("[data-feishu-mode]").forEach((field) => {
    field.hidden = field.dataset.feishuMode !== elements.feishuMode.value;
  });
}

function getProjectName() {
  return elements.projectName.value.trim() || "Canva PPT 工作流";
}

function render() {
  elements.workflowTitle.textContent = getProjectName();
  elements.totalSteps.textContent = state.steps.length;
  elements.doneSteps.textContent = state.steps.filter((step) => step.status === "done").length;
  elements.currentStatus.textContent = getStatusLabel();
  renderStepEditor();
  renderBoard();
}

function getStatusLabel() {
  if (state.steps.every((step) => step.status === "done")) return "已完成";
  if (state.steps.some((step) => step.status === "active")) return "运行中";
  return "未开始";
}

function renderStepEditor() {
  elements.stepEditor.innerHTML = "";
  state.steps.forEach((step, index) => {
    const row = document.createElement("div");
    row.className = "step-edit-row";

    const input = document.createElement("input");
    input.value = step.title;
    input.setAttribute("aria-label", `步骤 ${index + 1} 名称`);
    input.addEventListener("input", () => {
      state.steps[index].title = input.value.trim() || `步骤 ${index + 1}`;
      renderBoard();
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `删除步骤 ${index + 1}`);
    remove.addEventListener("click", () => {
      state.steps.splice(index, 1);
      addLog(`已删除步骤：${step.title}`);
      render();
    });

    row.append(input, remove);
    elements.stepEditor.appendChild(row);
  });
}

function renderBoard() {
  const template = $("#stepCardTemplate");
  elements.flowBoard.innerHTML = "";
  state.steps.forEach((step, index) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.classList.toggle("active", step.status === "active");
    card.classList.toggle("done", step.status === "done");
    card.querySelector(".step-index").textContent = index + 1;
    card.querySelector(".step-state").textContent = step.status === "done" ? "完成" : step.status === "active" ? "进行中" : "待处理";
    card.querySelector("h3").textContent = step.title;
    card.querySelector("p").textContent = step.detail;
    card.querySelector(".mark-done").addEventListener("click", () => markDone(index));
    card.querySelector(".mark-reset").addEventListener("click", () => resetStep(index));
    elements.flowBoard.appendChild(card);
  });
}

function renderLogs() {
  elements.logList.innerHTML = "";
  if (state.logs.length === 0) {
    const empty = document.createElement("div");
    empty.className = "log-item";
    empty.textContent = "暂无日志。";
    elements.logList.appendChild(empty);
    return;
  }

  state.logs.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "log-item";
    item.innerHTML = `<time>${entry.time}</time><span>${entry.message}</span>`;
    elements.logList.appendChild(item);
  });
}

function markDone(index) {
  state.steps[index].status = "done";
  const next = state.steps.findIndex((step) => step.status !== "done");
  state.steps.forEach((step, stepIndex) => {
    if (step.status === "done") return;
    step.status = stepIndex === next ? "active" : "pending";
  });
  addLog(`已完成：${state.steps[index].title}`);
  render();
  if (elements.feishuAutoNotify.checked) {
    sendFeishuUpdate(`已完成步骤：${state.steps[index].title}`);
  }
}

function resetStep(index) {
  state.steps[index].status = "pending";
  addLog(`已重置：${state.steps[index].title}`);
  render();
}

function startTimer() {
  state.startedAt = Date.now();
  clearInterval(state.timer);
  state.timer = setInterval(() => {
    const seconds = Math.floor((Date.now() - state.startedAt) / 1000);
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    elements.runtime.textContent = `${min}:${sec}`;
  }, 500);
}

function runWorkflow() {
  if (state.steps.length === 0) {
    addLog("请先新增至少一个流程步骤。");
    return;
  }

  state.steps = state.steps.map((step, index) => ({
    ...step,
    status: index === 0 ? "active" : "pending",
  }));
  startTimer();
  addLog(`开始运行：${getProjectName()}`);
  render();
  if (elements.feishuAutoNotify.checked) {
    sendFeishuUpdate("工作流已开始");
  }
}

function buildPayload() {
  return {
    projectName: getProjectName(),
    operatorName: elements.operatorName.value.trim(),
    inputSource: elements.inputSource.value.trim(),
    steps: state.steps,
    logs: state.logs,
    exportedAt: new Date().toISOString(),
  };
}

function download(filename, content, type = "application/json") {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportReport() {
  const data = buildPayload();
  const lines = [
    `# ${data.projectName}`,
    "",
    `操作者：${data.operatorName || "未填写"}`,
    `输入来源：${data.inputSource || "未填写"}`,
    `导出时间：${nowLabel()}`,
    "",
    "## 步骤状态",
    ...data.steps.map((step, index) => `${index + 1}. [${step.status === "done" ? "x" : " "}] ${step.title} - ${step.detail}`),
    "",
    "## 运行日志",
    ...(data.logs.length ? data.logs.map((log) => `- ${log.time} ${log.message}`) : ["- 暂无日志"]),
  ];
  download(`${data.projectName}.md`, lines.join("\n"), "text/markdown");
  addLog("已导出 Markdown 报告。");
}

function saveConfig() {
  localStorage.setItem("workflow-console-config", JSON.stringify(buildPayload()));
  addLog("配置已保存到当前浏览器。");
}

function loadConfig(payload) {
  elements.projectName.value = payload.projectName || "";
  elements.operatorName.value = payload.operatorName || "";
  elements.inputSource.value = payload.inputSource || "";
  state.steps = Array.isArray(payload.steps) && payload.steps.length ? payload.steps : clone(defaultSteps);
  state.logs = Array.isArray(payload.logs) ? payload.logs : [];
  render();
  renderLogs();
}

function copySummary() {
  const payload = buildPayload();
  const summary = `${payload.projectName}\n完成 ${payload.steps.filter((step) => step.status === "done").length}/${payload.steps.length} 步\n输入：${payload.inputSource || "未填写"}`;
  navigator.clipboard.writeText(summary).then(() => addLog("已复制摘要。"));
}

function buildFeishuMessage(eventLabel = "当前进度") {
  const payload = buildPayload();
  const doneCount = payload.steps.filter((step) => step.status === "done").length;
  const activeStep = payload.steps.find((step) => step.status === "active");
  return [
    `Canva PPT 工作流通知：${eventLabel}`,
    `项目：${payload.projectName}`,
    `操作者：${payload.operatorName || "未填写"}`,
    `状态：${getStatusLabel()}，完成 ${doneCount}/${payload.steps.length} 步`,
    `当前步骤：${activeStep ? activeStep.title : "无"}`,
    `输入来源：${payload.inputSource || "未填写"}`,
  ].join("\n");
}

async function sendFeishuUpdate(eventLabel = "当前进度") {
  if (isGitHubPages) {
    addLog("GitHub Pages 静态版不包含飞书后端，请使用下载配置或导出报告交付。");
    return;
  }

  saveFeishuSettings();
  try {
    const response = await fetch("/api/feishu/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: elements.feishuMode.value,
        receiveIdType: elements.feishuReceiveType.value,
        receiveId: elements.feishuReceiveId.value.trim(),
        webhookUrl: elements.feishuWebhookUrl.value.trim(),
        webhookSecret: elements.feishuWebhookSecret.value.trim(),
        text: buildFeishuMessage(eventLabel),
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "飞书发送失败");
    }
    addLog("已发送飞书通知。");
  } catch (error) {
    addLog(`飞书通知失败：${formatNetworkError(error)}`);
  }
}

async function checkFeishuConfig() {
  if (isGitHubPages) {
    addLog("GitHub Pages 静态版不包含飞书后端，飞书通知不可用。");
    return;
  }

  try {
    const response = await fetch("/api/feishu/status");
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "飞书配置检测失败");
    }
    if (!result.ok) {
      addLog(`飞书配置未就绪：${result.error}`);
      return;
    }
    if (result.status.mode === "webhook") {
      addLog(`飞书 Webhook 配置可用${result.status.webhookSigned ? "，已启用签名" : ""}。`);
      return;
    }
    const receiverText = result.status.hasDefaultReceiver ? "已配置默认接收对象" : "未配置默认接收对象";
    addLog(`飞书应用机器人配置可用：token 获取成功，${receiverText}。`);
  } catch (error) {
    addLog(`飞书配置检测失败：${formatNetworkError(error)}`);
  }
}

function formatNetworkError(error) {
  if (error instanceof TypeError) {
    return "无法连接后端，请用 npm start 启动后访问 http://localhost:3000。";
  }
  return error.message;
}

function configureStaticHosting() {
  if (!isGitHubPages) return;
  elements.feishuAutoNotify.checked = false;
  elements.feishuAutoNotify.disabled = true;
  $("#checkFeishuConfig").disabled = true;
  $("#sendFeishuUpdate").disabled = true;
}

$("#runWorkflow").addEventListener("click", runWorkflow);
$("#addStep").addEventListener("click", () => {
  state.steps.push({
    title: `新步骤 ${state.steps.length + 1}`,
    detail: "点击左侧名称可改标题，后续可在配置文件中补充详细说明。",
    status: "pending",
  });
  addLog("已新增步骤。");
  render();
});
$("#saveConfig").addEventListener("click", saveConfig);
$("#exportReport").addEventListener("click", exportReport);
$("#downloadConfig").addEventListener("click", () => download(`${getProjectName()}-config.json`, JSON.stringify(buildPayload(), null, 2)));
$("#copySummary").addEventListener("click", copySummary);
$("#checkFeishuConfig").addEventListener("click", checkFeishuConfig);
$("#sendFeishuUpdate").addEventListener("click", () => sendFeishuUpdate("手动同步"));
elements.feishuMode.addEventListener("change", () => {
  updateFeishuModeFields();
  saveFeishuSettings();
});
elements.feishuReceiveType.addEventListener("change", saveFeishuSettings);
elements.feishuReceiveId.addEventListener("input", saveFeishuSettings);
elements.feishuWebhookUrl.addEventListener("input", saveFeishuSettings);
elements.feishuWebhookSecret.addEventListener("input", saveFeishuSettings);
elements.feishuAutoNotify.addEventListener("change", saveFeishuSettings);
$("#clearLog").addEventListener("click", () => {
  state.logs = [];
  renderLogs();
});
$("#loadDemo").addEventListener("click", () => {
  loadConfig({
    projectName: "资料处理与交付",
    operatorName: "演示用户",
    inputSource: "客户提供的 PPT 用途、目标观众、原始资料、素材限制和 Canva 风格要求",
    steps: defaultSteps,
    logs: [],
  });
  addLog("已载入示例流程。");
});
$("#importConfig").addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    loadConfig(payload);
    addLog("已导入配置文件。");
  } catch {
    addLog("配置文件格式不正确，请检查 JSON 后重试。");
  }
});
elements.projectName.addEventListener("input", render);

const saved = localStorage.getItem("workflow-console-config");
loadFeishuSettings();
updateFeishuModeFields();
configureStaticHosting();
if (saved) {
  try {
    loadConfig(JSON.parse(saved));
  } catch {
    localStorage.removeItem("workflow-console-config");
    render();
    renderLogs();
    addLog("本地保存的配置无法读取，已恢复默认流程。");
  }
} else {
  render();
  renderLogs();
}
