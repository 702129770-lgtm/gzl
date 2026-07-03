const STORAGE_KEY = "ppt-brief-builder";
const STEP_TITLES = ["基础信息", "素材与限制", "选择调性与风格", "输出设置"];

const form = document.querySelector("#brief-form");
const progressRow = document.querySelector("#progress-row");
const wizardSteps = Array.from(document.querySelectorAll(".wizard-step"));
const prevStepButton = document.querySelector("#prev-step");
const nextStepButton = document.querySelector("#next-step");
const generateResultButton = document.querySelector("#generate-result");
const fillExampleButton = document.querySelector("#fill-example");
const resetFormButton = document.querySelector("#reset-form");
const toneOptionsContainer = document.querySelector("#tone-options");
const toneCustomWrap = document.querySelector("#tone-custom-wrap");
const toneCustomInput = document.querySelector("#tone-custom");
const styleOptionsContainer = document.querySelector("#style-options");
const styleCustomWrap = document.querySelector("#style-custom-wrap");
const styleCustomInput = document.querySelector("#style-custom");
const confirmList = document.querySelector("#confirm-list");
const resultShell = document.querySelector("#result-shell");
const resultSummary = document.querySelector("#result-summary");
const resultText = document.querySelector("#result-text");
const copyOutputButton = document.querySelector("#copy-output");
const editOutputButton = document.querySelector("#edit-output");
const liveRegion = document.querySelector("#live-region");
const audienceCustomInput = document.querySelector("#audience-custom");
const imageFilesInput = document.querySelector("#image-files");
const imageFilesSummary = document.querySelector("#image-files-summary");
const videoFilesInput = document.querySelector("#video-files");
const videoFilesSummary = document.querySelector("#video-files-summary");
const docFilesInput = document.querySelector("#doc-files");
const docFilesSummary = document.querySelector("#doc-files-summary");

let currentStep = 0;
let latestResult = null;
let selectedToneOption = null;
let selectedStyleOption = null;
let fileSnapshots = {
  imageFiles: [],
  videoFiles: [],
  docFiles: [],
};

const TONE_LIBRARY = [
  {
    id: "trusted",
    title: "稳重可信",
    description: "适合人物介绍、品牌合作和正式汇报。",
    useCases: ["CEO介绍", "品牌客户提案", "项目汇报"],
    keywords: ["人物", "履历", "品牌", "合作", "公司", "介绍", "客户"],
  },
  {
    id: "tech",
    title: "科技简洁",
    description: "适合产品逻辑、功能说明和结构化信息。",
    useCases: ["产品介绍", "项目汇报", "融资路演"],
    keywords: ["产品", "系统", "平台", "功能", "数据", "技术", "ai"],
  },
  {
    id: "impact",
    title: "高冲击路演",
    description: "适合短时间突出机会点、增长和融资诉求。",
    useCases: ["融资路演", "品牌客户提案"],
    keywords: ["增长", "融资", "市场", "机会", "营收", "用户", "势能"],
  },
  {
    id: "story",
    title: "温和叙事",
    description: "适合品牌故事、创始人形象和案例表达。",
    useCases: ["品牌客户提案", "CEO介绍", "产品介绍"],
    keywords: ["故事", "品牌", "文化", "案例", "形象", "愿景"],
  },
  {
    id: "teaching",
    title: "清晰教学",
    description: "适合培训课件、步骤拆解和操作说明。",
    useCases: ["培训课件", "项目汇报"],
    keywords: ["培训", "步骤", "教程", "操作", "演示", "复盘"],
  },
  {
    id: "data",
    title: "数据导向",
    description: "适合图表较多、指标明确的业务说明。",
    useCases: ["项目汇报", "融资路演", "产品介绍"],
    keywords: ["数据", "图表", "指标", "同比", "环比", "分析"],
  },
];

