function standardPrompt({
  role,
  task,
  inputLabel = "內容",
  context = "無特定背景；請依輸入內容處理。",
  requirements,
  outputFormat,
  completion,
  insufficient,
}) {
  const toBullets = (items) => items.map((item) => `- ${item}`).join("\n");
  const fallbackInsufficient = [
    "若資訊不足，請明確標示缺少哪些資料。",
    "不可把推測當成已確認事實。",
    "如需做假設，請清楚標示為假設。",
  ];

  return `【角色】
${role}

【任務】
${task}

【輸入內容】
${inputLabel}：
{{input}}

【背景／適用情境】
${context}

【執行要求】
${toBullets(requirements)}

【輸出格式】
${outputFormat}

【完成標準】
${toBullets(completion)}

【資訊不足時的處理】
${toBullets(insufficient || fallbackInsufficient)}`;
}

const prompts = promptDefinitions.map(({ prompt, ...metadata }) => ({
  ...metadata,
  template: standardPrompt(prompt),
}));

const elements = {
  searchInput: document.querySelector("#searchInput"),
  categorySelect: document.querySelector("#categorySelect"),
  promptList: document.querySelector("#promptList"),
  resultCount: document.querySelector("#resultCount"),
  selectedTitle: document.querySelector("#selectedTitle"),
  selectedDescription: document.querySelector("#selectedDescription"),
  templatePreview: document.querySelector("#templatePreview"),
  userInput: document.querySelector("#userInput"),
  finalPrompt: document.querySelector("#finalPrompt"),
  buildButton: document.querySelector("#buildButton"),
  copyButton: document.querySelector("#copyButton"),
  statusMessage: document.querySelector("#statusMessage"),
};

let selectedPrompt = prompts[0];

function setupCategories() {
  const categories = ["全部", ...new Set(prompts.map((prompt) => prompt.category))];

  elements.categorySelect.innerHTML = categories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
}

function getFilteredPrompts() {
  const keyword = elements.searchInput.value.trim().toLowerCase();
  const category = elements.categorySelect.value;

  return prompts.filter((prompt) => {
    const matchesCategory = category === "全部" || prompt.category === category;
    const searchText = [
      prompt.title,
      prompt.category,
      prompt.description,
      prompt.tags.join(" "),
      prompt.template,
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && searchText.includes(keyword);
  });
}

function renderPromptList() {
  const filteredPrompts = getFilteredPrompts();
  elements.resultCount.textContent = `${filteredPrompts.length} 筆`;

  if (filteredPrompts.length === 0) {
    elements.promptList.innerHTML = '<p class="empty">找不到符合條件的提示詞。</p>';
    return;
  }

  elements.promptList.innerHTML = filteredPrompts
    .map(
      (prompt) => `
        <button class="prompt-item ${prompt.id === selectedPrompt.id ? "active" : ""}" type="button" data-id="${prompt.id}">
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

function selectPrompt(promptId) {
  const nextPrompt = prompts.find((prompt) => prompt.id === promptId);

  if (!nextPrompt) {
    return;
  }

  selectedPrompt = nextPrompt;
  elements.selectedTitle.textContent = selectedPrompt.title;
  elements.selectedDescription.textContent = selectedPrompt.description;
  elements.templatePreview.value = selectedPrompt.template;
  elements.statusMessage.textContent = "";
  renderPromptList();
}

function buildFinalPrompt() {
  if (!selectedPrompt) {
    elements.statusMessage.textContent = "請先選擇一個提示詞。";
    return;
  }

  const input = elements.userInput.value.trim();
  const finalText = selectedPrompt.template.replace("{{input}}", input || "請在這裡填入你的內容。");

  elements.finalPrompt.value = finalText;
  elements.statusMessage.textContent = "已產生最終提示詞。";
}

async function copyFinalPrompt() {
  const text = elements.finalPrompt.value.trim();

  if (!text) {
    elements.statusMessage.textContent = "請先產生最終提示詞再複製。";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    elements.statusMessage.textContent = "已複製到剪貼簿。";
  } catch {
    elements.finalPrompt.select();
    document.execCommand("copy");
    elements.statusMessage.textContent = "已嘗試使用備用方式複製。";
  }
}

elements.searchInput.addEventListener("input", renderPromptList);
elements.categorySelect.addEventListener("change", renderPromptList);
elements.buildButton.addEventListener("click", buildFinalPrompt);
elements.copyButton.addEventListener("click", copyFinalPrompt);
elements.promptList.addEventListener("click", (event) => {
  const item = event.target.closest(".prompt-item");

  if (item) {
    selectPrompt(item.dataset.id);
  }
});

setupCategories();
selectPrompt(selectedPrompt.id);

