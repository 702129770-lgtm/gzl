const screens = [
  {
    id: "intro",
    header: "服务介绍",
    eyebrow: "PPT service",
    title: "把资料交给我们，先看样稿，再确认全套 PPT。",
    copy: "上传资料后，我们会根据内容匹配合适的视觉方向。你只需要确认风格、样稿和成稿，最后下载 PPTX 或 PDF。",
  },
  {
    id: "upload",
    header: "上传资料",
    eyebrow: "Project brief",
    title: "先补齐制作资料，我们会根据内容匹配合适的 PPT 风格。",
    copy: "请填写项目场景、受众、页数和素材说明。预览版不会真正上传文件，只模拟用户流程。",
  },
  {
    id: "processing",
    header: "处理中",
    eyebrow: "Preparing",
    title: "正在整理资料并匹配模板方向。",
    copy: "这一步会自动完成，请稍等片刻。",
  },
  {
    id: "style",
    header: "选择风格",
    eyebrow: "Style options",
    title: "选择一个你希望样稿靠近的视觉方向。",
    copy: "如果没有满意的方向，也可以选择自定义风格，我们会按描述生成样稿。",
  },
  {
    id: "sample",
    header: "确认样稿",
    eyebrow: "Sample review",
    title: "这是根据当前资料生成的样稿方向。",
    copy: "你可以通过样稿、返回重选风格，或进入修改反馈。",
  },
  {
    id: "revision",
    header: "修改反馈",
    eyebrow: "Revision",
    title: "告诉我们需要调整哪里。",
    copy: "可以描述整体修改，也可以选择具体区域和修改强度。",
  },
  {
    id: "making",
    header: "制作中",
    eyebrow: "Creating deck",
    title: "正在制作完整 PPT。",
    copy: "样稿确认后，我们会扩展完整页面并生成预览文件。",
  },
  {
    id: "final",
    header: "成稿预览",
    eyebrow: "Final preview",
    title: "完整成稿已准备好，请确认是否需要修改。",
    copy: "如果无需修改，可以进入导出下载；如果仍需调整，会回到同一个修改反馈页。",
  },
  {
    id: "export",
    header: "导出下载",
    eyebrow: "Export",
    title: "选择你需要的交付格式。",
    copy: "预览版展示下载入口，正式版本会在这里生成真实文件。",
  },
];

const styles = [
  {
    id: "profile",
    label: "推荐 01",
    title: "高可信人物风",
    copy: "适合 CEO 介绍、个人品牌、公司简介。深色标题、清晰履历卡片、稳重可信。",
    tag: "Profile deck",
  },
  {
    id: "product",
    label: "推荐 02",
    title: "科技产品风",
    copy: "适合产品介绍、项目汇报、客户提案。信息卡片、模块化结构、数据表达清晰。",
    tag: "Product deck",
  },
  {
    id: "pitch",
    label: "推荐 03",
    title: "高冲击路演风",
    copy: "适合融资路演、增长汇报、商业计划。关键数字突出、页面节奏更强。",
    tag: "Pitch deck",
  },
  {
    id: "custom",
    label: "自定义",
    title: "描述你的风格",
    copy: "如果你已有明确方向，可以选择这一项，并在修改反馈里说明想要的视觉感觉。",
    tag: "Custom",
  },
];

const state = {
  screen: "intro",
  projectName: "",
  useCase: "",
  audience: "",
  referenceLinks: "",
  pageCount: "5页以内",
  selectedStyle: "profile",
  customStyleDescription: "",
  revisionMode: "sample",
  revisionArea: "整体视觉",
  revisionLevel: "轻微调整",
  revisionText: "",
};

let autoTimer = null;

