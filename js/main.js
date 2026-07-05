const screens = [
  {
    id: "intro",
    header: "服务介绍",
    eyebrow: "PPT service",
    title: "把资料交给我们，先看样稿，再确认全套 PPT。",
    copy: "上传资料后，网页会在本地读取可用内容、生成页面大纲，并导出 PPTX、PDF 或讲稿。",
  },
  {
    id: "upload",
    header: "上传资料",
    eyebrow: "Project brief",
    title: "先补齐制作资料，我们会根据内容匹配合适的 PPT 风格。",
    copy: "填写项目场景、受众、页数和素材说明。TXT / MD 文件会在浏览器本地读取，不会上传到服务器。",
  },
  {
    id: "processing",
    header: "处理中",
    eyebrow: "Preparing",
    title: "正在整理资料并匹配模板方向。",
    copy: "网页会基于你填写的内容生成可预览、可导出的 PPT 页面结构。",
  },
  {
    id: "style",
    header: "选择风格",
    eyebrow: "Style options",
    title: "选择一个样稿方向。",
    copy: "前三个推荐项为预设设计方向；如果都不合适，第四个可以自定义。",
  },
  {
    id: "sample",
    header: "确认样稿",
    eyebrow: "Sample review",
    title: "这是按已选模板方向生成的完整样稿。",
    copy: "左侧已把你的文字置入所选风格，形成完整页数样稿；你可以返回重选风格或进入修改反馈。",
  },
  {
    id: "revision",
    header: "修改反馈",
    eyebrow: "Revision",
    title: "告诉我们需要调整哪里。",
    copy: "修改意见会进入导出文件和讲稿说明，也会更新后续页面预览。",
  },
  {
    id: "making",
    header: "制作中",
    eyebrow: "Creating deck",
    title: "正在制作完整 PPT。",
    copy: "样稿确认后，网页会扩展完整页面并准备导出文件。",
  },
  {
    id: "final",
    header: "成稿预览",
    eyebrow: "Final preview",
    title: "完整成稿已准备好，请确认是否需要修改。",
    copy: "这里展示的是实际会进入 PPTX / PDF 的页面内容。",
  },
  {
    id: "export",
    header: "导出下载",
    eyebrow: "Export",
    title: "选择你需要的交付格式。",
    copy: "下载会在浏览器本地生成，不需要后端服务。",
  },
];

const styles = [
  {
    id: "profile",
    label: "方案 01",
    title: "企业介绍模板",
    copy: "蓝色建筑底图、双语标题和大面积留白，适合公司介绍与可信背书。",
    tag: "Enterprise intro",
    source: "企业介绍设计参考",
    example: {
      brand: "BRAND",
      title: "企业介绍模板",
      subtitle: "ENTERPRISE INTRODUCTION TEMPLATE",
      footer: "品牌展示 · 企业介绍",
    },
    colors: { bg: "EAF5FF", title: "064B78", accent: "0B7FC3", soft: "CFEAFF", text: "24485C" },
  },
  {
    id: "product",
    label: "方案 02",
    title: "产品推广方案",
    copy: "白底、蓝色侧栏和产品图占位，适合产品介绍、发布会与客户提案。",
    tag: "Product launch",
    source: "产品推广设计参考",
    example: {
      brand: "YOUR LOGO",
      title: "产品推广方案",
      subtitle: "Product Launch",
      footer: "Product Launch · Electronics",
    },
    colors: { bg: "F7FAFF", title: "1A2440", accent: "2563EB", soft: "DCEBFF", text: "41516F" },
  },
  {
    id: "pitch",
    label: "方案 03",
    title: "商业计划书通用模板",
    copy: "建筑实景、青蓝标题和商务目录结构，适合商业计划、融资路演和方案汇报。",
    tag: "Business plan",
    source: "商业计划设计参考",
    example: {
      brand: "Business",
      title: "商业计划书",
      subtitle: "商务风商业计划书通用模板",
      footer: "汇报人：张小可",
    },
    colors: { bg: "EFF8FF", title: "14385C", accent: "0EA5E9", soft: "CDEEFF", text: "31506D" },
  },
  {
    id: "custom",
    label: "自定义",
    title: "描述你的风格",
    copy: "如果你已有明确方向，可以选择这一项，并在下方说明想要的视觉感觉。",
    tag: "Custom",
    colors: { bg: "FBF8F2", title: "14213D", accent: "C36B2D", soft: "F3E4D4", text: "4B5563" },
  },
];