const STYLE_LIBRARY = [
  {
    id: "trust-profile",
    title: "高可信人物风",
    source: "人物简介方向",
    fit: ["CEO介绍", "品牌客户提案", "项目汇报"],
    tones: ["稳重可信", "温和叙事"],
    colors: "深墨绿 + 米白",
    layout: "左图右文、履历卡片、信息层级清晰",
  },
  {
    id: "clean-tech",
    title: "科技简报风",
    source: "产品简报方向",
    fit: ["产品介绍", "项目汇报", "融资路演"],
    tones: ["科技简洁", "数据导向"],
    colors: "石墨灰 + 冷白 + 少量亮色",
    layout: "信息卡片、模块分区、图表留白充足",
  },
  {
    id: "editorial-story",
    title: "编辑叙事风",
    source: "品牌故事方向",
    fit: ["品牌客户提案", "产品介绍", "CEO介绍"],
    tones: ["温和叙事", "稳重可信"],
    colors: "暖米色 + 炭黑 + 低饱和强调色",
    layout: "大标题、留白明显、图片与文案并置",
  },
  {
    id: "pitch-impact",
    title: "高冲击路演风",
    source: "路演演示方向",
    fit: ["融资路演", "品牌客户提案", "产品介绍"],
    tones: ["高冲击路演", "数据导向"],
    colors: "深底色 + 高对比亮色",
    layout: "关键数字放大、结论先行、图表简练",
  },
  {
    id: "teaching-clear",
    title: "清晰教学风",
    source: "培训演示方向",
    fit: ["培训课件", "项目汇报", "产品介绍"],
    tones: ["清晰教学", "科技简洁"],
    colors: "浅底色 + 重点分栏高亮",
    layout: "步骤拆解、示意图、列表与提示框",
  },
];

const OUTLINE_LIBRARY = {
  CEO介绍: {
    "1页": ["人物定位与标题", "核心履历", "代表成绩", "合作价值"],
    "5页": ["人物封面", "角色定位", "核心经历", "代表成绩", "合作价值与联系"],
    "10页": ["人物封面", "背景与定位", "职业经历", "核心能力", "代表项目", "关键成绩", "行业观点", "合作价值", "公司关联", "结尾与联系"],
    自动判断: ["人物定位与标题", "核心履历", "代表成绩", "合作价值"],
  },
  品牌客户提案: {
    "1页": ["核心提案主题", "受众痛点", "解决方向", "合作收益"],
    "5页": ["封面", "客户问题", "策略方向", "执行方案", "预期收益"],
    "10页": ["封面", "客户背景", "问题拆解", "洞察", "策略框架", "执行方案", "内容结构", "案例或证据", "排期预算", "收尾与行动"],
    自动判断: ["封面", "客户问题", "策略方向", "执行方案", "预期收益"],
  },
  产品介绍: {
    "1页": ["产品定位", "核心功能", "关键价值", "行动入口"],
    "5页": ["封面", "用户问题", "产品定位", "核心功能", "价值总结"],
    "10页": ["封面", "市场背景", "用户问题", "产品定位", "功能模块", "使用流程", "关键数据", "案例证明", "商业价值", "收尾与行动"],
    自动判断: ["封面", "用户问题", "产品定位", "核心功能", "价值总结"],
  },
  融资路演: {
    "1页": ["机会点", "产品亮点", "增长信号", "融资诉求"],
    "5页": ["封面", "市场机会", "产品方案", "增长证明", "融资计划"],
    "10页": ["封面", "问题与机会", "市场规模", "产品方案", "增长数据", "商业模式", "竞争壁垒", "团队介绍", "融资用途", "结束页"],
    自动判断: ["封面", "市场机会", "产品方案", "增长证明", "融资计划"],
  },
  项目汇报: {
    "1页": ["项目目标", "完成情况", "关键数据", "下一步计划"],
    "5页": ["封面", "目标回顾", "执行进展", "关键数据", "风险与下一步"],
    "10页": ["封面", "目标背景", "阶段任务", "关键动作", "数据表现", "问题复盘", "经验总结", "资源需求", "下一步计划", "结束页"],
    自动判断: ["封面", "目标回顾", "执行进展", "关键数据", "风险与下一步"],
  },
  培训课件: {
    "1页": ["主题与对象", "核心知识点", "步骤方法", "课后行动"],
    "5页": ["封面", "培训目标", "核心知识点", "步骤方法", "总结与行动"],
    "10页": ["封面", "培训目标", "对象与场景", "知识点一", "知识点二", "案例演示", "常见错误", "操作步骤", "总结复盘", "课后行动"],
    自动判断: ["封面", "培训目标", "核心知识点", "步骤方法", "总结与行动"],
  },
};

