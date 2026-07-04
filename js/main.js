const STORAGE_KEY = "ppt-brief-builder";

const STEP_CONFIG = [
  {
    title: "基础信息",
    hint: "定义使用场景、受众和页数边界。",
  },
  {
    title: "素材与限制",
    hint: "说明哪些素材必须使用，哪些内容不能参考。",
  },
  {
    title: "调性与风格",
    hint: "先锁定视觉方向，再进入样稿。",
  },
  {
    title: "输出设置",
    hint: "确认交付格式，生成执行 brief。",
  },
];

const STAGE_CONFIG = [
  {
    title: "定义项目",
    note: "先确定这套 PPT 的用途、对象和页数边界。",
  },
  {
    title: "整理素材",
    note: "把文字、链接和文件来源说清楚，避免误用内容。",
  },
  {
    title: "对齐风格",
    note: "先收口调性和风格，再进入 1 页代表性样稿。",
  },
  {
    title: "确认交付",
    note: "锁定输出格式与大纲，生成一份可执行 brief。",
  },
];

const DELIVERY_STAGES = [
  {
    label: "Brief 输入",
    note: "确定用途、对象与页数范围。",
  },
  {
    label: "素材归档",
    note: "统一整理文字、链接和文件来源。",
  },
  {
    label: "风格确认",
    note: "对齐调性、版式和视觉节奏。",
  },
  {
    label: "样稿准备",
    note: "优先制作 1 页代表性页面。",
  },
  {
    label: "最终交付",
    note: "扩展全稿并导出最终文件。",
  },
];

const USE_CASE_NOTES = {
  CEO介绍: "适合用人物定位、履历与成绩建立可信度。",
  品牌客户提案: "适合先讲客户问题，再讲策略与合作收益。",
  产品介绍: "适合把定位、功能和价值拆成清晰模块。",
  融资路演: "适合把机会点、增长证据和融资诉求放在前面。",
  项目汇报: "适合围绕目标、进展、数据和下一步计划展开。",
  培训课件: "适合以步骤、知识点和课后行动组织内容。",
};

