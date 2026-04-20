const ALL_CATEGORY = "__all";

const translations = {
  zh: {
    htmlLang: "zh-Hant",
    pageTitle: "本機提示詞選擇器",
    appTitle: "本機提示詞選擇器",
    appSubtitle: "搜尋、篩選、預覽，再把你的內容合成完整提示詞。",
    languageToggle: "English",
    languageNote: "中文版會顯示中文提示詞庫。",
    searchLabel: "搜尋提示詞",
    searchPlaceholder: "例如：程式碼、改寫、總結",
    categoryLabel: "分類",
    allCategory: "全部",
    promptListTitle: "提示詞",
    countSuffix: "筆",
    selectedEyebrow: "目前選擇",
    selectedTitleFallback: "請選擇一個提示詞",
    selectedDescriptionFallback: "左側選擇後，這裡會顯示提示詞內容。",
    templateLabel: "提示詞模板",
    userInputLabel: "你的內容",
    userInputPlaceholder: "把要交給 AI 處理的內容貼在這裡",
    buildButton: "產生最終提示詞",
    copyButton: "複製",
    finalPromptLabel: "最終提示詞",
    finalPromptPlaceholder: "產生後會出現在這裡",
    emptyList: "找不到符合條件的提示詞。",
    choosePrompt: "請先選擇一個提示詞。",
    inputFallback: "請在這裡填入你的內容。",
    generated: "已產生最終提示詞。",
    copied: "已複製到剪貼簿。",
    fallbackCopied: "已嘗試使用備用方式複製。",
    copyFirst: "請先產生最終提示詞再複製。",
    promptLabels: {
      role: "【角色】",
      task: "【任務】",
      input: "【輸入內容】",
      context: "【背景／適用情境】",
      requirements: "【執行要求】",
      outputFormat: "【輸出格式】",
      completion: "【完成標準】",
      insufficient: "【資訊不足時的處理】",
      defaultInputLabel: "內容",
      inputSeparator: "：",
      defaultContext: "無特定背景；請依輸入內容處理。",
      fallbackInsufficient: [
        "若資訊不足，請明確標示缺少哪些資料。",
        "不可把推測當成已確認事實。",
        "如需做假設，請清楚標示為假設。",
      ],
    },
  },
  en: {
    htmlLang: "en",
    pageTitle: "Local Prompt Picker",
    appTitle: "Local Prompt Picker",
    appSubtitle: "Search, filter, preview, and combine your input into a complete prompt.",
    languageToggle: "中文",
    languageNote: "English mode uses the English prompt library.",
    searchLabel: "Search Prompts",
    searchPlaceholder: "For example: code, feature, static page",
    categoryLabel: "Category",
    allCategory: "All",
    promptListTitle: "Prompts",
    countSuffix: "items",
    selectedEyebrow: "Selected",
    selectedTitleFallback: "Choose a prompt",
    selectedDescriptionFallback: "Select a prompt on the left to preview it here.",
    templateLabel: "Prompt Template",
    userInputLabel: "Your Input",
    userInputPlaceholder: "Paste the content you want the AI to process here",
    buildButton: "Build Final Prompt",
    copyButton: "Copy",
    finalPromptLabel: "Final Prompt",
    finalPromptPlaceholder: "The generated prompt will appear here",
    emptyList: "No matching prompts found.",
    choosePrompt: "Please choose a prompt first.",
    inputFallback: "Fill in your content here.",
    generated: "Final prompt generated.",
    copied: "Copied to clipboard.",
    fallbackCopied: "Tried copying with the fallback method.",
    copyFirst: "Generate the final prompt before copying.",
    switchedNotice: "English prompt library loaded.",
    promptLabels: {
      role: "[Role]",
      task: "[Task]",
      input: "[Input]",
      context: "[Context / Use Case]",
      requirements: "[Requirements]",
      outputFormat: "[Output Format]",
      completion: "[Completion Criteria]",
      insufficient: "[When Information Is Insufficient]",
      defaultInputLabel: "Content",
      inputSeparator: ":",
      defaultContext: "No specific context; process the input as provided.",
      fallbackInsufficient: [
        "If information is insufficient, clearly state what is missing.",
        "Do not present assumptions as confirmed facts.",
        "If assumptions are needed, label them clearly.",
      ],
    },
  },
};