const storageKey = "gzl-ppt-assistant-state-v3";
const defaultOutputs = ["pptx", "pdf", "notes"];

const state = {
  screen: "intro",
  projectName: "",
  useCase: "",
  audience: "",
  materials: "",
  referenceLinks: "",
  pageCount: "5页以内",
  selectedOutputs: [...defaultOutputs],
  attachedFiles: [],
  extractedText: "",
  selectedStyle: "profile",
  customStyleDescription: "",
  revisionMode: "sample",
  revisionArea: "整体视觉",
  revisionLevel: "轻微调整",
  revisionText: "",
  deckPages: [],
  exportRecords: [],
};

let autoTimer = null;
let fileStore = [];

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

restoreState();

function restoreState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    Object.assign(state, saved, { screen: "intro" });
    if (!Array.isArray(state.selectedOutputs) || state.selectedOutputs.length === 0) {
      state.selectedOutputs = [...defaultOutputs];
    }
    if (!Array.isArray(state.deckPages)) state.deckPages = [];
    if (!Array.isArray(state.attachedFiles)) state.attachedFiles = [];
    if (!Array.isArray(state.exportRecords)) state.exportRecords = [];
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function persistState() {
  const { screen, ...savedState } = state;
  localStorage.setItem(storageKey, JSON.stringify(savedState));
}

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
  const materialsInput = document.querySelector("[name='materials']");
  const referenceLinksInput = document.querySelector("[name='referenceLinks']");
  const pageCountInput = document.querySelector("[name='pageCount']");
  const customStyleInput = document.querySelector("[name='customStyleDescription']");
  const revisionAreaInput = document.querySelector("[name='revisionArea']");
  const revisionLevelInput = document.querySelector("[name='revisionLevel']");
  const revisionTextInput = document.querySelector("[name='revisionText']");
  const outputControls = [...document.querySelectorAll("[name='outputFormat']")];

  if (projectInput) state.projectName = projectInput.value.trim();
  if (useCaseInput) state.useCase = useCaseInput.value;
  if (audienceInput) state.audience = audienceInput.value.trim();
  if (materialsInput) state.materials = materialsInput.value.trim();
  if (referenceLinksInput) state.referenceLinks = referenceLinksInput.value.trim();
  if (pageCountInput) state.pageCount = pageCountInput.value;
  if (customStyleInput) state.customStyleDescription = customStyleInput.value.trim();
  if (revisionAreaInput) state.revisionArea = revisionAreaInput.value;
  if (revisionLevelInput) state.revisionLevel = revisionLevelInput.value;
  if (revisionTextInput) state.revisionText = revisionTextInput.value.trim();
  if (outputControls.length) {
    state.selectedOutputs = outputControls.filter((input) => input.checked).map((input) => input.value);
  }

  persistState();
}