const STYLE_THEMES = {
  "trust-profile": {
    bg: "linear-gradient(145deg, #173a35, #325d55 72%, #ded4c6 160%)",
    text: "#f7f1e7",
    muted: "rgba(247, 241, 231, 0.8)",
    surface: "rgba(255, 255, 255, 0.12)",
    accent: "#ffd8b0",
  },
  "clean-tech": {
    bg: "linear-gradient(145deg, #121d27, #214155 68%, #d8dde2 150%)",
    text: "#eef4f8",
    muted: "rgba(238, 244, 248, 0.78)",
    surface: "rgba(255, 255, 255, 0.1)",
    accent: "#9fe6ff",
  },
  "editorial-story": {
    bg: "linear-gradient(145deg, #3a2a24, #7f5c46 65%, #efe3d4 145%)",
    text: "#fff5ea",
    muted: "rgba(255, 245, 234, 0.8)",
    surface: "rgba(255, 255, 255, 0.1)",
    accent: "#ffd7b7",
  },
  "pitch-impact": {
    bg: "linear-gradient(145deg, #14151c, #3f2754 52%, #0f5b5a 120%)",
    text: "#f7f4ff",
    muted: "rgba(247, 244, 255, 0.8)",
    surface: "rgba(255, 255, 255, 0.11)",
    accent: "#b9ffea",
  },
  "teaching-clear": {
    bg: "linear-gradient(145deg, #20303a, #4d6d7f 62%, #edf1f4 146%)",
    text: "#f7fbff",
    muted: "rgba(247, 251, 255, 0.82)",
    surface: "rgba(255, 255, 255, 0.12)",
    accent: "#ffe4a8",
  },
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
const resultOverview = document.querySelector("#result-overview");
const resultChecklist = document.querySelector("#result-checklist");
const resultWorkflow = document.querySelector("#result-workflow");
const resultOutline = document.querySelector("#result-outline");
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
const previewStage = document.querySelector("#preview-stage");
const previewStageText = document.querySelector("#preview-stage-text");
const previewUsecase = document.querySelector("#preview-usecase");
const previewOutputs = document.querySelector("#preview-outputs");
const previewProject = document.querySelector("#preview-project");
const previewAudience = document.querySelector("#preview-audience");
const previewToneChip = document.querySelector("#preview-tone-chip");
const previewStyleChip = document.querySelector("#preview-style-chip");
const previewStyleMeta = document.querySelector("#preview-style-meta");
const previewToneStrong = document.querySelector("#preview-tone-strong");
const previewToneDesc = document.querySelector("#preview-tone-desc");
const previewMaterialCount = document.querySelector("#preview-material-count");
const previewRestrictions = document.querySelector("#preview-restrictions");
const previewOutline = document.querySelector("#preview-outline");
const previewStageStrip = document.querySelector("#preview-stage-strip");
const previewCover = document.querySelector("#preview-cover");
const previewSlideTag = document.querySelector("#preview-slide-tag");
const previewPageCount = document.querySelector("#preview-page-count");
const previewSlideTitle = document.querySelector("#preview-slide-title");
const previewSlideSubtitle = document.querySelector("#preview-slide-subtitle");
const previewSlidePoints = document.querySelector("#preview-slide-points");
const previewSlideStats = document.querySelector("#preview-slide-stats");

let currentStep = 0;
let latestResult = null;
let selectedToneOption = null;
let selectedStyleOption = null;
let fileSnapshots = {
  imageFiles: [],
  videoFiles: [],
  docFiles: [],
};

function getDefaultState() {
  return {
    projectName: "",
    useCase: "",
    audienceOption: "品牌客户",
    audienceCustom: "",
    pageCount: "1页",
    language: "中文",
    materialsText: "",
    referenceLinks: "",
    restrictions: "",
    outputs: ["PPTX"],
    imageFiles: [],
    videoFiles: [],
    docFiles: [],
    selectedToneOption: null,
    toneCustom: "",
    selectedStyleOption: null,
    styleCustom: "",
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

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

function getReferenceLinkCount(referenceLinks) {
  return referenceLinks
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean).length;
}

function resolveAudience(raw) {
  const selected = raw.audienceOption || "品牌客户";

  if (selected === "其他") {
    return raw.audienceCustom.trim() || "未填写";
  }

  return selected;
}

function getRawFormState() {
  const formData = new FormData(form);

  return {
    projectName: formData.get("projectName")?.trim() || "",
    useCase: formData.get("useCase")?.trim() || "",
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
    id: selected?.id || "trusted",
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
    id: selected?.id || "trust-profile",
    label: selected?.title || "未选择",
    source: selected?.source || "",
    colors: selected?.colors || "",
    layout: selected?.layout || "",
  };
}

function getNormalizedState(raw = getRawFormState()) {
  const projectName = raw.projectName || (raw.useCase ? `${raw.useCase}项目` : "未命名项目");
  const audience = resolveAudience(raw);
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
    useCaseNote: raw.useCase
      ? USE_CASE_NOTES[raw.useCase]
      : "请先选择使用场景，系统会据此推荐更贴近任务的结构和风格。",
  };
}

function fillForm(data) {
  const merged = {
    ...getDefaultState(),
    ...data,
  };

  form.projectName.value = merged.projectName;
  form.useCase.value = merged.useCase;
  form.pageCount.value = merged.pageCount;
  form.language.value = merged.language;
  form.materialsText.value = merged.materialsText;
  form.referenceLinks.value = merged.referenceLinks;
  form.restrictions.value = merged.restrictions;
  toneCustomInput.value = merged.toneCustom;
  styleCustomInput.value = merged.styleCustom;

  form.querySelectorAll('input[name="audienceOption"]').forEach((input) => {
    input.checked = input.value === merged.audienceOption;
  });

  audienceCustomInput.value = merged.audienceCustom;

  const outputSet = new Set(merged.outputs);
  form.querySelectorAll('input[name="output"]').forEach((input) => {
    input.checked = outputSet.has(input.value);
  });

  fileSnapshots = {
    imageFiles: [...(merged.imageFiles || [])],
    videoFiles: [...(merged.videoFiles || [])],
    docFiles: [...(merged.docFiles || [])],
  };

  selectedToneOption = merged.selectedToneOption || null;
  selectedStyleOption = merged.selectedStyleOption || null;
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

function getSourceLabels(raw) {
  const labels = [];
  const linkCount = getReferenceLinkCount(raw.referenceLinks);

  if (raw.materialsText) {
    labels.push("文字素材");
  }

  if (linkCount) {
    labels.push(`${linkCount} 个链接`);
  }

  if (raw.imageFiles.length) {
    labels.push(`${raw.imageFiles.length} 个图片/截图`);
  }

  if (raw.videoFiles.length) {
    labels.push(`${raw.videoFiles.length} 个视频`);
  }

  if (raw.docFiles.length) {
    labels.push(`${raw.docFiles.length} 个文档/PPT`);
  }

  return labels;
}

function buildMaterialSummary(raw) {
  const labels = getSourceLabels(raw);
  return labels.join(" · ") || "暂未提供素材";
}

function buildRestrictionsText(raw) {
  return raw.restrictions || "暂无额外限制，默认允许重组内容但不虚构信息。";
}

function renderProgress() {
  progressRow.innerHTML = STEP_CONFIG.map((step, index) => {
    const stateClass =
      index < currentStep ? "is-complete" : index === currentStep ? "is-current" : "";

    return `
      <div class="progress-chip ${stateClass}">
        <strong>步骤 ${index + 1}</strong>
        <span>${escapeHtml(step.title)}</span>
        <small>${escapeHtml(step.hint)}</small>
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
    ...tones.map((tone, index) => {
      const isSelected = selectedToneOption === tone.id;

      return `
        <button class="choice-card ${isSelected ? "is-selected" : ""}" type="button" data-tone-option="${tone.id}">
          <span class="choice-rank">推荐 ${index + 1}</span>
          <h4>${escapeHtml(tone.title)}</h4>
          <p>${escapeHtml(tone.description)}</p>
        </button>
      `;
    }),
    `
      <button class="choice-card ${selectedToneOption === "custom" ? "is-selected" : ""}" type="button" data-tone-option="custom">
        <span class="choice-rank">Custom</span>
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
    ...styles.map((style, index) => {
      const isSelected = selectedStyleOption === style.id;

      return `
        <button class="style-card ${isSelected ? "is-selected" : ""}" type="button" data-style-option="${style.id}">
          <span class="choice-rank">风格 ${index + 1}</span>
          <div class="style-card-head">
            <h4>${escapeHtml(style.title)}</h4>
          </div>
          <div class="style-facts">
            <p><strong>方向：</strong>${escapeHtml(style.source)}</p>
            <p><strong>色彩：</strong>${escapeHtml(style.colors)}</p>
            <p><strong>版式：</strong>${escapeHtml(style.layout)}</p>
          </div>
        </button>
      `;
    }),
    `
      <button class="style-card ${selectedStyleOption === "custom" ? "is-selected" : ""}" type="button" data-style-option="custom">
        <span class="choice-rank">Custom</span>
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

function renderConfirmList() {
  const normalized = getNormalizedState();

  const rows = [
    ["项目名称", normalized.projectName],
    ["使用场景", normalized.useCase || "未填写"],
    ["目标观众", normalized.audience],
    ["页数预期", normalized.pageCount],
    ["语言", normalized.language],
    ["素材概况", buildMaterialSummary(normalized)],
    ["表达调性", normalized.tone.label],
    ["已选风格", normalized.style.label],
    [
      "风格线索",
      normalized.style.colors
        ? `${normalized.style.colors} / ${normalized.style.layout}`
        : normalized.useCaseNote,
    ],
    ["输出格式", normalized.outputs.join(" / ") || "未选择"],
  ];

  confirmList.innerHTML = rows
    .map(
      ([label, value]) => `
        <div>
          <dt>${escapeHtml(label)}</dt>
          <dd>${escapeHtml(value)}</dd>
        </div>
      `,
    )
    .join("");
}

function getPreviewTheme(styleId, toneId) {
  if (STYLE_THEMES[styleId]) {
    return STYLE_THEMES[styleId];
  }

  const toneFallback = {
    trusted: STYLE_THEMES["trust-profile"],
    tech: STYLE_THEMES["clean-tech"],
    impact: STYLE_THEMES["pitch-impact"],
    story: STYLE_THEMES["editorial-story"],
    teaching: STYLE_THEMES["teaching-clear"],
    data: STYLE_THEMES["clean-tech"],
    custom: STYLE_THEMES["trust-profile"],
  };

  return toneFallback[toneId] || STYLE_THEMES["trust-profile"];
}

function applyPreviewTheme(theme) {
  previewCover.style.setProperty("--preview-bg", theme.bg);
  previewCover.style.setProperty("--preview-text", theme.text);
  previewCover.style.setProperty("--preview-muted", theme.muted);
  previewCover.style.setProperty("--preview-surface", theme.surface);
  previewCover.style.setProperty("--preview-accent", theme.accent);
}

function describeOutlineItem(title, normalized) {
  if (title.includes("封面") || title.includes("标题")) {
    return `用一句话点明主题，让 ${normalized.audience} 在第一眼就知道这套内容的用途。`;
  }

  if (title.includes("背景") || title.includes("问题") || title.includes("痛点")) {
    return "先把背景和问题说清楚，再承接后面的方案与证据。";
  }

  if (title.includes("定位") || title.includes("角色")) {
    return "突出最核心的定位信息，避免把简介写成流水账。";
  }

  if (title.includes("履历") || title.includes("经历") || title.includes("团队")) {
    return "用可信背书和关键节点增强说服力，控制信息密度。";
  }

  if (title.includes("功能") || title.includes("方案") || title.includes("步骤")) {
    return "建议拆成 2 到 4 个结构化模块，每个模块只讲一个重点。";
  }

  if (
    title.includes("成绩") ||
    title.includes("数据") ||
    title.includes("增长") ||
    title.includes("证明") ||
    title.includes("收益")
  ) {
    return "优先放最能打的证据，数字、对比和结论要同屏出现。";
  }

  if (
    title.includes("行动") ||
    title.includes("联系") ||
    title.includes("融资") ||
    title.includes("计划") ||
    title.includes("结束")
  ) {
    return "明确下一步动作，让这页真正承接决策、转化或沟通动作。";
  }

  return `围绕“${title}”输出 1 个结论、1 组证据和 1 个视觉重点。`;
}

function buildStageStripMarkup(hasResult) {
  const currentStageIndex = hasResult ? DELIVERY_STAGES.length - 1 : currentStep;

  return DELIVERY_STAGES.map((stage, index) => {
    let stateClass = "";

    if (index < currentStageIndex) {
      stateClass = "is-complete";
    }

    if (index === currentStageIndex) {
      stateClass = `${stateClass} is-current`.trim();
    }

    return `
      <div class="stage-item ${stateClass}">
        <span class="outline-index">${String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>${escapeHtml(stage.label)}</strong>
          <p>${escapeHtml(stage.note)}</p>
        </div>
      </div>
    `;
  }).join("");
}

function renderLivePreview() {
  const normalized = getNormalizedState();
  const materialLabels = getSourceLabels(normalized);
  const theme = getPreviewTheme(normalized.style.id, normalized.tone.id);
  const stageMeta = latestResult
    ? {
        title: "交付 brief 已生成",
        note: "这份 brief 已可以直接进入 1 页样稿和后续扩稿。",
      }
    : STAGE_CONFIG[currentStep];

  applyPreviewTheme(theme);

  previewStage.textContent = stageMeta.title;
  previewStageText.textContent = stageMeta.note;
  previewUsecase.textContent = normalized.useCase
    ? `${normalized.useCase} · ${normalized.language}`
    : `待选场景 · ${normalized.language}`;
  previewOutputs.textContent = normalized.outputs.length
    ? normalized.outputs.join(" / ")
    : "输出待定";
  previewProject.textContent = normalized.projectName;
  previewAudience.textContent = `面向 ${normalized.audience} · ${normalized.pageCount}`;
  previewToneChip.textContent = normalized.tone.label;
  previewStyleChip.textContent = normalized.style.label;
  previewStyleMeta.textContent = normalized.style.colors
    ? `${normalized.style.colors} / ${normalized.style.layout}`
    : normalized.useCaseNote;
  previewToneStrong.textContent = normalized.tone.label;
  previewToneDesc.textContent = normalized.tone.description || normalized.useCaseNote;
  previewMaterialCount.textContent = materialLabels.length
    ? `${materialLabels.length} 类素材`
    : "待补素材";
  previewRestrictions.textContent = normalized.restrictions
    ? normalized.restrictions
    : materialLabels.join(" · ") || "至少填写 1 类素材来源。";
  previewSlideTag.textContent = normalized.style.source || "样稿预览";
  previewPageCount.textContent = normalized.pageCount === "1页" ? "1 页样稿" : normalized.pageCount;
  previewSlideTitle.textContent = normalized.projectName;
  previewSlideSubtitle.textContent = `${normalized.useCase || "待选场景"} · ${normalized.language} · 面向${normalized.audience}`;

  previewSlidePoints.innerHTML = normalized.outline
    .slice(0, 3)
    .map((item, index) => {
      return `
        <div class="mock-point">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <p>${escapeHtml(item)}</p>
        </div>
      `;
    })
    .join("");

  const statItems = [
    {
      label: "输出",
      value: normalized.outputs.length ? normalized.outputs.join(" / ") : "待定",
    },
    {
      label: "受众",
      value: normalized.audience,
    },
    {
      label: "素材",
      value: materialLabels.length ? `${materialLabels.length} 类输入` : "待补",
    },
  ];

  previewSlideStats.innerHTML = statItems
    .map((item) => {
      return `
        <div class="mock-stat">
          <strong>${escapeHtml(item.label)}</strong>
          <p>${escapeHtml(item.value)}</p>
        </div>
      `;
    })
    .join("");

  const previewOutlineItems = normalized.outline.slice(0, 5);
  const extraOutlineCount = Math.max(0, normalized.outline.length - previewOutlineItems.length);

  previewOutline.innerHTML = [
    ...previewOutlineItems.map((item, index) => {
      return `
        <div class="outline-item">
          <span class="outline-index">${String(index + 1).padStart(2, "0")}</span>
          <div>
            <strong>${escapeHtml(item)}</strong>
            <p>${escapeHtml(describeOutlineItem(item, normalized))}</p>
          </div>
        </div>
      `;
    }),
    extraOutlineCount
      ? `
        <div class="outline-item">
          <span class="outline-index">+${extraOutlineCount}</span>
          <div>
            <strong>其余页面</strong>
            <p>完整输出中还会补充 ${extraOutlineCount} 个页面节点。</p>
          </div>
        </div>
      `
      : "",
  ].join("");

  previewStageStrip.innerHTML = buildStageStripMarkup(Boolean(latestResult));
}

function renderAllDerivedViews() {
  renderProgress();
  renderToneOptions();
  renderStyleOptions();
  renderConfirmList();
  renderLivePreview();
}

function showStep(stepIndex) {
  currentStep = stepIndex;

  wizardSteps.forEach((step, index) => {
    step.hidden = index !== currentStep;
  });

  prevStepButton.hidden = currentStep === 0;
  nextStepButton.hidden = currentStep === STEP_CONFIG.length - 1;
  generateResultButton.hidden = currentStep !== STEP_CONFIG.length - 1;

  updateAudienceCustomVisibility();
  renderAllDerivedViews();
  saveDraft();
}

function renderResult(result) {
  if (!result) {
    resultShell.hidden = true;
    resultSummary.innerHTML = "";
    resultOverview.textContent = "";
    resultChecklist.innerHTML = "";
    resultWorkflow.innerHTML = "";
    resultOutline.innerHTML = "";
    resultText.textContent = "";
    return;
  }

  resultShell.hidden = false;
  resultSummary.innerHTML = result.summary
    .filter(Boolean)
    .map((item) => `<span class="summary-pill">${escapeHtml(item)}</span>`)
    .join("");
  resultOverview.textContent = result.overview;
  resultChecklist.innerHTML = result.checklist
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  resultWorkflow.innerHTML = result.workflow
    .map((item) => `<li><strong>${escapeHtml(item.title)}</strong> ${escapeHtml(item.note)}</li>`)
    .join("");
  resultOutline.innerHTML = result.outline
    .map((item, index) => {
      return `
        <article class="result-outline-item">
          <span class="outline-index">${String(index + 1).padStart(2, "0")}</span>
          <div>
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.note)}</p>
          </div>
        </article>
      `;
    })
    .join("");
  resultText.textContent = result.text;
}

function resetResult() {
  latestResult = null;
  renderResult(null);
  renderLivePreview();
}

function buildResult() {
  const normalized = getNormalizedState();
  const materialSummary = buildMaterialSummary(normalized);
  const outputText = normalized.outputs.join(" / ");
  const outline = normalized.outline.map((title) => ({
    title,
    note: describeOutlineItem(title, normalized),
  }));
  const workflow = [
    {
      title: "锁定素材边界",
      note:
        normalized.restrictions ||
        `优先使用 ${materialSummary}，未明确允许的旧版式、Logo 和样张默认不复用。`,
    },
    {
      title: "先做 1 页代表性样稿",
      note: `以“${normalized.style.label}”为主方向，先验证标题层级、图文比例和信息密度。`,
    },
    {
      title: "结构确认后扩展全稿",
      note: `按照 ${normalized.pageCount} 预期，把大纲中的核心页面逐页展开，保持统一视觉系统。`,
    },
    {
      title: `导出 ${outputText}`,
      note: `完成校对后输出 ${outputText}，必要时同步整理讲稿和最终 PDF。`,
    },
  ];
  const checklist = [
    `目标观众：${normalized.audience}`,
    `必用输入：${materialSummary}`,
    `表达调性：${normalized.tone.label}`,
    `视觉方向：${normalized.style.label}${normalized.style.colors ? `，建议色彩 ${normalized.style.colors}` : ""}`,
    `使用限制：${buildRestrictionsText(normalized)}`,
  ];
  const overview = `这是一份面向 ${normalized.audience} 的 ${normalized.useCase || "PPT"} brief，建议先以“${normalized.style.label}”制作 1 页代表性样稿，确认信息密度和视觉方向后，再扩展到 ${normalized.pageCount} 版本并导出 ${outputText}。`;

  const text = [
    "项目概览：",
    `- 项目名称：${normalized.projectName}`,
    `- 使用场景：${normalized.useCase || "未填写"}`,
    `- 目标观众：${normalized.audience}`,
    `- 页数预期：${normalized.pageCount}`,
    `- 语言：${normalized.language}`,
    "",
    "素材与限制：",
    `- 可用素材：${materialSummary}`,
    `- 文字素材：${normalized.materialsText || "无"}`,
    `- 参考链接：${normalized.referenceLinks || "无"}`,
    `- 图片 / 截图：${normalized.imageFiles.join("、") || "无"}`,
    `- 视频 / 录屏：${normalized.videoFiles.join("、") || "无"}`,
    `- 文档 / PPT：${normalized.docFiles.join("、") || "无"}`,
    `- 使用限制：${buildRestrictionsText(normalized)}`,
    "",
    "风格建议：",
    `- 表达调性：${normalized.tone.label}`,
    `- 已选风格：${normalized.style.label}`,
    `- 风格来源：${normalized.style.source || "待确认"}`,
    `- 色彩方向：${normalized.style.colors || "待确认"}`,
    `- 版式方向：${normalized.style.layout || "待确认"}`,
    "",
    "页面大纲建议：",
    ...outline.map((item, index) => `${index + 1}. ${item.title}：${item.note}`),
    "",
    "执行路径：",
    ...workflow.map((item, index) => `${index + 1}. ${item.title}：${item.note}`),
    "",
    "交付要求：",
    `- 输出格式：${outputText}`,
    "- 建议流程：先做 1 页样稿，确认通过后再制作完整 PPT。",
  ].join("\n");

  return {
    text,
    overview,
    checklist,
    workflow,
    outline,
    summary: [
      normalized.useCase || "未选场景",
      normalized.pageCount,
      normalized.tone.label,
      normalized.style.label,
      outputText,
    ],
  };
}

function focusAndReport(field, message) {
  if (field?.setCustomValidity) {
    field.setCustomValidity(message);
    field.reportValidity?.();
    field.setCustomValidity("");
  }

  field?.focus?.();
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

  if (stepIndex === 1 && !hasMaterialSource(raw)) {
    focusAndReport(form.materialsText, "请至少填写一种素材来源。");
    return false;
  }

  if (stepIndex === 2) {
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
    focusAndReport(
      form.querySelector('input[name="output"]'),
      "请至少选择一种输出格式。",
    );
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
    fillForm(getDefaultState());
    resetResult();
    showStep(0);
    return;
  }

  fillForm(saved.data || getDefaultState());
  latestResult = saved.result || null;
  renderResult(latestResult);
  currentStep = saved.currentStep ?? 0;
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

    showStep(Math.min(STEP_CONFIG.length - 1, currentStep + 1));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    latestResult = buildResult();
    renderResult(latestResult);
    renderLivePreview();
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
    renderAllDerivedViews();
    saveDraft();
  });

  form.addEventListener("input", () => {
    resetResult();
    renderAllDerivedViews();
    saveDraft();
  });

  toneOptionsContainer.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-tone-option]");

    if (!trigger) {
      return;
    }

    selectedToneOption = trigger.dataset.toneOption;
    resetResult();
    renderAllDerivedViews();
    saveDraft();
  });

  styleOptionsContainer.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-style-option]");

    if (!trigger) {
      return;
    }

    selectedStyleOption = trigger.dataset.styleOption;
    resetResult();
    renderAllDerivedViews();
    saveDraft();
  });

  toneCustomInput.addEventListener("focus", () => {
    selectedToneOption = "custom";
    renderAllDerivedViews();
    saveDraft();
  });

  toneCustomInput.addEventListener("input", () => {
    selectedToneOption = "custom";
    renderAllDerivedViews();
    saveDraft();
  });

  styleCustomInput.addEventListener("focus", () => {
    selectedStyleOption = "custom";
    renderAllDerivedViews();
    saveDraft();
  });

  styleCustomInput.addEventListener("input", () => {
    selectedStyleOption = "custom";
    renderAllDerivedViews();
    saveDraft();
  });

  imageFilesInput.addEventListener("change", () => {
    setFileSnapshot("imageFiles", imageFilesInput.files || []);
    resetResult();
    renderAllDerivedViews();
    saveDraft();
  });

  videoFilesInput.addEventListener("change", () => {
    setFileSnapshot("videoFiles", videoFilesInput.files || []);
    resetResult();
    renderAllDerivedViews();
    saveDraft();
  });

  docFilesInput.addEventListener("change", () => {
    setFileSnapshot("docFiles", docFilesInput.files || []);
    resetResult();
    renderAllDerivedViews();
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
    fillForm(getDefaultState());
    clearDraft();
    latestResult = null;
    renderResult(null);
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
      return;
    }

    announce("复制失败，请手动复制。");
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