function standardPrompt(
  {
    role,
    task,
    inputLabel,
    context,
    requirements,
    outputFormat,
    completion,
    insufficient,
  },
  language,
) {
  const labels = translations[language].promptLabels;
  const toBullets = (items) => items.map((item) => `- ${item}`).join("\n");
  const safeRequirements = requirements?.length ? requirements : [];
  const safeCompletion = completion?.length ? completion : [];
  const safeInsufficient = insufficient?.length ? insufficient : labels.fallbackInsufficient;

  return `${labels.role}
${role}

${labels.task}
${task}

${labels.input}
${inputLabel || labels.defaultInputLabel}${labels.inputSeparator}
{{input}}

${labels.context}
${context || labels.defaultContext}

${labels.requirements}
${toBullets(safeRequirements)}

${labels.outputFormat}
${outputFormat}

${labels.completion}
${toBullets(safeCompletion)}

${labels.insufficient}
${toBullets(safeInsufficient)}`;
}

const promptLibraries = {
  zh: promptDefinitions,
  en: promptDefinitionsEn,
};

function buildPrompts(language) {
  return promptLibraries[language].map(({ prompt, ...metadata }) => ({
    ...metadata,
    prompt,
  }));
}

const elements = {
  appTitle: document.querySelector("#appTitle"),
  appSubtitle: document.querySelector("#appSubtitle"),
  languageToggle: document.querySelector("#languageToggle"),
  languageNote: document.querySelector("#languageNote"),
  searchLabel: document.querySelector("#searchLabel"),
  searchInput: document.querySelector("#searchInput"),
  categoryLabel: document.querySelector("#categoryLabel"),
  categorySelect: document.querySelector("#categorySelect"),
  promptListTitle: document.querySelector("#promptListTitle"),
  promptList: document.querySelector("#promptList"),
  resultCount: document.querySelector("#resultCount"),
  selectedEyebrow: document.querySelector("#selectedEyebrow"),
  selectedTitle: document.querySelector("#selectedTitle"),
  selectedDescription: document.querySelector("#selectedDescription"),
  templateLabel: document.querySelector("#templateLabel"),
  templatePreview: document.querySelector("#templatePreview"),
  userInputLabel: document.querySelector("#userInputLabel"),
  userInput: document.querySelector("#userInput"),
  finalPromptLabel: document.querySelector("#finalPromptLabel"),
  finalPrompt: document.querySelector("#finalPrompt"),
  buildButton: document.querySelector("#buildButton"),
  copyButton: document.querySelector("#copyButton"),
  statusMessage: document.querySelector("#statusMessage"),
};

const state = {
  language: "zh",
  selectedPrompt: null,
};

function getCurrentText() {
  return translations[state.language];
}

function getPromptTemplate(prompt) {
  return standardPrompt(prompt.prompt, state.language);
}

function getCurrentPrompts() {
  return buildPrompts(state.language);
}

function setupCategories() {
  const currentCategory = elements.categorySelect.value || ALL_CATEGORY;
  const categories = [...new Set(getCurrentPrompts().map((prompt) => prompt.category))];
  const categoryExists = currentCategory === ALL_CATEGORY || categories.includes(currentCategory);
  const selectedCategory = categoryExists ? currentCategory : ALL_CATEGORY;

  elements.categorySelect.innerHTML = [
    `<option value="${ALL_CATEGORY}">${getCurrentText().allCategory}</option>`,
    ...categories.map((category) => `<option value="${category}">${category}</option>`),
  ].join("");
  elements.categorySelect.value = selectedCategory;
}