function renderIntro() {
  return `
    <div class="intro-grid">
      <article class="intro-card">
        <strong>1. 上传资料</strong>
        <p>填写文案、场景、受众和输出要求。TXT / MD 文件可被本地读取。</p>
      </article>
      <article class="intro-card">
        <strong>2. 生成成稿</strong>
        <p>网页会提炼内容，按所选风格生成样稿和完整页面。</p>
      </article>
      <article class="intro-card">
        <strong>3. 导出文件</strong>
        <p>可下载真实 PPTX、PDF 和讲稿说明，适合直接发给客户确认。</p>
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
        <textarea name="materials" rows="7" placeholder="填写已有文案、页面要点、数据结论或希望提炼的信息">${escapeHtml(state.materials)}</textarea>
      </label>
      <label class="field full">
        <span>链接 / 线上资料</span>
        <textarea name="referenceLinks" rows="4" placeholder="每行一个链接，例如官网、文章、网盘资料、视频地址">${escapeHtml(state.referenceLinks)}</textarea>
        <small>链接会写入简报和导出文件；纯前端版本不会抓取网页内容。</small>
      </label>
      <label class="field">
        <span>图片 / 截图</span>
        <input name="imageFiles" type="file" multiple accept="image/*" />
        <small>图片会作为附件记录，并在导出说明中保留。</small>
      </label>
      <label class="field">
        <span>文档 / 文本资料</span>
        <input name="documentFiles" type="file" multiple accept=".txt,.md,.csv,.json,.pdf,.ppt,.pptx,.doc,.docx" />
        <small>TXT、MD、CSV、JSON 会自动读取；PDF、PPT、Word 会作为附件记录。</small>
      </label>
      <div class="field full">
        <span>已选资料</span>
        ${renderFileList()}
      </div>
      <div class="field full">
        <span>输出格式</span>
        <div class="checkbox-row">
          ${[
            ["pptx", "PPTX"],
            ["pdf", "PDF"],
            ["notes", "讲稿"],
          ]
            .map(
              ([value, label]) =>
                `<label><input name="outputFormat" value="${value}" type="checkbox" ${
                  state.selectedOutputs.includes(value) ? "checked" : ""
                } />${label}</label>`,
            )
            .join("")}
        </div>
      </div>
    </form>
  `;
}