const EXAMPLE_DATA = {
  projectName: "某公司 CEO 单页介绍",
  useCase: "CEO介绍",
  audienceOption: "品牌客户",
  audienceCustom: "",
  pageCount: "1页",
  language: "中文",
  materialsText: "人物截图、公司简介、3 条代表成绩、1 条行业定位说明。",
  referenceLinks: "https://example.com/company-profile",
  restrictions: "只读取截图里的文字和头像，不参考原截图版式、Logo 和旧 PPT 设计。",
  outputs: ["PPTX", "PDF"],
  imageFiles: [],
  videoFiles: [],
  docFiles: [],
  selectedToneOption: "trusted",
  toneCustom: "",
  selectedStyleOption: "trust-profile",
  styleCustom: "",
};

function announce(message) {
  liveRegion.textContent = message;
}

function saveDraft() {
  const draft = {
    data: getRawFormState(),
    currentStep,
    result: latestResult,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

function loadDraft() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return null;
    }

    return JSON.parse(saved);
  } catch (error) {
    return null;
  }
}

function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
}

function getSelectedAudience() {
  const selected = form.querySelector('input[name="audienceOption"]:checked')?.value || "";

  if (selected === "其他") {
    return audienceCustomInput.value.trim();
  }

  return selected;
}

function getReferenceLinkCount(referenceLinks) {
  return referenceLinks
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean).length;
}

function getRawFormState() {
  const formData = new FormData(form);
  const useCase = formData.get("useCase")?.trim() || "";

  return {
    projectName: formData.get("projectName")?.trim() || "",
    useCase,
    audienceOption:
      form.querySelector('input[name="audienceOption"]:checked')?.value || "品牌客户",
    audienceCustom: formData.get("audienceCustom")?.trim() || "",
    pageCount: formData.get("pageCount") || "1页",
    language: formData.get("language") || "中文",
    materialsText: formData.get("materialsText")?.trim() || "",
    referenceLinks: formData.get("referenceLinks")?.trim() || "",
    restrictions: formData.get("restrictions")?.trim() || "",
    outputs: formData.getAll("output"),
    selectedToneOption,
    toneCustom: formData.get("toneCustom")?.trim() || "",
    selectedStyleOption,
    styleCustom: formData.get("styleCustom")?.trim() || "",
    imageFiles: [...fileSnapshots.imageFiles],
    videoFiles: [...fileSnapshots.videoFiles],
    docFiles: [...fileSnapshots.docFiles],
  };
}

function getNormalizedState(raw = getRawFormState()) {
  const projectName = raw.projectName || (raw.useCase ? `${raw.useCase}项目` : "未命名项目");
  const audience = getSelectedAudience() || "未选择";
  const toneRecommendations = getToneRecommendations(raw);
  const tone = resolveTone(raw, toneRecommendations);
  const styleRecommendations = getStyleRecommendations(raw, tone.label);
  const style = resolveStyle(raw, styleRecommendations);

  return {
    ...raw,
    projectName,
    audience,
    tone,
    style,
    outline: getOutline(raw.useCase, raw.pageCount),
  };
}