function getFilteredPrompts() {
  const keyword = elements.searchInput.value.trim().toLowerCase();
  const category = elements.categorySelect.value;

  return getCurrentPrompts().filter((prompt) => {
    const matchesCategory = category === ALL_CATEGORY || prompt.category === category;
    const searchText = [
      prompt.title,
      prompt.category,
      prompt.description,
      prompt.tags.join(" "),
      getPromptTemplate(prompt),
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && searchText.includes(keyword);
  });
}

function renderPromptList() {
  const filteredPrompts = getFilteredPrompts();
  const text = getCurrentText();
  elements.resultCount.textContent = `${filteredPrompts.length} ${text.countSuffix}`;

  if (filteredPrompts.length === 0) {
    elements.promptList.innerHTML = `<p class="empty">${text.emptyList}</p>`;
    return;
  }

  elements.promptList.innerHTML = filteredPrompts
    .map(
      (prompt) => `
        <button class="prompt-item ${prompt.id === state.selectedPrompt?.id ? "active" : ""}" type="button" data-id="${prompt.id}">
          <strong>${prompt.title}</strong>
          <small>${prompt.description}</small>
          <span class="tag-row">
            ${prompt.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </span>
        </button>
      `,
    )
    .join("");
}

function updateSelectedPromptDisplay() {
  const text = getCurrentText();

  if (!state.selectedPrompt) {
    elements.selectedTitle.textContent = text.selectedTitleFallback;
    elements.selectedDescription.textContent = text.selectedDescriptionFallback;
    elements.templatePreview.value = "";
    return;
  }

  elements.selectedTitle.textContent = state.selectedPrompt.title;
  elements.selectedDescription.textContent = state.selectedPrompt.description;
  elements.templatePreview.value = getPromptTemplate(state.selectedPrompt);
}

function selectPrompt(promptId) {
  const nextPrompt = getCurrentPrompts().find((prompt) => prompt.id === promptId);

  if (!nextPrompt) {
    return;
  }

  state.selectedPrompt = nextPrompt;
  elements.statusMessage.textContent = "";
  updateSelectedPromptDisplay();
  renderPromptList();
}

function ensureSelectedPromptIsVisible() {
  const currentPrompts = getCurrentPrompts();
  const selectedMatch = currentPrompts.find((prompt) => prompt.id === state.selectedPrompt?.id);

  state.selectedPrompt = selectedMatch || currentPrompts[0] || null;
}

function applyLanguageText() {
  const text = getCurrentText();

  document.documentElement.lang = text.htmlLang;
  document.title = text.pageTitle;
  elements.appTitle.textContent = text.appTitle;
  elements.appSubtitle.textContent = text.appSubtitle;
  elements.languageToggle.textContent = text.languageToggle;
  elements.languageNote.textContent = text.languageNote;
  elements.searchLabel.textContent = text.searchLabel;
  elements.searchInput.placeholder = text.searchPlaceholder;
  elements.categoryLabel.textContent = text.categoryLabel;
  elements.promptListTitle.textContent = text.promptListTitle;
  elements.selectedEyebrow.textContent = text.selectedEyebrow;
  elements.templateLabel.textContent = text.templateLabel;
  elements.userInputLabel.textContent = text.userInputLabel;
  elements.userInput.placeholder = text.userInputPlaceholder;
  elements.finalPromptLabel.textContent = text.finalPromptLabel;
  elements.finalPrompt.placeholder = text.finalPromptPlaceholder;
  elements.buildButton.textContent = text.buildButton;
  elements.copyButton.textContent = text.copyButton;
}

function switchLanguage() {
  state.language = state.language === "zh" ? "en" : "zh";
  const previousSelectedId = state.selectedPrompt?.id;
  state.selectedPrompt = previousSelectedId ? { id: previousSelectedId } : null;
  applyLanguageText();
  setupCategories();
  ensureSelectedPromptIsVisible();
  updateSelectedPromptDisplay();
  renderPromptList();
  elements.statusMessage.textContent = state.language === "en" ? translations.en.switchedNotice : "";
}

function buildFinalPrompt() {
  const text = getCurrentText();

  if (!state.selectedPrompt) {
    elements.statusMessage.textContent = text.choosePrompt;
    return;
  }

  const input = elements.userInput.value.trim();
  const finalText = getPromptTemplate(state.selectedPrompt).replace("{{input}}", input || text.inputFallback);

  elements.finalPrompt.value = finalText;
  elements.statusMessage.textContent = text.generated;
}

async function copyFinalPrompt() {
  const text = getCurrentText();
  const finalPromptText = elements.finalPrompt.value.trim();

  if (!finalPromptText) {
    elements.statusMessage.textContent = text.copyFirst;
    return;
  }

  try {
    await navigator.clipboard.writeText(finalPromptText);
    elements.statusMessage.textContent = text.copied;
  } catch {
    elements.finalPrompt.select();
    document.execCommand("copy");
    elements.statusMessage.textContent = text.fallbackCopied;
  }
}

elements.searchInput.addEventListener("input", renderPromptList);
elements.categorySelect.addEventListener("change", renderPromptList);
elements.languageToggle.addEventListener("click", switchLanguage);
elements.buildButton.addEventListener("click", buildFinalPrompt);
elements.copyButton.addEventListener("click", copyFinalPrompt);
elements.promptList.addEventListener("click", (event) => {
  const item = event.target.closest(".prompt-item");

  if (item) {
    selectPrompt(item.dataset.id);
  }
});

applyLanguageText();
setupCategories();
ensureSelectedPromptIsVisible();
updateSelectedPromptDisplay();
renderPromptList();