function renderFileList() {
  if (!state.attachedFiles.length) {
    return `<p class="empty-note">还没有选择文件。可以只填文案，也可以补充 TXT / MD 等文本资料。</p>`;
  }

  return `
    <ul class="file-list">
      ${state.attachedFiles
        .map(
          (file) => `
            <li>
              <strong>${escapeHtml(file.name)}</strong>
              <span>${escapeHtml(file.kind)} · ${formatBytes(file.size)}${file.read ? " · 已读取文本" : ""}</span>
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

function renderProcessing() {
  return `
    <article class="processing-card">
      <span class="loader" aria-hidden="true"></span>
      <div>
        <span>${state.screen === "making" ? "Creating" : "Preparing"}</span>
        <strong>${state.screen === "making" ? "正在扩展完整 PPT 页面" : "正在整理资料并匹配模板"}</strong>
        <p>${state.screen === "making" ? "正在应用风格、修改意见和页面结构。" : "正在把用户资料转换为可导出的页面大纲。"}</p>
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
              ${renderStyleExample(style)}
              <strong>${style.title}</strong>
              <p>${style.copy}</p>
              <small class="style-source">${escapeHtml(style.source || "第四项：不使用固定模板，由你描述视觉方向。")}</small>
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
            <small>描述会写入导出文件，并影响样稿说明。</small>
          </label>
        `
        : ""
    }
  `;
}

function renderStyleExample(style) {
  const example = style.example || {
    brand: "Custom",
    title: "自定义风格",
    subtitle: "Describe your own direction",
    footer: "按你的描述生成样稿",
  };

  return `
    <div class="template-example template-example-${style.id}" aria-hidden="true">
      <span>${escapeHtml(example.brand)}</span>
      <b>${escapeHtml(example.title)}</b>
      <small>${escapeHtml(example.subtitle)}</small>
      <i></i>
      <em>${escapeHtml(example.footer)}</em>
    </div>
  `;
}

function renderSample() {
  ensureDeckPages();
  const style = getStyle();
  const styleTitle =
    style.id === "custom" && state.customStyleDescription
      ? `自定义风格：${state.customStyleDescription}`
      : style.title;

  return `
    <div class="sample-layout">
      ${renderSampleDeckPreview()}
      <div class="sample-list">
        <div><strong>样稿风格</strong><p>${escapeHtml(styleTitle)}</p></div>
        <div><strong>设计参考</strong><p>${renderStyleSource(style)}</p></div>
        <div><strong>页面结构</strong><p>${state.deckPages.map((page) => escapeHtml(page.title)).join("、")}</p></div>
        <div><strong>样稿范围</strong><p>已生成 ${state.deckPages.length} 页完整样稿，左侧预览按所选风格直接置入文字。</p></div>
        <div><strong>内容来源</strong><p>${getSourceSummary()}</p></div>
      </div>
    </div>
  `;
}

function renderStyleSource(style) {
  const source = escapeHtml(style.source || "自定义风格描述");
  return source;
}

function renderSampleDeckPreview() {
  const pages = state.deckPages;
  const cover = pages[0];
  const remainingPages = pages.slice(1);

  return `
    <section class="sample-deck-preview" aria-label="完整样稿预览">
      ${renderSlidePreview(cover, "sample-card sample-page-main", { pageNumber: "01", pointsLimit: 4 })}
      ${
        remainingPages.length
          ? `
            <div class="sample-thumb-grid">
              ${remainingPages
                .map((page, index) =>
                  renderSlidePreview(page, "sample-thumb", {
                    pageNumber: String(index + 2).padStart(2, "0"),
                    pointsLimit: 3,
                    compact: true,
                  }),
                )
                .join("")}
            </div>
          `
          : ""
      }
    </section>
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
        <p>${state.revisionMode === "final" ? "提交后会更新成稿预览和导出说明。" : "提交后会进入完整 PPT 制作。"}</p>
      </div>
    </form>
  `;
}

function renderFinal() {
  ensureDeckPages();
  return `
    <div class="final-grid">
      ${state.deckPages
        .map(
          (page, index) => `
            <article class="final-page">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${escapeHtml(page.title)}</strong>
              <p>${escapeHtml(page.subtitle)}</p>
              <ul>${page.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderExport() {
  const cards = [
    ["pptx", "PPTX", "可编辑 PPT 文件", "保留页面结构和可编辑文本，适合后续继续修改。"],
    ["pdf", "PDF", "预览 / 交付 PDF", "按当前成稿预览生成 PDF，适合发送给客户或团队查看。"],
    ["notes", "Notes", "讲稿说明", "导出每页讲稿、页面重点和修改反馈。"],
  ];
  const visibleCards = cards.filter(([type]) => state.selectedOutputs.includes(type));

  if (!visibleCards.length) {
    return `<p class="empty-note">还没有选择输出格式。请返回资料页至少选择一种交付格式。</p>`;
  }

  return `
    <div class="download-grid">
      ${visibleCards
        .map(
          ([type, label, title, copy]) => `
            <article class="download-card">
              <span>${label}</span>
              <strong>${title}</strong>
              <p>${copy}</p>
              <button class="button ${type === "pptx" ? "primary" : "secondary"}" type="button" data-export="${type}">
                ${type === "notes" ? "生成讲稿" : `下载 ${label}`}
              </button>
            </article>
          `,
        )
        .join("")}
    </div>
    ${renderExportHistory()}
  `;
}

function renderExportHistory() {
  if (!state.exportRecords.length) return "";
  return `
    <div class="export-history">
      <strong>最近生成</strong>
      <ul>
        ${state.exportRecords
          .slice(-5)
          .reverse()
          .map((record) => `<li>${escapeHtml(record.type.toUpperCase())} · ${escapeHtml(record.time)}</li>`)
          .join("")}
      </ul>
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

function renderSlidePreview(page, className = "slide-preview", options = {}) {
  const style = getStyle();
  const points = page?.points || [];
  const pointsLimit = options.pointsLimit || 4;
  const compactClass = options.compact ? " is-compact" : "";
  const pageNumber = options.pageNumber
    ? `<span class="slide-page-number">${escapeHtml(options.pageNumber)}</span>`
    : "";

  return `
    <article class="${className} slide-skin slide-skin-${style.id}${compactClass}">
      ${pageNumber}
      <p class="eyebrow">${escapeHtml(style.tag)}</p>
      <h3>${escapeHtml(page?.title || state.projectName || "项目样稿标题")}</h3>
      <p>${escapeHtml(page?.subtitle || `${state.useCase || "待选场景"} · ${state.audience || "目标观众待确认"}`)}</p>
      <ul>${points.slice(0, pointsLimit).map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
    </article>
  `;
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
    autoTimer = setTimeout(() => goTo("style"), 700);
  }

  if (screenId === "making") {
    buildDeckPages();
    autoTimer = setTimeout(() => goTo("final"), 700);
  }

  document.querySelector("#top")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function validateBrief() {
  const missing = [];
  if (!state.projectName) missing.push("项目名称");
  if (!state.useCase) missing.push("使用场景");
  if (!state.audience) missing.push("目标观众");
  if (!state.materials && !state.extractedText && !state.referenceLinks && !state.attachedFiles.length) {
    missing.push("文案 / 内容要点或资料文件");
  }
  if (!state.selectedOutputs.length) missing.push("输出格式");

  if (missing.length) {
    showToast(`请先补充：${missing.join("、")}。`);
    return false;
  }
  return true;
}

async function readSelectedFiles() {
  const inputFiles = getSelectedInputFiles();
  if (inputFiles.length) mergeFileStore(inputFiles);

  const files = fileStore;
  if (!files.length) return;

  const textParts = [];
  const fileInfo = [];

  for (const file of files) {
    const readable = isReadableTextFile(file);
    let read = false;
    if (readable) {
      try {
        textParts.push(`【${file.name}】\n${await file.text()}`);
        read = true;
      } catch {
        read = false;
      }
    }
    fileInfo.push({
      name: file.name,
      size: file.size,
      kind: getFileKind(file),
      key: getFileKey(file),
      read,
    });
  }

  state.attachedFiles = fileInfo;
  state.extractedText = textParts.join("\n\n").trim();
  persistState();
}

function getSelectedInputFiles() {
  const imageInput = document.querySelector("[name='imageFiles']");
  const documentInput = document.querySelector("[name='documentFiles']");
  return [...(imageInput?.files || []), ...(documentInput?.files || [])];
}

function mergeFileStore(files) {
  const byKey = new Map(fileStore.map((file) => [getFileKey(file), file]));
  files.forEach((file) => byKey.set(getFileKey(file), file));
  fileStore = [...byKey.values()];
}

function getFileKey(file) {
  return [file.name, file.size, file.lastModified || 0].join("::");
}

function getFileKind(file) {
  if (file.type?.startsWith("image/")) return "图片";
  if (file.type?.startsWith("text/")) return "文本";
  if (file.type === "application/pdf") return "PDF";

  const extension = file.name.split(".").pop()?.toLowerCase();
  const labels = {
    csv: "CSV",
    doc: "Word",
    docx: "Word",
    json: "JSON",
    md: "Markdown",
    pdf: "PDF",
    ppt: "PPT",
    pptx: "PPT",
    txt: "文本",
  };
  return labels[extension] || "文件";
}

function isReadableTextFile(file) {
  return (
    file.type.startsWith("text/") ||
    [".txt", ".md", ".csv", ".json"].some((extension) => file.name.toLowerCase().endsWith(extension))
  );
}

function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getCombinedText() {
  return [state.materials, state.extractedText, state.referenceLinks]
    .filter(Boolean)
    .join("\n\n")
    .replace(/\r/g, "")
    .trim();
}

function splitContentLines() {
  const lines = getCombinedText()
    .split(/\n+/)
    .flatMap((line) => {
      const cleaned = line.replace(/^[-*#\d.、\s]+/, "").trim();
      if (/^https?:\/\//i.test(cleaned)) return [`参考链接：${cleaned}`];
      if (cleaned.length > 90) return cleaned.split(/[。！？!?；;]/).map((part) => part.trim());
      return [cleaned];
    })
    .map((line) => line.replace(/^[-*#\d.、\s]+/, "").trim())
    .filter((line) => line.length > 0);

  if (lines.length) return lines;

  return [
    `${state.projectName || "项目"}面向${state.audience || "目标观众"}，用于${state.useCase || "业务沟通"}。`,
    "建议先建立可信背景，再说明核心方案和下一步行动。",
    "页面内容可在导出后继续编辑。",
  ];
}

function getTargetPageCount() {
  if (state.pageCount === "1页单页") return 1;
  if (state.pageCount === "10页左右") return 10;
  if (state.pageCount === "自动判断") return Math.min(10, Math.max(4, Math.ceil(splitContentLines().length / 2)));
  return 5;
}

function buildDeckPages() {
  const lines = splitContentLines();
  const targetCount = getTargetPageCount();
  const project = state.projectName || "PPT制作项目";
  const style = getStyle();
  const pages = [];

  pages.push({
    type: "cover",
    title: project,
    subtitle: `${state.useCase || "项目汇报"} · 面向${state.audience || "目标观众"}`,
    points: [
      `风格方向：${style.id === "custom" && state.customStyleDescription ? state.customStyleDescription : style.title}`,
      `设计参考：${style.source || "自定义风格"}`,
      `资料来源：${getSourceSummary()}`,
      "本文件由网页端根据用户资料自动生成，可继续编辑。",
    ],
    notes: "开场先说明项目背景、听众对象和这份 PPT 的目标。",
  });

  const sectionTitles = ["项目背景", "核心信息", "方案亮点", "关键数据", "执行计划", "风险与建议", "下一步行动", "交付清单", "总结页"];
  const contentPageCount = Math.max(0, targetCount - 1);

  for (let index = 0; index < contentPageCount; index += 1) {
    const title = sectionTitles[index] || `页面 ${index + 2}`;
    const chunk = getPagePoints(title, index, lines);
    pages.push({
      type: "content",
      title,
      subtitle: `${project} · ${state.useCase || "内容梳理"}`,
      points: normalizePoints(chunk),
      notes: `围绕“${title}”展开，优先讲结论，再补充证据和行动。`,
    });
  }

  if (state.revisionText) {
    pages.push({
      type: "revision",
      title: "修改反馈记录",
      subtitle: `${state.revisionArea} · ${state.revisionLevel}`,
      points: normalizePoints([state.revisionText, "导出文件已保留本次修改意见，便于继续制作。"]),
      notes: "如需继续迭代，可依据这页反馈进行二次调整。",
    });
  }

  state.deckPages = pages.slice(0, Math.max(1, targetCount + (state.revisionText ? 1 : 0)));
  persistState();
  return state.deckPages;
}

function getPagePoints(title, index, lines) {
  const pointsPerPage = 4;
  const start = index * pointsPerPage;
  const chunk = lines.slice(start, start + pointsPerPage);
  if (chunk.length) return chunk;

  const project = state.projectName || "项目";
  const audience = state.audience || "目标观众";
  const useCase = state.useCase || "业务沟通";
  const style = getStyle();
  const fallbackByTitle = {
    项目背景: [`${project}用于${useCase}，需要先建立清晰背景。`, `核心听众是${audience}，内容表达应围绕他们的关注点展开。`, "建议用简洁页面说明问题、机会和目标。"],
    核心信息: ["优先呈现最重要的结论，再补充关键依据。", "把分散资料归纳为 3 到 5 个可讲述的重点。", "每页只保留一个主观点，降低阅读负担。"],
    方案亮点: [
      `当前风格方向为${style.id === "custom" && state.customStyleDescription ? state.customStyleDescription : style.title}。`,
      `设计参考为${style.source || "用户自定义风格"}。`,
      "页面结构保留标题、副标题、要点和讲稿提示。",
      "导出后文本仍可继续编辑。",
    ],
    关键数据: ["如资料中含数据，建议用大数字、短标签和一句解释呈现。", "如果暂缺数据，可以先用结论占位，后续替换为真实指标。", "避免在同一页堆叠过多指标。"],
    执行计划: ["按时间、责任或优先级拆分下一步行动。", "每个行动点保持可落地、可追踪。", "结尾页可明确需要听众确认的事项。"],
    风险与建议: ["提前说明待补充资料、口径差异和外部依赖。", "把风险转化为具体建议，便于继续推进。", "必要时保留备选方案。"],
    下一步行动: ["确认样稿方向后可继续扩展内容。", "导出 PPTX 后可进一步替换图片、图表和品牌元素。", "讲稿可作为演示备注或客户沟通提纲。"],
    交付清单: [`输出格式：${state.selectedOutputs.map((item) => item.toUpperCase()).join("、") || "待选择"}`, `资料来源：${getSourceSummary()}`, "导出记录会保留在当前浏览器。"],
    总结页: [`${project}已形成可预览、可导出的 PPT 结构。`, "后续可根据反馈继续修改内容和视觉。", "建议在发送前复核专有名词、数字和图片授权。"],
  };
  return fallbackByTitle[title] || fallbackByTitle["核心信息"];
}

function normalizePoints(points) {
  return points
    .join("\n")
    .split(/[。；;]\s*|\n+/)
    .map((point) => point.trim())
    .filter(Boolean)
    .slice(0, 5)
    .map((point) => (point.length > 54 ? `${point.slice(0, 54)}...` : point));
}

function ensureDeckPages() {
  if (!state.deckPages.length) buildDeckPages();
}

function getSourceSummary() {
  const parts = [];
  if (state.materials) parts.push("手填文案");
  if (state.extractedText) parts.push("已读取文本文件");
  if (state.referenceLinks) parts.push("链接资料");
  if (state.attachedFiles.length) parts.push(`${state.attachedFiles.length} 个附件`);
  return parts.join("、") || "基础表单";
}

function getExportBaseName() {
  return (state.projectName || "PPT制作项目")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 48);
}

function buildNotesContent() {
  ensureDeckPages();
  const style = getStyle();
  const styleText =
    style.id === "custom" && state.customStyleDescription
      ? state.customStyleDescription
      : style.title;

  return [
    `项目名称：${state.projectName || "未填写"}`,
    `使用场景：${state.useCase || "未选择"}`,
    `目标观众：${state.audience || "未填写"}`,
    `页数预期：${state.pageCount}`,
    `风格方向：${styleText}`,
    `设计参考：${style.source || "自定义风格"}`,
    `资料来源：${getSourceSummary()}`,
    "",
    "页面讲稿：",
    ...state.deckPages.flatMap((page, index) => [
      "",
      `${index + 1}. ${page.title}`,
      `副标题：${page.subtitle}`,
      ...page.points.map((point) => `- ${point}`),
      `讲稿提示：${page.notes}`,
    ]),
    "",
    "最近修改反馈：",
    `- 修改区域：${state.revisionArea}`,
    `- 修改强度：${state.revisionLevel}`,
    `- 修改说明：${state.revisionText || "无"}`,
  ].join("\n");
}

function showToast(message, tone = "success") {
  toast.textContent = message;
  toast.dataset.tone = tone;
  toast.hidden = false;
}

function hideToast() {
  toast.hidden = true;
  toast.textContent = "";
  toast.dataset.tone = "success";
}

async function downloadExport(type) {
  updateStateFromForm();
  ensureDeckPages();
  showToast("正在生成文件，请稍等...");

  try {
    if (type === "pptx") await downloadPptx();
    if (type === "pdf") await downloadPdf();
    if (type === "notes") downloadNotes();
    state.exportRecords = [...state.exportRecords, { type, time: new Date().toLocaleString("zh-CN") }].slice(-20);
    persistState();
    render();
    showToast(`${type.toUpperCase()} 文件已生成。`);
  } catch (error) {
    console.error("Export failed", error);
    showToast(error.message || "文件生成失败，请稍后重试。", "warning");
  }
}

async function downloadPptx() {
  const PptxConstructor = getPptxConstructor();
  if (!PptxConstructor) {
    throw new Error("PPTX 生成库加载失败，请检查网络后刷新页面。");
  }

  const style = getStyle();
  const pptx = new PptxConstructor();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "PPT 制作助手";
  pptx.subject = state.useCase || "PPT";
  pptx.title = state.projectName || "PPT制作项目";
  pptx.company = "PPT 制作助手";
  pptx.lang = "zh-CN";

  state.deckPages.forEach((page, index) => {
    const slide = pptx.addSlide();
    slide.background = { color: style.colors.bg };
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 13.333,
      h: 0.16,
      fill: { color: style.colors.accent },
      line: { color: style.colors.accent },
    });
    slide.addText(String(index + 1).padStart(2, "0"), {
      x: 0.65,
      y: 0.45,
      w: 1,
      h: 0.3,
      fontFace: "Microsoft YaHei",
      fontSize: 12,
      color: style.colors.accent,
      bold: true,
    });
    slide.addText(page.title, {
      x: 0.65,
      y: 0.95,
      w: 8.5,
      h: 0.9,
      fontFace: "Microsoft YaHei",
      fontSize: page.type === "cover" ? 34 : 28,
      color: style.colors.title,
      bold: page.type !== "cover",
      breakLine: false,
      fit: "shrink",
    });
    slide.addText(page.subtitle, {
      x: 0.68,
      y: 1.92,
      w: 8.5,
      h: 0.35,
      fontFace: "Microsoft YaHei",
      fontSize: 13,
      color: style.colors.text,
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 9.65,
      y: 0.82,
      w: 2.7,
      h: 1.52,
      rectRadius: 0.08,
      fill: { color: style.colors.soft },
      line: { color: style.colors.soft },
    });
    slide.addText(getStyleLabelForSlide(style), {
      x: 9.92,
      y: 1.1,
      w: 2.15,
      h: 0.6,
      fontFace: "Microsoft YaHei",
      fontSize: 14,
      bold: true,
      color: style.colors.title,
      align: "center",
      valign: "mid",
      fit: "shrink",
    });

    page.points.slice(0, 5).forEach((point, pointIndex) => {
      const y = 2.85 + pointIndex * 0.72;
      slide.addShape(pptx.ShapeType.ellipse, {
        x: 0.78,
        y: y + 0.08,
        w: 0.16,
        h: 0.16,
        fill: { color: style.colors.accent },
        line: { color: style.colors.accent },
      });
      slide.addText(point, {
        x: 1.08,
        y,
        w: 10.8,
        h: 0.42,
        fontFace: "Microsoft YaHei",
        fontSize: 16,
        color: style.colors.text,
        fit: "shrink",
      });
    });

    if (typeof slide.addNotes === "function") {
      slide.addNotes(page.notes || "");
    }
  });

  await pptx.writeFile({ fileName: `${getExportBaseName()}.pptx` });
}

function getPptxConstructor() {
  return globalThis.PptxGenJS || globalThis.pptxgen || globalThis.pptxgenjs || null;
}

function getStyleLabelForSlide(style) {
  if (style.id === "custom" && state.customStyleDescription) return state.customStyleDescription.slice(0, 18);
  return style.title;
}

async function downloadPdf() {
  const html2PdfFactory = globalThis.html2pdf || null;
  if (!html2PdfFactory) {
    throw new Error("PDF 生成库加载失败，请检查网络后刷新页面。");
  }

  const container = document.createElement("div");
  container.className = "pdf-export-root";
  container.innerHTML = state.deckPages.map((page) => renderPdfPage(page)).join("");
  document.body.appendChild(container);

  try {
    await html2PdfFactory()
      .set({
        margin: 0,
        filename: `${getExportBaseName()}.pdf`,
        image: { type: "JPEG", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(container)
      .save();
  } finally {
    container.remove();
  }
}

function renderPdfPage(page) {
  const style = getStyle();
  return `
    <section class="pdf-page pdf-style-${style.id}">
      <p>${escapeHtml(style.tag)}</p>
      <h2>${escapeHtml(page.title)}</h2>
      <h3>${escapeHtml(page.subtitle)}</h3>
      <ul>${page.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
    </section>
  `;
}

function downloadNotes() {
  const content = buildNotesContent();
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${getExportBaseName()}-讲稿.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function handlePrimary() {
  updateStateFromForm();

  if (state.screen === "intro") goTo("upload");
  else if (state.screen === "upload") {
    await readSelectedFiles();
    updateStateFromForm();
    if (!validateBrief()) {
      render();
      showToast("资料已保存，但还缺少必填信息。", "warning");
      return;
    }
    buildDeckPages();
    goTo("processing");
  } else if (state.screen === "style") {
    buildDeckPages();
    goTo("sample");
  } else if (state.screen === "sample") goTo("making");
  else if (state.screen === "revision") {
    buildDeckPages();
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
screenArea.addEventListener("change", async (event) => {
  updateStateFromForm();

  if (event.target.matches("[type='file']")) {
    const files = [...(event.target.files || [])];
    mergeFileStore(files);
    await readSelectedFiles();
    render();
    showToast(files.some(isReadableTextFile) ? "已读取可用文本资料。" : "附件已记录。");
    return;
  }

  const styleButton = event.target.closest?.("[data-style]");
  if (styleButton) {
    state.selectedStyle = styleButton.dataset.style;
    buildDeckPages();
    persistState();
  }
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
  buildDeckPages();
  render();
});

primaryAction.addEventListener("click", handlePrimary);
secondaryAction.addEventListener("click", handleSecondary);
tertiaryAction.addEventListener("click", () => {
  state.revisionMode = "sample";
  goTo("revision");
});

render();