function fillForm(data) {
  form.projectName.value = data.projectName || "";
  form.useCase.value = data.useCase || "";
  form.pageCount.value = data.pageCount || "1页";
  form.language.value = data.language || "中文";
  form.materialsText.value = data.materialsText || "";
  form.referenceLinks.value = data.referenceLinks || "";
  form.restrictions.value = data.restrictions || "";
  toneCustomInput.value = data.toneCustom || "";
  styleCustomInput.value = data.styleCustom || "";

  const audienceOption = data.audienceOption || "品牌客户";

  form.querySelectorAll('input[name="audienceOption"]').forEach((input) => {
    input.checked = input.value === audienceOption;
  });

  audienceCustomInput.value = data.audienceCustom || "";

  const outputSet = new Set(data.outputs || ["PPTX"]);

  form.querySelectorAll('input[name="output"]').forEach((input) => {
    input.checked = outputSet.has(input.value);
  });

  fileSnapshots = {
    imageFiles: [...(data.imageFiles || [])],
    videoFiles: [...(data.videoFiles || [])],
    docFiles: [...(data.docFiles || [])],
  };

  selectedToneOption = data.selectedToneOption || null;
  selectedStyleOption = data.selectedStyleOption || null;
  updateAudienceCustomVisibility();
  updateAllFileSummaries();
}

function setFileSnapshot(key, files) {
  fileSnapshots[key] = Array.from(files).map((file) => file.name);
  updateAllFileSummaries();
}

function formatFileSummary(items) {
  if (!items.length) {
    return "未选择文件";
  }

  return items.join("、");
}

function updateAllFileSummaries() {
  imageFilesSummary.textContent = formatFileSummary(fileSnapshots.imageFiles);
  videoFilesSummary.textContent = formatFileSummary(fileSnapshots.videoFiles);
  docFilesSummary.textContent = formatFileSummary(fileSnapshots.docFiles);
}

function updateAudienceCustomVisibility() {
  const isOther = form.querySelector('input[name="audienceOption"]:checked')?.value === "其他";

  audienceCustomInput.hidden = !isOther;
}

function getOutline(useCase, pageCount) {
  const outlineMap = OUTLINE_LIBRARY[useCase] || OUTLINE_LIBRARY.项目汇报;

  return outlineMap[pageCount] || outlineMap.自动判断;
}