const headerStep = document.querySelector("#header-step");
const headerTitle = document.querySelector("#header-title");
const stepEyebrow = document.querySelector("#step-eyebrow");
const screenTitle = document.querySelector("#screen-title");
const screenCopy = document.querySelector("#screen-copy");
const screenArea = document.querySelector("#screen-area");
const primaryAction = document.querySelector("#primary-action");
const secondaryAction = document.querySelector("#secondary-action");
const tertiaryAction = document.querySelector("#tertiary-action");
const toast = document.querySelector("#toast");

function getScreen() {
  return screens.find((screen) => screen.id === state.screen) || screens[0];
}

function getScreenIndex() {
  const screenSteps = {
    intro: 1,
    upload: 2,
    processing: 3,
    style: 3,
    sample: 4,
    revision: state.revisionMode === "final" ? 6 : 5,
    making: 6,
    final: 6,
    export: 7,
  };

  return screenSteps[state.screen] || 1;
}

function getStyle() {
  return styles.find((style) => style.id === state.selectedStyle) || styles[0];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function updateStateFromForm() {
  const projectInput = document.querySelector("[name='projectName']");
  const useCaseInput = document.querySelector("[name='useCase']");
  const audienceInput = document.querySelector("[name='audience']");
  const referenceLinksInput = document.querySelector("[name='referenceLinks']");
  const pageCountInput = document.querySelector("[name='pageCount']");
  const customStyleInput = document.querySelector("[name='customStyleDescription']");
  const revisionAreaInput = document.querySelector("[name='revisionArea']");
  const revisionLevelInput = document.querySelector("[name='revisionLevel']");
  const revisionTextInput = document.querySelector("[name='revisionText']");

  if (projectInput) state.projectName = projectInput.value.trim();
  if (useCaseInput) state.useCase = useCaseInput.value;
  if (audienceInput) state.audience = audienceInput.value.trim();
  if (referenceLinksInput) state.referenceLinks = referenceLinksInput.value.trim();
  if (pageCountInput) state.pageCount = pageCountInput.value;
  if (customStyleInput) state.customStyleDescription = customStyleInput.value.trim();
  if (revisionAreaInput) state.revisionArea = revisionAreaInput.value;
  if (revisionLevelInput) state.revisionLevel = revisionLevelInput.value;
  if (revisionTextInput) state.revisionText = revisionTextInput.value.trim();
}

function renderIntro() {
  return `
    <div class="intro-grid">
      <article class="intro-card">
        <strong>1. 上传资料</strong>
        <p>填写文案、场景、受众和输出要求。图片、视频和文档可以作为制作参考。</p>
      </article>
      <article class="intro-card">
        <strong>2. 确认样稿</strong>
        <p>先看一页代表性样稿，确认方向后再制作完整 PPT。</p>
      </article>
      <article class="intro-card">
        <strong>3. 导出成稿</strong>
        <p>完整成稿确认后，可导出 PPTX 或 PDF。</p>
      </article>
    </div>
  `;
}

function renderUpload() {
  return `
    <form class="field-grid" id="brief-form">
      <label class="field">
        <span>项目名称</span>
        <input name="projectName" type="text" value="${escapeHtml(state.projectName)}" placeholder="例如：某公司 CEO 单页介绍" />
      </label>
      <label class="field">
        <span>使用场景</span>
        <select name="useCase">
          ${["", "CEO介绍", "品牌客户提案", "产品介绍", "融资路演", "项目汇报", "培训课件"]
            .map((item) => `<option value="${item}" ${state.useCase === item ? "selected" : ""}>${item || "请选择"}</option>`)
            .join("")}
        </select>
      </label>
      <label class="field">
        <span>目标观众</span>
        <input name="audience" type="text" value="${escapeHtml(state.audience)}" placeholder="例如：品牌客户、投资人、内部团队" />
      </label>
      <label class="field">
        <span>页数预期</span>
        <select name="pageCount">
          ${["1页单页", "5页以内", "10页左右", "自动判断"]
            .map((item) => `<option value="${item}" ${state.pageCount === item ? "selected" : ""}>${item}</option>`)
            .join("")}
        </select>
      </label>
      <label class="field full">
        <span>文案 / 内容要点</span>
        <textarea name="materials" rows="6" placeholder="填写已有文案、页面要点、数据结论或希望提炼的信息"></textarea>
      </label>
      <label class="field full">
        <span>链接 / 线上资料</span>
        <textarea name="referenceLinks" rows="4" placeholder="每行一个链接，例如官网、文章、网盘资料、视频地址">${escapeHtml(state.referenceLinks)}</textarea>
        <small>可以补充网页、视频、云盘或其他线上参考资料。</small>
      </label>
      <label class="field">
        <span>图片 / 截图</span>
        <input type="file" multiple accept="image/*" />
        <small>预览版仅展示入口，不会实际上传文件。</small>
      </label>
      <label class="field">
        <span>文档 / PPT / PDF</span>
        <input type="file" multiple accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.md" />
        <small>正式版本会读取文件并生成内容提纲。</small>
      </label>
      <div class="field full">
        <span>输出格式</span>
        <div class="checkbox-row">
          <label><input type="checkbox" checked />PPTX</label>
          <label><input type="checkbox" />PDF</label>
          <label><input type="checkbox" />讲稿</label>
        </div>
      </div>
    </form>
  `;
}

function renderProcessing() {
  return `
    <article class="processing-card">
      <span class="loader" aria-hidden="true"></span>
      <div>
        <span>${state.screen === "making" ? "Creating" : "Preparing"}</span>
        <strong>${state.screen === "making" ? "正在扩展完整 PPT 页面" : "正在整理资料并匹配模板"}</strong>
        <p>${state.screen === "making" ? "我们正在根据样稿方向制作完整成稿。" : "我们会根据当前场景匹配合适的视觉方向。"}</p>
      </div>
    </article>
  `;
}

function renderStyle() {
  return `
    <div class="style-grid">
      ${styles
        .map(
          (style) => `
            <button class="style-card ${state.selectedStyle === style.id ? "is-selected" : ""}" type="button" data-style="${style.id}">
              <span>${style.label}</span>
              <strong>${style.title}</strong>
              <p>${style.copy}</p>
              <div class="style-preview" aria-hidden="true"><i></i><i></i><i></i></div>
            </button>
          `,
        )
        .join("")}
    </div>
    ${
      state.selectedStyle === "custom"
        ? `
          <label class="field full custom-style-field">
            <span>描述你想要的风格</span>
            <textarea name="customStyleDescription" rows="5" placeholder="例如：高级、简洁、偏科技感；用深色背景，标题要有冲击力，图片区域更大">${escapeHtml(state.customStyleDescription)}</textarea>
            <small>描述越具体，样稿方向越接近你的预期。</small>
          </label>
        `
        : ""
    }
  `;
}

function renderSample() {
  const style = getStyle();
  const styleTitle =
    style.id === "custom" && state.customStyleDescription
      ? `自定义风格：${state.customStyleDescription}`
      : style.title;
  return `
    <div class="sample-layout">
      <article class="sample-card">
        <p class="eyebrow">${style.tag}</p>
        <h3>${escapeHtml(state.projectName || "项目样稿标题")}</h3>
        <p>${escapeHtml(state.useCase || "待选场景")} · ${escapeHtml(state.audience || "目标观众待确认")} · ${escapeHtml(state.pageCount)}</p>
      </article>
      <div class="sample-list">
        <div><strong>样稿风格</strong><p>${escapeHtml(styleTitle)}</p></div>
        <div><strong>页面结构</strong><p>封面、核心信息、价值说明、行动建议。</p></div>
        <div><strong>确认后</strong><p>通过样稿后，我们会制作完整 PPT。</p></div>
      </div>
    </div>
  `;
}

function renderRevision() {
  return `
    <form class="revision-grid" id="revision-form">
      <label class="field">
        <span>修改区域</span>
        <select name="revisionArea">
          ${["整体视觉", "标题文案", "图片位置", "配色风格", "数据图表", "页面结构"]
            .map((item) => `<option value="${item}" ${state.revisionArea === item ? "selected" : ""}>${item}</option>`)
            .join("")}
        </select>
      </label>
      <label class="field">
        <span>修改强度</span>
        <select name="revisionLevel">
          ${["轻微调整", "局部重做", "整体重做"]
            .map((item) => `<option value="${item}" ${state.revisionLevel === item ? "selected" : ""}>${item}</option>`)
            .join("")}
        </select>
      </label>
      <label class="field full">
        <span>修改说明</span>
        <textarea name="revisionText" rows="7" placeholder="例如：保留整体方向，但封面标题更简洁，人物图更大，颜色降低饱和度">${escapeHtml(state.revisionText)}</textarea>
      </label>
      <div class="revision-card full">
        <strong>${state.revisionMode === "final" ? "成稿修改" : "样稿修改"}</strong>
        <p>${state.revisionMode === "final" ? "提交后会回到成稿预览继续确认。" : "提交后会进入完整 PPT 制作。"}</p>
      </div>
    </form>
  `;
}

function renderFinal() {
  const items = ["封面", "项目背景", "核心方案", "关键数据", "执行计划", "结尾页"];
  return `
    <div class="final-grid">
      ${items
        .map(
          (item, index) => `
            <article class="final-page">
              <strong>${String(index + 1).padStart(2, "0")} · ${item}</strong>
              <p>${getStyle().title} · ${state.useCase || "项目内容"} · ${state.pageCount}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderExport() {
  return `
    <div class="download-grid">
      <article class="download-card">
        <span>PPTX</span>
        <strong>可编辑 PPT 文件</strong>
        <p>保留页面结构和可编辑文本，适合后续继续修改。</p>
        <button class="button primary" type="button" data-export="pptx">下载 PPTX</button>
      </article>
      <article class="download-card">
        <span>PDF</span>
        <strong>预览 / 交付 PDF</strong>
        <p>适合发送给客户、团队或外部合作方查看。</p>
        <button class="button secondary" type="button" data-export="pdf">下载 PDF</button>
      </article>
      <article class="download-card">
        <span>Notes</span>
        <strong>讲稿说明</strong>
        <p>可选导出每页讲稿和演示备注。</p>
        <button class="button secondary" type="button" data-export="notes">生成讲稿</button>
      </article>
    </div>
  `;
}

function renderScreenBody() {
  if (state.screen === "intro") return renderIntro();
  if (state.screen === "upload") return renderUpload();
  if (state.screen === "processing" || state.screen === "making") return renderProcessing();
  if (state.screen === "style") return renderStyle();
  if (state.screen === "sample") return renderSample();
  if (state.screen === "revision") return renderRevision();
  if (state.screen === "final") return renderFinal();
  if (state.screen === "export") return renderExport();
  return "";
}

function updateActions() {
  secondaryAction.hidden = state.screen === "intro" || state.screen === "processing" || state.screen === "making";
  tertiaryAction.hidden = state.screen !== "sample";
  primaryAction.hidden = state.screen === "processing" || state.screen === "making";

  const primaryLabels = {
    intro: "开始制作",
    upload: "提交资料",
    style: "确认风格",
    sample: "样稿通过，制作全套",
    revision: state.revisionMode === "final" ? "提交成稿修改" : "提交样稿修改",
    final: "无需修改，去导出",
    export: "完成",
  };

  const secondaryLabels = {
    upload: "返回介绍",
    style: "重新匹配",
    sample: "返回重选风格",
    revision: state.revisionMode === "final" ? "返回成稿预览" : "返回样稿确认",
    final: "需要修改",
    export: "返回成稿预览",
  };

  primaryAction.textContent = primaryLabels[state.screen] || "下一步";
  secondaryAction.textContent = secondaryLabels[state.screen] || "返回";
}

function render() {
  const screen = getScreen();
  const index = getScreenIndex();
  headerStep.textContent = `第 ${index} 步`;
  headerTitle.textContent = screen.header;
  stepEyebrow.textContent = screen.eyebrow;
  screenTitle.textContent = screen.title;
  screenCopy.textContent = screen.copy;
  screenArea.innerHTML = renderScreenBody();
  updateActions();
}

function goTo(screenId) {
  clearTimeout(autoTimer);
  updateStateFromForm();
  state.screen = screenId;
  hideToast();
  render();

  if (screenId === "processing") {
    autoTimer = setTimeout(() => goTo("style"), 900);
  }

  if (screenId === "making") {
    autoTimer = setTimeout(() => goTo("final"), 900);
  }

  document.querySelector("#top")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getExportBaseName() {
  return (state.projectName || "PPT制作项目")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 48);
}

function buildExportContent(type) {
  const style = getStyle();
  const styleText =
    style.id === "custom" && state.customStyleDescription
      ? state.customStyleDescription
      : style.title;

  return [
    `导出类型：${type.toUpperCase()}`,
    `项目名称：${state.projectName || "未填写"}`,
    `使用场景：${state.useCase || "未选择"}`,
    `目标观众：${state.audience || "未填写"}`,
    `页数预期：${state.pageCount}`,
    `风格方向：${styleText}`,
    "",
    "成稿页面：",
    "1. 封面",
    "2. 项目背景",
    "3. 核心方案",
    "4. 关键数据",
    "5. 执行计划",
    "6. 结尾页",
    "",
    "最近修改反馈：",
    `- 修改区域：${state.revisionArea}`,
    `- 修改强度：${state.revisionLevel}`,
    `- 修改说明：${state.revisionText || "无"}`,
    "",
    "说明：当前网页为公开预览版，下载文件用于确认外部流程与交付信息。",
  ].join("\n");
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
}

function hideToast() {
  toast.hidden = true;
  toast.textContent = "";
}

function downloadExport(type) {
  updateStateFromForm();
  const content = buildExportContent(type);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${getExportBaseName()}-${type}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(`${type.toUpperCase()} 预览文件已生成。`);
}

function handlePrimary() {
  updateStateFromForm();

  if (state.screen === "intro") goTo("upload");
  else if (state.screen === "upload") goTo("processing");
  else if (state.screen === "style") goTo("sample");
  else if (state.screen === "sample") goTo("making");
  else if (state.screen === "revision") {
    if (state.revisionMode === "final") goTo("final");
    else goTo("making");
  } else if (state.screen === "final") goTo("export");
  else if (state.screen === "export") goTo("intro");
}

function handleSecondary() {
  updateStateFromForm();

  if (state.screen === "upload") goTo("intro");
  else if (state.screen === "style") goTo("processing");
  else if (state.screen === "sample") goTo("style");
  else if (state.screen === "revision") goTo(state.revisionMode === "final" ? "final" : "sample");
  else if (state.screen === "final") {
    state.revisionMode = "final";
    goTo("revision");
  } else if (state.screen === "export") goTo("final");
}

screenArea.addEventListener("input", updateStateFromForm);
screenArea.addEventListener("change", (event) => {
  updateStateFromForm();
  const styleButton = event.target.closest?.("[data-style]");
  if (styleButton) state.selectedStyle = styleButton.dataset.style;
});

screenArea.addEventListener("click", (event) => {
  const exportButton = event.target.closest("[data-export]");
  if (exportButton) {
    downloadExport(exportButton.dataset.export);
    return;
  }

  const styleButton = event.target.closest("[data-style]");
  if (!styleButton) return;
  state.selectedStyle = styleButton.dataset.style;
  render();
});

primaryAction.addEventListener("click", handlePrimary);
secondaryAction.addEventListener("click", handleSecondary);
tertiaryAction.addEventListener("click", () => {
  state.revisionMode = "sample";
  goTo("revision");
});

render();
