const bulkText = document.querySelector("#bulkText");
const statusBox = document.querySelector("#status");
const fillButton = document.querySelector("#fill");
const previewButton = document.querySelector("#preview");
const templateButton = document.querySelector("#template");
const pasteAndFillButton = document.querySelector("#pasteAndFill");

const TEMPLATE = `# 基本信息
产品名称：Dynamic Full Color LCD Electronic Shelf Label for Retail Inventory Management
中心词：label; management; shelf; lcd; color
关键词：Full Color ESL; LCD Price Tag; Inventory Management Display; Digital Shelf Labeling; Smart Retail Display; Dynamic Price Display; Electronic Label System; Color LCD Signage; Wireless Price Tag; Retail Automation
产品分组：Armor Digital
产品型号：HM-2026-02

# 产品亮点
产品亮点1：Full-color LCD display supports dynamic price, image, and barcode updates.
产品亮点2：Wireless updates reduce manual labeling work for retail teams.
产品亮点3：Slim guide-rail power design fits shelves and digital signage scenarios.
产品亮点4：High-resolution 1280x800 screen ensures crisp visuals from any angle.
产品亮点5：Scalable across retail chains with centralized content management.

# 产品属性
# -- 标准属性
适用门店：Electronics Store; Convenience Store; Supermarket; Pharmacies
安装方式：Power Supply by The Guide Rail Support
内容支持：Price + Barcode
显示颜色：Full Color
分辨率：1280*800
屏幕尺寸：10.1
显示技术：LCD
认证：CE; RoHS; FCC
功率：<6W
发光颜色：White
电压：12V
防护等级：IP65
运输包装：Carton
规格：35.00cm * 25.00cm * 20.00cm
商标：Armor lighting
原产地：China

# -- 自定义属性
Logic：LCD Video Display
Weight：315g
Update Efficiency：<10s
Work Efficiency：2.4G wifi
Technology：Ultra-Thin, Narrow Frame Design
Power Supply Mode：Power Supply by The Guide Rail Support


# 规格管理
规格名称：Size
规格值：Single Screen; Double Screen
规格2名称：Color
规格2值：Black; White; Silver

# FOB价格设置
# -- 插件根据提供的字段自动选择三种模式之一：
# -- 模式0-一口价销售：规格最小起订量、规格商品编码、规格库存、规格单价
# -- 模式1-阶梯价销售：价格区间N起订量/单价（所有区间共享1个库存）
# -- 模式2-区间价销售：区间价最小起订量、区间价最低价、区间价最高价、区间价库存
价格区间1起订量：10
价格区间1单价：32.13
价格区间2起订量：3000
价格区间2单价：26.78
价格区间3起订量：5000
价格区间3单价：25.44
价格区间4起订量：10000
价格区间4单价：23.50
库存：100000

# 计量单位
计量单位：个

# 包裹尺寸
Package Gross Weight：1.000kg
单个包裹内产品数量：20
单个包裹长：110
单个包裹宽：60
单个包裹高：40
单个包裹毛重：10

# 发货效率信息
港口：Huangpu
发货期数量：100
发货期时间：15

# 样品交易设置
提供样品：是
样品单价：32.13
样品单位：个
单次最多拿样数量：10
样品描述：Sample available within 3 business days

# 其它信息
支付方式：L/C; T/T; Paypal
产量：5000PCS/Month
海关编码：8528729000

# 产品详情
产品详情：10.1 Inch Wireless Electronic Shelf Labels help retailers update prices and product information efficiently. The full-color LCD display supports price, barcode, and promotional content for supermarkets, convenience stores, and electronics stores.

# FAQ
FAQ问题1：What is the lead time?
FAQ答案1：Please contact us for current lead time based on order quantity.
FAQ问题2：Can you customize the screen size?
FAQ答案2：Yes, we offer customization for bulk orders over 5,000 units.`;

function setStatus(message) {
  statusBox.textContent = message;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error("没有找到当前页面");
  return tab;
}

async function sendToPage(type, payload = {}) {
  const tab = await getActiveTab();
  try {
    return await chrome.tabs.sendMessage(tab.id, { type, ...payload });
  } catch (error) {
    if (!/Receiving end does not exist|Could not establish connection/i.test(error.message)) {
      throw error;
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
    return chrome.tabs.sendMessage(tab.id, { type, ...payload });
  }
}

async function saveDraft() {
  await chrome.storage.local.set({ bulkTextDraft: bulkText.value });
}

chrome.storage.local.get("bulkTextDraft").then(({ bulkTextDraft }) => {
  if (bulkTextDraft) bulkText.value = bulkTextDraft;
});

bulkText.addEventListener("input", saveDraft);

templateButton.addEventListener("click", async () => {
  bulkText.value = TEMPLATE;
  await saveDraft();
  setStatus("已插入模板，可以按你们产品资料改字段值。");
});

previewButton.addEventListener("click", async () => {
  try {
    await saveDraft();
    const result = await sendToPage("MIC_BULK_FILL_PREVIEW", { text: bulkText.value });
    setStatus(formatResult(result, "预览"));
  } catch (error) {
    setStatus(`预览失败：${error.message}`);
  }
});

fillButton.addEventListener("click", async () => {
  await fillFromText(bulkText.value);
});

pasteAndFillButton.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    bulkText.value = text;
    await saveDraft();
    await fillFromText(text);
  } catch (error) {
    setStatus(`读取剪贴板失败：${error.message}`);
  }
});

async function fillFromText(text) {
  if (!text.trim()) {
    setStatus("请先粘贴产品资料。");
    return;
  }

  [fillButton, previewButton, pasteAndFillButton].forEach((button) => {
    button.disabled = true;
  });

  try {
    const result = await sendToPage("MIC_BULK_FILL_APPLY", { text });
    setStatus(formatResult(result, "填充"));
  } catch (error) {
    setStatus(`填充失败：${error.message}`);
  } finally {
    [fillButton, previewButton, pasteAndFillButton].forEach((button) => {
      button.disabled = false;
    });
  }
}

function formatResult(result, label) {
  if (!result) return `${label}完成，但没有收到页面返回。`;

  const filled = result.filled?.length ?? 0;
  const unmatched = result.unmatched?.length ?? 0;
  const lines = [`${label}完成：匹配 ${filled} 项，未匹配 ${unmatched} 项。`];

  if (result.filled?.length) {
    lines.push("\n已匹配：");
    lines.push(...result.filled.slice(0, 12).map((item) => `- ${item.key} → ${item.target}`));
    if (result.filled.length > 12) lines.push(`- 还有 ${result.filled.length - 12} 项...`);
  }

  if (result.unmatched?.length) {
    lines.push("\n未匹配：");
    lines.push(...result.unmatched.slice(0, 8).map((item) => `- ${item.key}`));
    if (result.unmatched.length > 8) lines.push(`- 还有 ${result.unmatched.length - 8} 项...`);
  }

  if (result.skippedHighlights > 0) {
    lines.push(`\n产品亮点超出页面上限，${result.skippedHighlights} 个未填入。`);
  }

  return lines.join("\n");
}