function buildSignalText(raw) {
  return [
    raw.useCase,
    raw.materialsText,
    raw.referenceLinks,
    raw.imageFiles.join(" "),
    raw.videoFiles.join(" "),
    raw.docFiles.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function countKeywordMatches(signal, keywords) {
  return keywords.reduce((count, keyword) => {
    return count + (signal.includes(keyword.toLowerCase()) ? 1 : 0);
  }, 0);
}

function getToneRecommendations(raw = getRawFormState()) {
  const signal = buildSignalText(raw);

  return TONE_LIBRARY.map((tone) => {
    let score = 0;

    if (tone.useCases.includes(raw.useCase)) {
      score += 3;
    }

    score += countKeywordMatches(signal, tone.keywords);

    if (raw.videoFiles.length && tone.id === "impact") {
      score += 1;
    }

    if (raw.docFiles.length && (tone.id === "trusted" || tone.id === "data")) {
      score += 1;
    }

    if (raw.imageFiles.length && (tone.id === "story" || tone.id === "trusted")) {
      score += 1;
    }

    if (raw.referenceLinks && (tone.id === "tech" || tone.id === "data")) {
      score += 1;
    }

    return { ...tone, score };
  })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}

function resolveTone(raw, toneRecommendations = getToneRecommendations(raw)) {
  if (raw.selectedToneOption === "custom") {
    return {
      id: "custom",
      label: raw.toneCustom || "未填写",
      description: "自定义调性",
    };
  }

  const fallback = toneRecommendations[0];
  const selected =
    toneRecommendations.find((tone) => tone.id === raw.selectedToneOption) || fallback;

  return {
    id: selected?.id || "",
    label: selected?.title || "未选择",
    description: selected?.description || "",
  };
}

function matchesToneIntent(styleTone, selectedTone) {
  if (styleTone === selectedTone) {
    return true;
  }

  if (selectedTone.includes("科技") && styleTone.includes("科技")) {
    return true;
  }

  if (selectedTone.includes("路演") && styleTone.includes("路演")) {
    return true;
  }

  if (selectedTone.includes("叙事") && styleTone.includes("叙事")) {
    return true;
  }

  if (selectedTone.includes("教学") && styleTone.includes("教学")) {
    return true;
  }

  if (selectedTone.includes("数据") && styleTone.includes("数据")) {
    return true;
  }

  if (selectedTone.includes("稳重") && styleTone.includes("稳重")) {
    return true;
  }

  return false;
}

function getStyleRecommendations(raw = getRawFormState(), selectedToneLabel) {
  const signal = `${buildSignalText(raw)} ${selectedToneLabel || ""}`;

  return STYLE_LIBRARY.map((style) => {
    let score = 0;

    if (style.fit.includes(raw.useCase)) {
      score += 3;
    }

    style.tones.forEach((tone) => {
      if (matchesToneIntent(tone, selectedToneLabel || "")) {
        score += 2;
      }
    });

    if (raw.imageFiles.length && (style.id === "trust-profile" || style.id === "editorial-story")) {
      score += 1;
    }

    if (raw.videoFiles.length && style.id === "pitch-impact") {
      score += 1;
    }

    if (raw.docFiles.length && (style.id === "clean-tech" || style.id === "trust-profile")) {
      score += 1;
    }

    if (signal.includes("品牌") && style.id === "editorial-story") {
      score += 1;
    }

    if (signal.includes("数据") && style.id === "clean-tech") {
      score += 1;
    }

    return { ...style, score };
  })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}

function resolveStyle(raw, styleRecommendations) {
  if (raw.selectedStyleOption === "custom") {
    return {
      id: "custom",
      label: raw.styleCustom || "未填写",
      source: "自定义",
      colors: "自定义",
      layout: "自定义",
    };
  }

  const fallback = styleRecommendations[0];
  const selected =
    styleRecommendations.find((style) => style.id === raw.selectedStyleOption) || fallback;

  return {
    id: selected?.id || "",
    label: selected?.title || "未选择",
    source: selected?.source || "",
    colors: selected?.colors || "",
    layout: selected?.layout || "",
  };
}

function renderProgress() {
  progressRow.innerHTML = STEP_TITLES.map((title, index) => {
    const stateClass =
      index < currentStep ? "is-complete" : index === currentStep ? "is-current" : "";

    return `
      <div class="progress-chip ${stateClass}">
        <strong>步骤 ${index + 1}</strong>
        <span>${title}</span>
      </div>
    `;
  }).join("");
}

function renderToneOptions() {
  const raw = getRawFormState();
  const tones = getToneRecommendations(raw);

  if (selectedToneOption !== "custom" && !tones.some((tone) => tone.id === selectedToneOption)) {
    selectedToneOption = tones[0]?.id || null;
  }

  toneOptionsContainer.innerHTML = [
    ...tones.map((tone) => {
      const isSelected = selectedToneOption === tone.id;

      return `
        <button class="choice-card ${isSelected ? "is-selected" : ""}" type="button" data-tone-option="${tone.id}">
          <h4>${tone.title}</h4>
          <p>${tone.description}</p>
        </button>
      `;
    }),
    `
      <button class="choice-card ${selectedToneOption === "custom" ? "is-selected" : ""}" type="button" data-tone-option="custom">
        <h4>自定义输入</h4>
        <p>自己填写你想要的表达调性。</p>
      </button>
    `,
  ].join("");

  toneCustomWrap.hidden = selectedToneOption !== "custom";
}

function renderStyleOptions() {
  const raw = getRawFormState();
  const tone = resolveTone(raw, getToneRecommendations(raw));
  const styles = getStyleRecommendations(raw, tone.label);

  if (selectedStyleOption !== "custom" && !styles.some((style) => style.id === selectedStyleOption)) {
    selectedStyleOption = styles[0]?.id || null;
  }

  styleOptionsContainer.innerHTML = [
    ...styles.map((style) => {
      const isSelected = selectedStyleOption === style.id;

      return `
        <button class="style-card ${isSelected ? "is-selected" : ""}" type="button" data-style-option="${style.id}">
          <div class="style-card-head">
            <h4>${style.title}</h4>
          </div>
          <div class="style-facts">
            <p><strong>方向：</strong>${style.source}</p>
            <p><strong>色彩：</strong>${style.colors}</p>
            <p><strong>版式：</strong>${style.layout}</p>
          </div>
        </button>
      `;
    }),
    `
      <button class="style-card ${selectedStyleOption === "custom" ? "is-selected" : ""}" type="button" data-style-option="custom">
        <div class="style-card-head">
          <h4>自定义输入</h4>
        </div>
        <div class="style-facts">
          <p><strong>说明：</strong>自己填写希望呈现的风格方向。</p>
        </div>
      </button>
    `,
  ].join("");

  styleCustomWrap.hidden = selectedStyleOption !== "custom";
}

function buildMaterialSummary(raw) {
  const summary = [];

  if (raw.materialsText) {
    summary.push("已填写文字素材");
  }

  const linkCount = getReferenceLinkCount(raw.referenceLinks);

  if (linkCount) {
    summary.push(`${linkCount} 个链接`);
  }

  if (raw.imageFiles.length) {
    summary.push(`${raw.imageFiles.length} 个图片/截图文件`);
  }

  if (raw.videoFiles.length) {
    summary.push(`${raw.videoFiles.length} 个视频文件`);
  }

  if (raw.docFiles.length) {
    summary.push(`${raw.docFiles.length} 个文档/PPT 文件`);
  }

  return summary.join(" / ") || "未填写";
}

function renderConfirmList() {
  const normalized = getNormalizedState();

  const rows = [
    ["项目名称", normalized.projectName],
    ["使用场景", normalized.useCase],
    ["目标观众", normalized.audience],
    ["页数预期", normalized.pageCount],
    ["语言", normalized.language],
    ["素材概况", buildMaterialSummary(normalized)],
    ["表达调性", normalized.tone.label],
    ["已选风格", normalized.style.label],
    ["输出格式", normalized.outputs.join(" / ") || "未选择"],
  ];

  confirmList.innerHTML = rows
    .map(
      ([label, value]) => `
        <div>
          <dt>${label}</dt>
          <dd>${value || "未填写"}</dd>
        </div>
      `,
    )
    .join("");
}

function showStep(stepIndex) {
  currentStep = stepIndex;

  wizardSteps.forEach((step, index) => {
    step.hidden = index !== currentStep;
  });

  prevStepButton.hidden = currentStep === 0;
  nextStepButton.hidden = currentStep === STEP_TITLES.length - 1;
  generateResultButton.hidden = currentStep !== STEP_TITLES.length - 1;

  updateAudienceCustomVisibility();

  if (currentStep >= 2) {
    renderToneOptions();
    renderStyleOptions();
  }

  if (currentStep === 3) {
    renderConfirmList();
  }

  renderProgress();
  saveDraft();
}

function renderResult(result) {
  if (!result) {
    resultShell.hidden = true;
    resultSummary.innerHTML = "";
    resultText.textContent = "";
    return;
  }

  resultShell.hidden = false;
  resultSummary.innerHTML = result.summary
    .filter(Boolean)
    .map((item) => `<span class="summary-pill">${item}</span>`)
    .join("");
  resultText.textContent = result.text;
}

function resetResult() {
  latestResult = null;
  renderResult(null);
}

function buildResult() {
  const normalized = getNormalizedState();

  const text = [
    `项目名称：${normalized.projectName}`,
    `使用场景：${normalized.useCase}`,
    `目标观众：${normalized.audience}`,
    `页数预期：${normalized.pageCount}`,
    `语言：${normalized.language}`,
    `表达调性：${normalized.tone.label}`,
    `已选风格：${normalized.style.label}`,
    `风格方向：${normalized.style.source}`,
    `输出格式：${normalized.outputs.join(" / ")}`,
    "",
    "素材清单：",
    `1. 文字素材：${normalized.materialsText || "无"}`,
    `2. 链接：${normalized.referenceLinks || "无"}`,
    `3. 图片 / 截图：${normalized.imageFiles.join("、") || "无"}`,
    `4. 视频 / 录屏：${normalized.videoFiles.join("、") || "无"}`,
    `5. 文档 / PPT：${normalized.docFiles.join("、") || "无"}`,
    `6. 限制条件：${normalized.restrictions || "无"}`,
    "",
    "页面大纲：",
    ...normalized.outline.map((item, index) => `${index + 1}. ${item}`),
    "",
    "下一步：",
    `1. 先按“${normalized.style.label}”制作 1 页代表性样稿。`,
    `2. 样稿确认后，再导出 ${normalized.outputs.join(" / ")}。`,
  ].join("\n");

  return {
    text,
    summary: [
      normalized.useCase,
      normalized.audience,
      normalized.tone.label,
      normalized.style.label,
    ],
  };
}

function focusAndReport(field, message) {
  field.setCustomValidity(message);
  field.reportValidity();
  field.setCustomValidity("");
  field.focus();
  announce(message);
}

function hasMaterialSource(raw) {
  return Boolean(
    raw.materialsText ||
      raw.referenceLinks ||
      raw.imageFiles.length ||
      raw.videoFiles.length ||
      raw.docFiles.length,
  );
}

function validateStep(stepIndex) {
  const raw = getRawFormState();

  if (stepIndex === 0) {
    if (!raw.useCase) {
      focusAndReport(form.useCase, "请选择使用场景。");
      return false;
    }

    if (raw.audienceOption === "其他" && !raw.audienceCustom) {
      focusAndReport(audienceCustomInput, "请填写其他目标观众。");
      return false;
    }
  }

  if (stepIndex === 1) {
    if (!hasMaterialSource(raw)) {
      focusAndReport(form.materialsText, "请至少填写一种素材来源。");
      return false;
    }
  }

  if (stepIndex === 2) {
    renderToneOptions();
    renderStyleOptions();

    if (!selectedToneOption) {
      announce("请选择一个表达调性。");
      return false;
    }

    if (selectedToneOption === "custom" && !raw.toneCustom) {
      focusAndReport(toneCustomInput, "请填写自定义调性。");
      return false;
    }

    if (!selectedStyleOption) {
      announce("请选择一个风格。");
      return false;
    }

    if (selectedStyleOption === "custom" && !raw.styleCustom) {
      focusAndReport(styleCustomInput, "请填写自定义风格。");
      return false;
    }
  }

  if (stepIndex === 3 && raw.outputs.length === 0) {
    window.alert("请至少选择一种输出格式。");
    announce("请至少选择一种输出格式。");
    return false;
  }

  return true;
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return Promise.resolve(copied);
}

function restoreDraft() {
  const saved = loadDraft();

  if (!saved) {
    fillForm({
      audienceOption: "品牌客户",
      pageCount: "1页",
      language: "中文",
      outputs: ["PPTX"],
      imageFiles: [],
      videoFiles: [],
      docFiles: [],
    });
    resetResult();
    showStep(0);
    return;
  }

  fillForm(saved.data || EXAMPLE_DATA);
  latestResult = saved.result || null;
  currentStep = saved.currentStep || 0;
  renderResult(latestResult);
  showStep(currentStep);
}

function resetFileInputs() {
  imageFilesInput.value = "";
  videoFilesInput.value = "";
  docFilesInput.value = "";
}

function initializeEvents() {
  prevStepButton.addEventListener("click", () => {
    showStep(Math.max(0, currentStep - 1));
  });

  nextStepButton.addEventListener("click", () => {
    if (!validateStep(currentStep)) {
      return;
    }

    showStep(Math.min(STEP_TITLES.length - 1, currentStep + 1));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    latestResult = buildResult();
    renderResult(latestResult);
    saveDraft();
    resultShell.scrollIntoView({ behavior: "smooth", block: "start" });
    announce("输出内容已生成。");
  });

  form.addEventListener("change", (event) => {
    const target = event.target;

    if (target.name === "audienceOption") {
      updateAudienceCustomVisibility();
    }

    resetResult();

    if (currentStep >= 2) {
      renderToneOptions();
      renderStyleOptions();
    }

    if (currentStep === 3) {
      renderConfirmList();
    }

    saveDraft();
  });

  toneOptionsContainer.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-tone-option]");

    if (!trigger) {
      return;
    }

    selectedToneOption = trigger.dataset.toneOption;
    renderToneOptions();
    renderStyleOptions();
    if (currentStep === 3) {
      renderConfirmList();
    }
    resetResult();
    saveDraft();
  });

  styleOptionsContainer.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-style-option]");

    if (!trigger) {
      return;
    }

    selectedStyleOption = trigger.dataset.styleOption;
    renderStyleOptions();
    if (currentStep === 3) {
      renderConfirmList();
    }
    resetResult();
    saveDraft();
  });

  form.addEventListener("input", () => {
    resetResult();

    if (currentStep >= 2) {
      renderToneOptions();
      renderStyleOptions();
    }

    if (currentStep === 3) {
      renderConfirmList();
    }

    saveDraft();
  });

  toneCustomInput.addEventListener("focus", () => {
    selectedToneOption = "custom";
    renderToneOptions();
    renderStyleOptions();
    saveDraft();
  });

  toneCustomInput.addEventListener("input", () => {
    selectedToneOption = "custom";
    renderToneOptions();
    renderStyleOptions();
    if (currentStep === 3) {
      renderConfirmList();
    }
    saveDraft();
  });

  styleCustomInput.addEventListener("focus", () => {
    selectedStyleOption = "custom";
    renderStyleOptions();
    saveDraft();
  });

  styleCustomInput.addEventListener("input", () => {
    selectedStyleOption = "custom";
    renderStyleOptions();
    if (currentStep === 3) {
      renderConfirmList();
    }
    saveDraft();
  });

  imageFilesInput.addEventListener("change", () => {
    setFileSnapshot("imageFiles", imageFilesInput.files || []);
    resetResult();
    saveDraft();
  });

  videoFilesInput.addEventListener("change", () => {
    setFileSnapshot("videoFiles", videoFilesInput.files || []);
    resetResult();
    saveDraft();
  });

  docFilesInput.addEventListener("change", () => {
    setFileSnapshot("docFiles", docFilesInput.files || []);
    resetResult();
    saveDraft();
  });

  fillExampleButton.addEventListener("click", () => {
    fillForm(EXAMPLE_DATA);
    resetFileInputs();
    latestResult = null;
    renderResult(null);
    showStep(0);
    announce("已填入示例内容。");
  });

  resetFormButton.addEventListener("click", () => {
    form.reset();
    resetFileInputs();
    fileSnapshots = {
      imageFiles: [],
      videoFiles: [],
      docFiles: [],
    };
    selectedToneOption = null;
    selectedStyleOption = null;
    toneCustomInput.value = "";
    styleCustomInput.value = "";
    fillForm({
      audienceOption: "品牌客户",
      pageCount: "1页",
      language: "中文",
      outputs: ["PPTX"],
      imageFiles: [],
      videoFiles: [],
      docFiles: [],
    });
    clearDraft();
    resetResult();
    showStep(0);
    announce("已清空。");
  });

  copyOutputButton.addEventListener("click", async () => {
    if (!latestResult) {
      return;
    }

    const copied = await copyText(latestResult.text);

    if (copied) {
      announce("输出内容已复制。");
    }
  });

  editOutputButton.addEventListener("click", () => {
    showStep(0);
    document.querySelector(".wizard-shell")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

initializeEvents();
restoreDraft();
