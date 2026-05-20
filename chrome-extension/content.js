(() => {
  if (window.__MIC_BULK_FILL_CONTENT_LOADED__) return;
  window.__MIC_BULK_FILL_CONTENT_LOADED__ = true;

  const MULTI_VALUE_KEYS = [
    "关键词",
    "keyword",
    "keywords",
    "中心词",
    "产品亮点",
    "适用门店",
    "支付方式"
  ];

  const KEY_ALIASES = new Map([
    ["产品名称", ["产品名称", "product name", "title"]],
    ["中心词", ["中心词", "core word", "core keyword"]],
    ["关键词", ["关键词", "keyword", "keywords"]],
    ["产品分组", ["产品分组", "group"]],
    ["产品型号", ["产品型号", "model", "model no", "model number"]],
    ["产品亮点1", ["产品亮点1", "亮点1", "highlight 1"]],
    ["产品亮点2", ["产品亮点2", "亮点2", "highlight 2"]],
    ["产品亮点3", ["产品亮点3", "亮点3", "highlight 3"]],
    ["适用门店", ["适用门店", "applicable store", "store"]],
    ["安装方式", ["安装方式", "installation"]],
    ["内容支持", ["内容支持", "content support"]],
    ["显示颜色", ["显示颜色", "display color", "color"]],
    ["分辨率", ["分辨率", "resolution"]],
    ["屏幕尺寸", ["屏幕尺寸", "screen size", "size"]],
    ["显示技术", ["显示技术", "display technology"]],
    ["运输包装", ["运输包装", "transport package", "package"]],
    ["规格", ["规格", "specification"]],
    ["商标", ["商标", "trademark", "brand"]],
    ["原产地", ["原产地", "origin", "place of origin"]],
    ["Package Gross Weight", ["package gross weight", "package gross we", "包裹毛重"]],
    ["Logic", ["logic"]],
    ["Weight", ["weight", "重量"]],
    ["Update Efficiency", ["update efficiency"]],
    ["Work Efficiency", ["work efficiency"]],
    ["Technology", ["technology", "技术"]],
    ["Power Supply Mode", ["power supply mode", "power supply mod", "供电"]],
    ["计量单位", ["计量单位", "unit"]],
    ["单个包裹内产品数量", ["单个包裹内产品数量", "products per package"]],
    ["单个包裹长", ["单个包裹长", "package length", "长"]],
    ["单个包裹宽", ["单个包裹宽", "package width", "宽"]],
    ["单个包裹高", ["单个包裹高", "package height", "高"]],
    ["单个包裹毛重", ["单个包裹毛重", "gross weight"]],
    ["港口", ["港口", "port"]],
    ["提供样品", ["提供样品", "sample"]],
    ["样品单价", ["样品单价", "sample price"]],
    ["单次最多拿样数量", ["单次最多拿样数量", "max sample quantity"]],
    ["支付方式", ["支付方式", "payment", "payment method"]],
    ["产量", ["产量", "production capacity", "capacity"]],
    ["海关编码", ["海关编码", "hs code"]],
    ["产品详情", ["产品详情", "product details", "description", "overview"]],
    ["FAQ问题1", ["faq问题1", "问题1", "faq question 1"]],
    ["FAQ答案1", ["faq答案1", "答案1", "faq answer 1"]]
  ]);

  const SECTION_ALIASES = [
    { names: ["基本信息", "产品信息", "basic information"], selector: ".bd.J-bd:has([data-anchor='prodName']), .product-form-wrap .bd.J-bd:first-of-type" },
    { names: ["产品展示", "图片视频", "product display"], root: "productDisplay" },
    { names: ["产品亮点", "亮点", "highlights"], root: "highlights" },
    { names: ["产品属性", "标准属性", "自定义属性", "attributes", "custom attributes"], root: "customProperties" },
    { names: ["规格管理", "specification management", "spec management"], root: "specManagement" },
    { names: ["FOB价格设置", "fob价格设置", "价格设置", "fob price", "pricing"], root: "specSku" },
    { names: ["计量单位", "unit"], root: "unit" },
    { names: ["包裹尺寸", "package dimensions", "package"], root: "package" },
    { names: ["运费信息", "shipping", "freight"], root: "shipping" },
    { names: ["发货效率信息", "发货效率", "delivery efficiency"], root: "sent" },
    { names: ["样品单交易设置", "样品交易设置", "样品", "sample"], root: "sample" },
    { names: ["其他信息设置", "其它信息", "其他信息", "other information"], root: "otherInfo" },
    { names: ["FAQ", "常见问题"], root: "faq" },
    { names: ["产品详情", "details", "product details"], root: "detail" }
  ];

  const SIMPLE_FIELD_BINDINGS = [
    { key: "产品名称", root: "basicInfo", selector: "textarea[name='prodName']" },
    { key: "产品型号", root: "basicInfo", selector: "input[name='prodModel']" },
    { key: "运输包装", root: "customProperties", selector: "input[name='prodPacking']" },
    { key: "规格", root: "customProperties", selector: "input[name='prodStandard']" },
    { key: "商标", root: "customProperties", selector: "input[name='prodTrademark']" },
    { key: "原产地", root: "customProperties", selector: "input[name='prodOrigin']" },
    { key: "单个包裹内产品数量", root: "package", selector: "input[name='packProdNum']" },
    { key: "单个包裹长", root: "package", selector: "input[name='packDepth']" },
    { key: "单个包裹宽", root: "package", selector: "input[name='packWidth']" },
    { key: "单个包裹高", root: "package", selector: "input[name='packHeight']" },
    { key: "单个包裹毛重", root: "package", selector: "input[name='grossWeight']" },
    { key: "港口", root: "sent", selector: "input.J-port" },
    { key: "产量", root: "otherInfo", selector: "input[name='prodProductivity']" },
    { key: "海关编码", root: "otherInfo", selector: "input[name='hsCode']" }
  ];

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "MIC_BULK_FILL_PREVIEW" || message.type === "MIC_BULK_FILL_APPLY") {
      (async () => {
        const shouldApply = message.type === "MIC_BULK_FILL_APPLY";
        try {
          sendResponse(await fillPage(message.text || "", shouldApply));
        } catch (error) {
          sendResponse({ filled: [], unmatched: [{ key: "错误", value: error.message }] });
        }
      })();
    }
    return true;
  });

  async function fillPage(text, shouldApply) {
    const entries = parseBulkText(text);
    const direct = await fillKnownMadeInChinaFields(entries, shouldApply);
    const directlyFilledKeys = new Set(direct.filled.map((item) => item.key));
    const filled = [...direct.filled];
    const unmatched = entries.filter((entry) =>
      !wasDirectlyFilled(entry.key, directlyFilledKeys) && !shouldIgnoreUnboundEntry(entry.key)
    );

    return { filled, unmatched, skippedHighlights: direct.skippedHighlights ?? 0 };
  }

  function wasDirectlyFilled(key, filledKeys) {
    if (filledKeys.has(key)) return true;
    const normalizedKey = normalize(key).replace(/\d+$/, "");
    for (const filledKey of filledKeys) {
      const normalizedFilled = normalize(filledKey).replace(/\d+$/, "");
      if (normalizedKey && normalizedKey === normalizedFilled) return true;
    }
    return false;
  }

  function shouldIgnoreUnboundEntry(key) {
    const normalizedKey = normalize(key);
    return ["中心词", "产品分组"].some((item) => normalizedKey === normalize(item));
  }

  async function fillKnownMadeInChinaFields(entries, shouldApply) {
    const filled = [];
    const get = makeEntryGetter(entries);
    const exactGet = makeExactEntryGetter(entries);

    fillSimpleBoundFields(get, shouldApply, filled);

    await fillKeywords(entries, shouldApply, filled);
    const skippedHighlights = await fillHighlights(get, shouldApply, filled);
    fillKnownProperties(get, shouldApply, filled);
    fillDynamicStandardProperties(entries, shouldApply, filled);
    await fillCustomProperties(entries, get, shouldApply, filled);
    await fillSpecManagement(entries, get, shouldApply, filled);
    await fillFobPrices(get, shouldApply, filled);
    fillUnit(get, shouldApply, filled);
    fillPaymentMethods(get, shouldApply, filled);
    fillSampleMode(get, shouldApply, filled);
    fillSampleFields(get, shouldApply, filled);
    fillProductDetails(get, shouldApply, filled);
    await fillDeliveryEfficiency(exactGet, shouldApply, filled);
    fillFreightTemplate(get, shouldApply, filled);
    await fillFaq(exactGet, shouldApply, filled);

    return { filled, skippedHighlights };
  }

  function fillSimpleBoundFields(get, shouldApply, filled) {
    for (const binding of SIMPLE_FIELD_BINDINGS) {
      const value = get(binding.key);
      if (!value) continue;
      const control = queryBinding(binding);
      if (!control || !isFillableKnownControl(control)) continue;
      if (shouldApply) applyValue(control, value, binding.key);
      filled.push({ key: binding.key, value, target: `${binding.root} ${binding.selector}`, score: 120 });
    }
  }

  function queryBinding(binding) {
    const root = findSectionRoot(binding.root);
    if (!root) return null;
    return root.querySelector(binding.selector);
  }

  function makeEntryGetter(entries) {
    const byKey = new Map();
    for (const entry of entries) {
      byKey.set(normalize(entry.key), entry.value);
    }

    return (...keys) => {
      for (const key of keys) {
        const exact = byKey.get(normalize(key));
        if (exact) return exact;

        const aliases = getAliases(key).map(normalize);
        for (const [entryKey, value] of byKey.entries()) {
          if (aliases.some((alias) => entryKey === alias)) return value;
        }
      }
      return "";
    };
  }

  function makeExactEntryGetter(entries) {
    const byKey = new Map();
    for (const entry of entries) {
      byKey.set(normalize(entry.key), entry.value);
    }

    return (...keys) => {
      for (const key of keys) {
        const exact = byKey.get(normalize(key));
        if (exact) return exact;
      }
      return "";
    };
  }

  async function fillKeywords(entries, shouldApply, filled) {
    const exactEntries = new Map(entries.map((entry) => [normalize(entry.key), entry.value]));
    const joined = exactEntries.get(normalize("关键词")) || exactEntries.get(normalize("keywords")) || "";
    const values = joined ? splitValues(joined) : [];
    for (let index = 1; index <= 10; index += 1) {
      const single = exactEntries.get(normalize(`关键词${index}`)) || exactEntries.get(normalize(`keyword${index}`));
      if (single) values[index - 1] = single;
    }

    const keywordValues = values.filter(Boolean).slice(0, 10);
    for (let index = 0; index < keywordValues.length; index += 1) {
      const control = await getSequentialKeywordControl(index, shouldApply);
      if (!control) break;
      const value = keywordValues[index];
      if (shouldApply) applyValue(control, value, `关键词${index + 1}`);
      filled.push({ key: index === 0 ? "关键词" : `关键词${index + 1}`, value, target: `textarea[name='prodKeyword'] #${index + 1}`, score: 120 });
    }
  }

  async function getSequentialKeywordControl(index, shouldApply) {
    const root = findSectionRoot("keywords");
    if (!root) return null;

    for (let attempts = 0; attempts < 8; attempts += 1) {
      const controls = [...root.querySelectorAll("textarea[name='prodKeyword'], .J-keyword-value")].filter(isVisible);
      if (controls[index]) return controls[index];

      if (!shouldApply) return null;

      const previous = controls[index - 1];
      if (previous && !previous.value.trim()) return null;

      const button = root.querySelector(".J-keyword-add");
      if (!button) return null;
      button.click();
      await sleep(160);
    }
    return null;
  }

  async function fillHighlights(get, shouldApply, filled) {
    const values = [];
    for (let index = 0; index < 20; index += 1) {
      const value = get(`产品亮点${index + 1}`, `亮点${index + 1}`, `highlight ${index + 1}`);
      if (!value) break;
      values.push({ key: `产品亮点${index + 1}`, value });
    }

    let skippedHighlights = 0;
    for (let index = 0; index < values.length; index += 1) {
      const control = await getSequentialHighlightControl(index, shouldApply);
      if (!control) {
        skippedHighlights = values.length - index;
        break;
      }
      const { key, value } = values[index];
      if (shouldApply) applyValue(control, value, key);
      filled.push({ key, value, target: `#highlightRoot textarea #${index + 1}`, score: 120 });
    }
    if (shouldApply) syncModuleJson("J-highlightJsonStr", "highlight", values.slice(0, values.length - skippedHighlights).map((item) => item.value));
    return skippedHighlights;
  }

  async function getSequentialHighlightControl(index, shouldApply) {
    const root = findSectionRoot("highlights");
    if (!root) return null;
    for (let attempts = 0; attempts < 8; attempts += 1) {
      const controls = [...root.querySelectorAll("textarea.highlight-text, textarea[placeholder='请输入产品亮点']")].filter(isDisplayed);
      if (controls[index]) return controls[index];

      if (!shouldApply) return null;

      const previous = controls[index - 1];
      if (previous && !previous.value.trim()) return null;

      const button = findAddHighlightButton(root);
      if (!button) return null;
      button.click();
      await sleep(160);
    }
    return null;
  }

  function findAddHighlightButton(root) {
    const selectors = [
      ".J-add-highlight",
      ".J-highlight-add",
      ".add-highlight",
      ".atom-button--button"
    ];
    for (const selector of selectors) {
      const button = root.querySelector(selector);
      if (button && isVisible(button) && /添加亮点|Add\s*Highlight/i.test(button.textContent || button.title || "")) return button;
    }

    const allButtons = [...root.querySelectorAll("button, a, [role='button']")];
    return allButtons.find((el) => /添加亮点|Add\s*Highlight/i.test(el.textContent || el.title || "")) || null;
  }

  async function fillFaq(exactGet, shouldApply, filled) {
    const faqValues = [];
    for (let index = 0; index < 10; index += 1) {
      const question = exactGet(`FAQ问题${index + 1}`, `问题${index + 1}`, `faq question ${index + 1}`);
      const answer = exactGet(`FAQ答案${index + 1}`, `答案${index + 1}`, `faq answer ${index + 1}`);
      if (!question && !answer) continue;

      const block = await getSequentialFaqBlock(index, shouldApply);
      if (!block) break;

      const textareas = block.querySelectorAll("textarea");
      if (question && textareas[0]) {
        if (shouldApply) applyModuleTextareaValue(textareas[0], question);
        filled.push({ key: `FAQ问题${index + 1}`, value: question, target: `#faqRoot question #${index + 1}`, score: 120 });
      }
      if (answer && textareas[1]) {
        if (shouldApply) applyModuleTextareaValue(textareas[1], answer);
        filled.push({ key: `FAQ答案${index + 1}`, value: answer, target: `#faqRoot answer #${index + 1}`, score: 120 });
      }
      faqValues.push({ question, answer });
    }
    if (shouldApply) syncModuleJson("J-faqJsonStr", "faq", faqValues);
  }

  async function getSequentialFaqBlock(index, shouldApply) {
    const root = findSectionRoot("faq");
    if (!root) return null;
    for (let attempts = 0; attempts < 8; attempts += 1) {
      const blocks = [...root.querySelectorAll(".atom-faq")];
      if (blocks[index]) return blocks[index];

      if (!shouldApply) return null;

      const previous = blocks[index - 1];
      if (previous) {
        const textareas = previous.querySelectorAll("textarea");
        if ([...textareas].some((textarea) => !textarea.value.trim())) return null;
      }

      const button = findAddFaqButton(root);
      if (!button) return null;
      button.click();
      await sleep(180);
    }
    return null;
  }

  function findAddFaqButton(root = document) {
    const buttons = [...root.querySelectorAll("button, a, [role='button']")];
    return buttons.find((el) => /添加FAQ|Add\s*FAQ/i.test(el.textContent || el.title || "")) || null;
  }

  function syncModuleJson(textareaId, blockName, items) {
    const textarea = document.getElementById(textareaId);
    if (!textarea || !items.length) return;

    let current = null;
    try {
      current = JSON.parse(textarea.value || textarea.textContent || "");
    } catch {
      current = null;
    }

    const block = current?.block?.find?.((item) => item.name === blockName) || { name: blockName, sign: `${blockName}-${Date.now()}` };
    const dataItem = {
      name: blockName,
      sign: block.sign,
      data: blockName === "faq"
        ? { list: items, items, faqList: items }
        : { list: items, items, highlightList: items },
      value: blockName === "faq"
        ? { list: items, items, faqList: items }
        : { list: items, items, highlightList: items }
    };

    const next = {
      dsl: current?.dsl || 1,
      block: current?.block?.length ? current.block : [block],
      data: [dataItem]
    };

    setNativeValue(textarea, JSON.stringify(next));
    textarea.textContent = textarea.value;
    dispatchEditableEvents(textarea);
  }

  function fillKnownProperties(get, shouldApply, filled) {
    const propAliases = [
      ["适用门店", "Store Type"],
      ["安装方式", "Mounting Type"],
      ["内容支持", "Content Support"],
      ["显示颜色", "Color Options"],
      ["分辨率", "Resolution"],
      ["屏幕尺寸", "Screen Size"],
      ["显示技术", "Display Technology"],
      ["认证", "Certification"],
      ["功率", "Power"],
      ["发光颜色", "Emitting Color"],
      ["电压", "Voltage"],
      ["防护等级", "IP Rating"]
    ];

    for (const [key, english] of propAliases) {
      const value = get(key, english);
      if (!value) continue;
      const block = findPropertyBlock(key, english);
      if (!block) continue;

      if (block.getAttribute("cz-type") === "checkbox") {
        const values = splitValues(value);
        const boxes = [...block.querySelectorAll("input[type='checkbox']")];
        for (const box of boxes) {
          const label = box.getAttribute("cz-html") || box.closest("label")?.textContent || "";
          const shouldCheck = values.some((item) => sameOption(item, label));
          if (shouldApply && box.checked !== shouldCheck) box.click();
          if (shouldApply) syncCheckedAttribute(box, shouldCheck);
        }
      } else {
        const select = block.querySelector("select");
        if (select && shouldApply) fillSelectOrOther(select, value, block);
      }

      filled.push({ key, value, target: `.J-stand-prop ${english}`, score: 120 });
    }
  }

  function fillDynamicStandardProperties(entries, shouldApply, filled) {
    const exact = new Map(entries.map((entry) => [normalize(entry.key), entry.value]));
    const alreadyFilled = new Set(filled.map((item) => normalize(item.key)));

    const root = findSectionRoot("customProperties");
    if (!root) return;
    const blocks = [...root.querySelectorAll(".J-stand-prop")];
    for (const block of blocks) {
      const label = cleanFieldLabel(block.querySelector(".form-label")?.textContent || "");
      const english = block.getAttribute("cz-name") || "";
      const value = exact.get(normalize(label)) || exact.get(normalize(english));
      if (!value || alreadyFilled.has(normalize(label)) || alreadyFilled.has(normalize(english))) continue;

      if (block.getAttribute("cz-type") === "checkbox") {
        const values = splitValues(value);
        const boxes = [...block.querySelectorAll("input[type='checkbox']")];
        for (const box of boxes) {
          const optionLabel = box.getAttribute("cz-html") || box.closest("label")?.textContent || "";
          const shouldCheck = values.some((item) => sameOption(item, optionLabel));
          if (shouldApply && box.checked !== shouldCheck) box.click();
          if (shouldApply) syncCheckedAttribute(box, shouldCheck);
        }
      } else {
        const select = block.querySelector("select");
        if (select && shouldApply) fillSelectOrOther(select, value, block);
      }

      filled.push({ key: label || english, value, target: `.J-stand-prop ${english || label}`, score: 115 });
    }
  }

  function cleanFieldLabel(text) {
    return String(text || "")
      .replace(/\*/g, "")
      .replace(/[：:]\s*$/, "")
      .trim();
  }

  async function fillSpecManagement(entries, get, shouldApply, filled) {
    const groups = parseSpecGroups(entries, get);
    if (!groups.length) return;

    for (let index = 0; index < groups.length; index += 1) {
      const group = groups[index];
      const specGroup = await getSequentialSpecGroup(index, shouldApply);
      if (!specGroup) break;

      const nameInput = specGroup.querySelector("input[name='specName'], .J-inp-specName");
      if (group.name && nameInput) {
        if (shouldApply) applyValue(nameInput, group.name, `规格${index + 1}名称`);
        filled.push({ key: index === 0 ? "规格名称" : `规格${index + 1}名称`, value: group.name, target: `specName #${index + 1}`, score: 120 });
      }

      for (let valueIndex = 0; valueIndex < group.values.length; valueIndex += 1) {
        const valueInput = await getSequentialSpecValueInput(specGroup, valueIndex, shouldApply);
        if (!valueInput) break;
        const value = group.values[valueIndex];
        if (shouldApply) applyValue(valueInput, value, `规格${index + 1}值${valueIndex + 1}`);
        filled.push({ key: index === 0 ? `规格值${valueIndex + 1}` : `规格${index + 1}值${valueIndex + 1}`, value, target: `specValue group ${index + 1} #${valueIndex + 1}`, score: 120 });
      }
    }
  }

  function parseSpecGroups(entries, get) {
    const exact = new Map(entries.map((entry) => [normalize(entry.key), entry.value]));
    const groups = [];

    const defaultName = exact.get(normalize("规格名称")) || exact.get(normalize("规格管理名称")) || exact.get(normalize("spec name"));
    const defaultValues = exact.get(normalize("规格值")) || exact.get(normalize("规格管理值")) || exact.get(normalize("spec values"));
    if (defaultName || defaultValues) {
      groups.push({
        name: defaultName || "Specification",
        values: splitValues(defaultValues || "")
      });
    }

    for (let index = 1; index <= 3; index += 1) {
      const name = exact.get(normalize(`规格${index}名称`)) || exact.get(normalize(`规格名称${index}`)) || exact.get(normalize(`spec${index}name`));
      const joinedValues = exact.get(normalize(`规格${index}值`)) || exact.get(normalize(`规格值${index}`)) || exact.get(normalize(`spec${index}values`));
      const values = joinedValues ? splitValues(joinedValues) : [];

      for (let valueIndex = 1; valueIndex <= 20; valueIndex += 1) {
        const single = exact.get(normalize(`规格${index}值${valueIndex}`)) || exact.get(normalize(`规格值${index}-${valueIndex}`));
        if (single) values[valueIndex - 1] = single;
      }

      if (name || values.length) {
        groups[index - 1] = {
          name: name || `Specification ${index}`,
          values: values.filter(Boolean)
        };
      }
    }

    return groups.filter((group) => group && (group.name || group.values.length));
  }

  async function getSequentialSpecGroup(index, shouldApply) {
    const root = findSectionRoot("specManagement");
    if (!root) return null;
    for (let attempts = 0; attempts < 8; attempts += 1) {
      const groups = [...root.querySelectorAll(".spec-group")];
      if (groups[index]) return groups[index];

      if (!shouldApply) return null;

      const previous = groups[index - 1];
      if (previous) {
        const nameInput = previous.querySelector("input[name='specName'], .J-inp-specName");
        const valueInput = previous.querySelector("input[name='specValue'], .J-inp-specValue");
        if ((nameInput && !nameInput.value.trim()) || (valueInput && !valueInput.value.trim())) return null;
      }

      const button = root.querySelector(".J-btn-addSpecGroup");
      if (!button) return null;
      button.click();
      await sleep(180);
    }
    return null;
  }

  async function getSequentialSpecValueInput(specGroup, index, shouldApply) {
    for (let attempts = 0; attempts < 10; attempts += 1) {
      const inputs = [...specGroup.querySelectorAll("input[name='specValue'], .J-inp-specValue")];
      if (inputs[index]) return inputs[index];

      if (!shouldApply) return null;

      const previous = inputs[index - 1];
      if (previous && !previous.value.trim()) return null;

      const button = specGroup.querySelector(".J-btn-addSpecValue");
      if (!button) return null;
      button.click();
      await sleep(160);
    }
    return null;
  }

  async function fillFixedPrice(get, shouldApply, filled) {
    const binding = await activateFobPriceMode("0", shouldApply);
    const section = binding?.section;
    if (!section) return;

    const fields = [
      ["规格最小起订量", "input[name='skuMinOrder_one'], .J-sku-MOQ"],
      ["规格商品编码", "input[name='skuCode_one']"],
      ["规格库存", "input[name='skuStock_one']"],
      ["规格单价", "input[name='skuPrice_one']"]
    ];

    for (const [key, selector] of fields) {
      const value = get(key);
      const control = section.querySelector(selector);
      if (!value || !control) continue;
      if (shouldApply) {
        enableFobControl(control);
        applyValue(control, value, key);
      }
      filled.push({ key, value, target: selector, score: 110 });
    }

    if (shouldApply) {
      const pricingRadio = section.querySelector("input[name='pricingStrategy'][value='2']");
      if (pricingRadio && !pricingRadio.checked) {
        enableFobControl(pricingRadio);
        pricingRadio.click();
        pricingRadio.dispatchEvent(new Event("change", { bubbles: true }));
        syncRadioGroupAttribute(pricingRadio);
      }
    }
  }

  async function fillCustomProperties(entries, get, shouldApply, filled) {
    const reserved = new Set([
      "产品名称", "中心词", "关键词", "产品分组", "产品型号", "产品亮点1", "产品亮点2", "产品亮点3",
      "适用门店", "安装方式", "内容支持", "显示颜色", "分辨率", "屏幕尺寸", "显示技术", "运输包装",
      "规格名称", "规格管理名称", "规格值", "规格管理值", "规格最小起订量", "规格商品编码", "规格库存", "规格单价", "库存",
      "认证", "Certification", "功率", "Power", "发光颜色", "Emitting Color", "电压", "Voltage", "防护等级",
      "规格", "商标", "原产地", "价格区间1起订量", "价格区间1单价", "价格区间1库存", "价格区间2起订量",
      "价格区间2单价", "价格区间2库存", "价格区间3起订量", "价格区间3单价", "价格区间3库存",
      "价格区间4起订量", "价格区间4单价", "价格区间4库存", "价格区间5起订量", "价格区间5单价", "价格区间5库存",
      "区间价最小起订量", "区间价最低价", "区间价最高价", "区间价库存",
      "计量单位", "单个包裹内产品数量", "单个包裹长", "单个包裹宽", "单个包裹高", "单个包裹毛重",
      "港口", "提供样品", "样品单价", "样品单位", "单次最多拿样数量", "样品描述", "支付方式",
      "产量", "海关编码", "产品详情", "FAQ问题1", "FAQ答案1", "FAQ问题2", "FAQ答案2", "FAQ问题3", "FAQ答案3",
      "发货期数量", "发货期时间", "运费模板", "Package Gross Weight"
    ].map(normalize));

    const customRoot = findSectionRoot("customProperties");
    if (!customRoot) return;
    const rows = [...customRoot.querySelectorAll(".J-selfprop")];
    const customMap = new Map();
    for (const row of rows) {
      const nameInput = row.querySelector("input[name='customPropName']");
      const valueInput = row.querySelector("input[name='customPropValue']");
      if (nameInput && valueInput) customMap.set(normalize(nameInput.value), valueInput);
    }
    const customNameInputs = [...customRoot.querySelectorAll("input[name='customPropName']")];
    for (const entry of customNameInputs) {
      const value = get(entry.value);
      const rowValue = entry.closest(".J-selfprop")?.querySelector("input[name='customPropValue']");
      if (!value || !rowValue) continue;
      if (shouldApply) applyValue(rowValue, value, entry.value);
      filled.push({ key: entry.value, value, target: `customProp ${entry.value}`, score: 120 });
    }

    const customEntries = entries.filter((entry) => shouldUseCustomProperty(entry.key));
    const usedCustomKeys = new Set(filled.map((item) => normalize(item.key)));
    const MAX_CUSTOM_PROPS = 15;
    let addedCount = 0;
    for (let index = 0; index < customEntries.length; index += 1) {
      const entry = customEntries[index];
      if (usedCustomKeys.has(normalize(entry.key))) continue;
      if (addedCount >= MAX_CUSTOM_PROPS) break;
      const row = await getSequentialCustomPropertyRow(shouldApply);
      if (!row) break;
      const nameInput = row.querySelector("input[name='customPropName']");
      const valueInput = row.querySelector("input[name='customPropValue']");
      if (shouldApply) {
        applyValue(nameInput, entry.key, "自定义属性名");
        applyValue(valueInput, entry.value, entry.key);
      }
      filled.push({ key: entry.key, value: entry.value, target: `customProp ${entry.key}`, score: 120 });
      usedCustomKeys.add(normalize(entry.key));
      addedCount += 1;
    }

    for (const [normalizedName, control] of customMap.entries()) {
      if (reserved.has(normalizedName)) continue;
      if (usedCustomKeys.has(normalizedName)) continue;
      const value = get(normalizedName);
      if (!value) continue;
      if (shouldApply) applyValue(control, value, normalizedName);
      filled.push({ key: normalizedName, value, target: "customProp", score: 110 });
    }
  }

  async function getSequentialCustomPropertyRow(shouldApply) {
    const root = findSectionRoot("customProperties");
    if (!root) return null;
    const queryRows = () => [...root.querySelectorAll(".J-selfprop")];

    for (let attempts = 0; attempts < 8; attempts += 1) {
      const rows = queryRows();
      const emptyRow = rows.find((row) => {
        const nameInput = row.querySelector("input[name='customPropName']");
        const valueInput = row.querySelector("input[name='customPropValue']");
        return nameInput && valueInput && !nameInput.value.trim() && !valueInput.value.trim();
      });
      if (emptyRow) return emptyRow;

      if (!shouldApply) return null;

      const incompleteRow = rows.find((row) => {
        const nameInput = row.querySelector("input[name='customPropName']");
        const valueInput = row.querySelector("input[name='customPropValue']");
        return nameInput && valueInput && (!nameInput.value.trim() || !valueInput.value.trim());
      });
      if (incompleteRow) return null;

      const button = root.querySelector(".J-prop-add");
      if (!button) return null;
      button.click();
      await sleep(160);
    }
    return null;
  }

  async function fillLadderPrices(get, shouldApply, filled) {
    const binding = await activateFobPriceMode("1", shouldApply);
    const section = binding?.section;
    if (!section) return;

    for (let index = 0; index < 5; index += 1) {
      const num = index + 1;
      const moq = get(`价格区间${num}起订量`, `阶梯价${num}起订量`, `MOQ${num}`);
      const price = get(`价格区间${num}单价`, `阶梯价${num}单价`, `Price${num}`);
      if (!moq && !price) continue;

      const rowControls = await getSequentialLadderControls(section, index, shouldApply);
      if (!rowControls) break;
      const { moqInput, priceInput } = rowControls;

      if (moq && moqInput) {
        if (shouldApply) applyValue(moqInput, moq, `价格区间${num}起订量`);
        filled.push({ key: `价格区间${num}起订量`, value: moq, target: `J-ladderMOQ #${index + 1}`, score: 120 });
      }
      if (price && priceInput) {
        if (shouldApply) applyValue(priceInput, price, `价格区间${num}单价`);
        filled.push({ key: `价格区间${num}单价`, value: price, target: `J-ladderprice #${index + 1}`, score: 120 });
      }
    }

    const stock = get(`价格区间1库存`, `价格区间2库存`, `价格区间3库存`, `价格区间4库存`, `价格区间5库存`, `阶梯价1库存`, `阶梯价2库存`, `库存`, `Stock`);
    if (stock) {
      const stockInput = section.querySelector("#prodStockNewOfLadder0, input.J-ladderstock");
      if (stockInput) {
        if (shouldApply) {
          enableFobControl(stockInput);
          applyValue(stockInput, stock, "库存");
        }
        filled.push({ key: "库存", value: stock, target: "#prodStockNewOfLadder0", score: 120 });
      }
    }
  }

  async function getSequentialLadderControls(section, index, shouldApply) {
    for (let attempts = 0; attempts < 8; attempts += 1) {
      const rows = [...section.querySelectorAll("tr.J-ladder-item")];
      const row = rows[index];
      if (row) {
        const moqInput = row.querySelector("input.J-ladderMOQ, input[name='prodMinimumOrderOfLadder']");
        const priceInput = row.querySelector("input.J-ladderprice, input[name='prodPriceNewOfLadder']");
        if (!moqInput || !priceInput) return null;
        if (shouldApply) {
          enableFobControl(moqInput);
          enableFobControl(priceInput);
        }
        return {
          moqInput,
          priceInput
        };
      }

      if (!shouldApply) return null;

      const previous = rows[index - 1];
      const previousMoq = previous?.querySelector("input.J-ladderMOQ, input[name='prodMinimumOrderOfLadder']");
      const previousPrice = previous?.querySelector("input.J-ladderprice, input[name='prodPriceNewOfLadder']");
      if ((previousMoq && !previousMoq.value.trim()) || (previousPrice && !previousPrice.value.trim())) return null;

      const button = section.querySelector(".J-add-ladder");
      if (!button) return null;
      button.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      button.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await sleep(180);
    }
    return null;
  }

  async function fillReferencePrices(get, shouldApply, filled) {
    const binding = await activateFobPriceMode("2", shouldApply);
    const section = binding?.section;
    if (!section) return;

    const fields = [
      ["区间价最小起订量", "input[name='prodMinimumOrderOfBase'], .J-reference-MOQ"],
      ["区间价最低价", "input[name='prodPriceNewStartOfBase'], .J-reference-price1"],
      ["区间价最高价", "input[name='prodPriceNewEndOfBase'], .J-reference-price2"],
      ["区间价库存", "input[name='prodStockNewOfBase'], #prodStockNewOfBase"]
    ];

    for (const [key, selector] of fields) {
      const value = get(key);
      const control = section.querySelector(selector);
      if (!value || !control) continue;
      if (shouldApply) {
        enableFobControl(control);
        applyValue(control, value, key);
      }
      filled.push({ key, value, target: selector, score: 120 });
    }
  }

  function determineFobPriceMode(get) {
    if (get("区间价最低价") || get("区间价最高价") || get("区间价最小起订量") || get("区间价库存")) return "2";
    if (get("价格区间1起订量") || get("价格区间1单价") || get("阶梯价1起订量") || get("阶梯价1单价")) return "1";
    if (get("规格最小起订量") || get("规格单价") || get("规格库存") || get("规格商品编码")) return "0";
    return null;
  }

  async function activateFobPriceMode(mode, shouldApply) {
    const root = findSectionRoot("specSku");
    if (!root) return null;

    const bindings = {
      "0": { section: ".J-sku-price", unitWrap: ".J-unit-wrap-negotiate", radio: "input[name='fobPriceType'][value='0']" },
      "1": { section: ".J-ladder-price", unitWrap: ".J-unit-wrap-ladder", radio: "input[name='fobPriceType'][value='1']" },
      "2": { section: ".J-reference-price", unitWrap: ".J-unit-wrap-reference", radio: "input[name='fobPriceType'][value='2']" }
    };
    const binding = bindings[mode];
    if (!binding) return null;

    const radio = root.querySelector(binding.radio);
    const section = root.querySelector(binding.section);
    if (!section) return null;

    if (shouldApply && radio) {
      enableFobControl(radio);
      radio.closest("label")?.click();
      radio.checked = true;
      radio.dispatchEvent(new Event("input", { bubbles: true }));
      radio.dispatchEvent(new Event("change", { bubbles: true }));
      syncRadioGroupAttribute(radio);
    }

    if (shouldApply) {
      bindFobModeDom(root, section, binding.unitWrap);
      await waitFor(() => isDisplayed(section), 800);
      bindFobModeDom(root, section, binding.unitWrap);
    }

    return { root, section, radio };
  }

  function bindFobModeDom(root, activeSection, activeUnitWrapSelector) {
    for (const area of root.querySelectorAll(".J-fobPrice")) {
      const isTarget = area === activeSection;
      area.style.display = isTarget ? "block" : "none";
      if (isTarget) {
        area.classList.remove("J-ignore", "J-submit-ignore");
      } else {
        area.classList.add("J-ignore", "J-submit-ignore");
        for (const control of area.querySelectorAll("input, select, textarea")) {
          control.disabled = true;
          control.setAttribute("disabled", "disabled");
        }
      }
    }
    for (const wrap of document.querySelectorAll(".J-unit-wrap-negotiate, .J-unit-wrap-ladder, .J-unit-wrap-reference")) {
      wrap.style.display = wrap.matches(activeUnitWrapSelector) ? "" : "none";
      if (wrap.matches(activeUnitWrapSelector)) wrap.classList.remove("J-ignore", "J-submit-ignore");
    }
    for (const control of activeSection.querySelectorAll("input[disabled], select[disabled], textarea[disabled]")) {
      enableFobControl(control);
    }
  }

  function enableFobControl(control) {
    control.disabled = false;
    control.removeAttribute("disabled");
  }

  async function fillFobPrices(get, shouldApply, filled) {
    const mode = determineFobPriceMode(get);
    if (!mode) return;

    if (mode === "0") {
      await fillFixedPrice(get, shouldApply, filled);
    } else if (mode === "1") {
      await fillLadderPrices(get, shouldApply, filled);
    } else if (mode === "2") {
      await fillReferencePrices(get, shouldApply, filled);
    }
  }

  function fillUnit(get, shouldApply, filled) {
    const value = get("计量单位", "unit");
    if (!value) return;

    const root = findSectionRoot("unit");
    if (!root) return;
    const selects = [
      ...root.querySelectorAll([
        "select.J-ladder-unitselect",
        "select[name='prodMinimumOrderTypeOfLadder']",
        "select[name='prodMinimumOrderTypeOfBase']",
        "select[name='prodMinimumOrderTypeOfNegotiate']"
      ].join(","))
    ];
    const uniqueSelects = [...new Set(selects)].filter((select) => !select.disabled);
    if (!uniqueSelects.length) return;

    if (shouldApply) {
      for (const select of uniqueSelects) fillSelect(select, value);
    }

    filled.push({ key: "计量单位", value, target: "计量单位下拉框", score: 115 });
  }

  function shouldUseCustomProperty(key) {
    const reserved = new Set([
      "产品名称", "中心词", "关键词", "产品分组", "产品型号", "产品亮点1", "产品亮点2", "产品亮点3",
      "适用门店", "安装方式", "内容支持", "显示颜色", "分辨率", "屏幕尺寸", "显示技术", "运输包装",
      "规格名称", "规格管理名称", "规格值", "规格管理值", "规格最小起订量", "规格商品编码", "规格库存", "规格单价", "库存",
      "认证", "Certification", "功率", "Power", "发光颜色", "Emitting Color", "电压", "Voltage", "防护等级",
      "规格", "商标", "原产地", "价格区间1起订量", "价格区间1单价", "价格区间1库存", "价格区间2起订量",
      "价格区间2单价", "价格区间2库存", "价格区间3起订量", "价格区间3单价", "价格区间3库存",
      "价格区间4起订量", "价格区间4单价", "价格区间4库存", "价格区间5起订量", "价格区间5单价", "价格区间5库存",
      "区间价最小起订量", "区间价最低价", "区间价最高价", "区间价库存",
      "计量单位", "单个包裹内产品数量", "单个包裹长", "单个包裹宽", "单个包裹高", "单个包裹毛重",
      "港口", "提供样品", "样品单价", "样品单位", "单次最多拿样数量", "样品描述", "支付方式",
      "产量", "海关编码", "产品详情", "发货期数量", "发货期时间", "运费模板", "Package Gross Weight"
    ].map(normalize));

    if (reserved.has(normalize(key))) return false;
    if (/^规格\d*(名称|值)|^规格(名称|值)\d|^spec\d*/i.test(key)) return false;
    if (/^faq(问题|答案)|^(问题|答案)\d+|^faqquestion|^faqanswer/i.test(key)) return false;
    if (/^关键词\d+$/i.test(key)) return false;
    if (/^产品亮点\d+$/i.test(key)) return false;
    if (/^价格区间\d+(起订量|单价|库存)$/i.test(key)) return false;
    if (/^阶梯价\d+(起订量|单价|库存)$/i.test(key)) return false;
    if (normalize(key) === normalize("库存")) return false;
    if (/^区间价/i.test(key)) return false;
    if (/^发货期/i.test(key)) return false;
    return true;
  }

  const SECTION_ROOTS = {
    basicInfo: ".bd.J-bd:has([data-anchor='prodName'])",
    productDisplay: ".form-item[data-anchor='picIds'], [data-anchor='picIds']",
    specManagement: ".bd.J-bd.spec-mng[data-anchor='specsMng']",
    specSku: ".bd.J-bd[data-anchor='skuFob']",
    customProperties: ".bd.J-properties-wrap.J-bd[data-anchor='prodAttrs']",
    ladderPrices: ".bd.J-bd[data-anchor='skuFob']",
    highlights: "#highlightRoot",
    faq: "#faqRoot",
    keywords: ".form-item[data-anchor='prodKeyword']",
    detail: ".prod-desc[data-anchor='prodDescript'], #detailRoot",
    unit: ".bd.J-bd[data-anchor='unit']",
    package: ".bd.J-bd[data-anchor='package']",
    shipping: ".bd.J-bd[data-anchor='shipping']",
    sent: ".bd.J-bd[data-anchor='sent']",
    sample: ".bd.J-bd[data-anchor='sample']",
    otherInfo: ".bd.J-bd[data-anchor='other'], .bd.J-bd[data-anchor='otherInfo'], .bd.J-bd:has(input[name='prodPaymentType'])"
  };

  function findSectionRoot(name) {
    const selector = SECTION_ROOTS[name];
    if (!selector) return null;
    return document.querySelector(selector);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitFor(predicate, timeout = 1000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (predicate()) return true;
      await sleep(80);
    }
    return false;
  }

  function fillPaymentMethods(get, shouldApply, filled) {
    const value = get("支付方式", "payment method");
    if (!value) return;

    const values = splitValues(value);
    const root = findSectionRoot("otherInfo");
    const boxes = root ? [...root.querySelectorAll("input[name='prodPaymentType']")] : [];
    for (const box of boxes) {
      const label = box.closest("label")?.textContent || "";
      const shouldCheck = values.some((item) => sameOption(item, label));
      if (shouldApply && box.checked !== shouldCheck) box.click();
      if (shouldApply) syncCheckedAttribute(box, shouldCheck);
    }
    filled.push({ key: "支付方式", value, target: "input[name='prodPaymentType']", score: 120 });
  }

  function fillSampleMode(get, shouldApply, filled) {
    const value = get("提供样品");
    if (!value) return;
    const yes = ["是", "yes", "true", "1"].some((item) => normalize(value).includes(normalize(item)));
    const root = findSectionRoot("sample");
    const control = root?.querySelector(`input[name='provideMode'][value='${yes ? "1" : "0"}']`);
    if (control) {
      if (shouldApply && !control.checked) control.click();
      if (shouldApply) syncRadioGroupAttribute(control);
      if (shouldApply && yes) enableSampleControls();
      filled.push({ key: "提供样品", value, target: `input[name='provideMode'][value='${yes ? "1" : "0"}']`, score: 120 });
    }
  }

  function fillSampleFields(get, shouldApply, filled) {
    const root = findSectionRoot("sample");
    if (!root) return;
    const fields = [
      ["样品单价", "input[name='samplesPrice']"],
      ["样品单位", "select[name='samplesPricePacking']"],
      ["单次最多拿样数量", "input[name='maxSamplesCount']"],
      ["样品描述", "input[name='samplesDesc']"]
    ];

    if (shouldApply) enableSampleControls();

    for (const [key, selector] of fields) {
      const value = get(key);
      const control = root.querySelector(selector);
      if (!value || !control) continue;
      if (shouldApply) applyValue(control, value, key);
      filled.push({ key, value, target: selector, score: 115 });
    }
  }

  function enableSampleControls() {
    const root = findSectionRoot("sample");
    if (!root) return;
    for (const control of root.querySelectorAll("input[name='samplesPrice'], select[name='samplesPricePacking'], input[name='maxSamplesCount'], input[name='samplesDesc']")) {
      control.disabled = false;
    }
  }

  function fillProductDetails(get, shouldApply, filled) {
    const value = get("产品详情", "product details", "description", "overview");
    if (!value) return;

    const root = findSectionRoot("detail");
    if (!root) return;
    const targets = [
      ...root.querySelectorAll("#detailRoot textarea, #detailRoot [contenteditable='true']"),
      ...root.querySelectorAll("textarea[name='newDescStr'], textarea[name='newDescHtml'], #newDescHtml")
    ];
    const uniqueTargets = [...new Set(targets)].filter((control) => control && !control.disabled);
    if (!uniqueTargets.length) return;

    if (shouldApply) {
      for (const control of uniqueTargets) {
        applyValue(control, control.id === "newDescHtml" || control.name === "newDescHtml" ? htmlFromPlainText(value) : value, "产品详情");
      }
    }

    filled.push({ key: "产品详情", value, target: "产品详情编辑器/隐藏提交字段", score: 120 });
  }

  function htmlFromPlainText(value) {
    return String(value)
      .split(/\n{2,}/)
      .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function fillFreightTemplate(get, shouldApply, filled) {
    const root = findSectionRoot("shipping");
    const select = root?.querySelector("select[name='logTemplateId']");
    if (!select) return;
    const defaultOption = [...select.options].find((opt) =>
      normalize(opt.textContent).includes("官方物流") && normalize(opt.textContent).includes("默认推荐")
    );
    if (defaultOption && shouldApply) {
      select.value = defaultOption.value;
      dispatchEditableEvents(select);
    }
    filled.push({ key: "运费模板", value: defaultOption?.textContent || "官方物流运费模板（默认推荐）", target: "select[name='logTemplateId']", score: 120 });
  }

  async function fillDeliveryEfficiency(exactGet, shouldApply, filled) {
    const values = [];
    const num1 = exactGet("发货期数量", "发货期数量1", "stockingNum", "stockingNum1");
    const day1 = exactGet("发货期时间", "发货期时间1", "stockingDay", "stockingDay1");
    if (num1 || day1) values.push({ num: num1, day: day1 });

    for (let index = 2; index <= 3; index += 1) {
      const num = exactGet(`发货期数量${index}`, `stockingNum${index}`);
      const day = exactGet(`发货期时间${index}`, `stockingDay${index}`);
      if (num || day) values.push({ num, day });
    }

    for (let index = 0; index < values.length; index += 1) {
      const row = await getSequentialStockingRow(index, shouldApply);
      if (!row) break;
      const { numInput, dayInput } = row;
      const { num, day } = values[index];
      if (num && numInput) {
        if (shouldApply) applyValue(numInput, num, `发货期数量${index + 1}`);
        filled.push({ key: `发货期数量${index + 1}`, value: num, target: `stockingNum #${index + 1}`, score: 120 });
      }
      if (day && dayInput) {
        if (shouldApply) applyValue(dayInput, day, `发货期时间${index + 1}`);
        filled.push({ key: `发货期时间${index + 1}`, value: day, target: `stockingDay #${index + 1}`, score: 120 });
      }
    }
  }

  async function getSequentialStockingRow(index, shouldApply) {
    const root = findSectionRoot("sent");
    if (!root) return null;

    for (let attempts = 0; attempts < 8; attempts += 1) {
      const numInputs = [...root.querySelectorAll("input[name='stockingNum']")];
      const dayInputs = [...root.querySelectorAll("input[name='stockingDay']")];
      if (numInputs[index] && dayInputs[index]) {
        return { numInput: numInputs[index], dayInput: dayInputs[index] };
      }

      if (!shouldApply) return null;

      const previousNum = numInputs[index - 1];
      const previousDay = dayInputs[index - 1];
      if ((previousNum && !previousNum.value.trim()) || (previousDay && !previousDay.value.trim())) return null;

      const button = root.querySelector(".J-add-stock");
      if (!button) return null;
      button.click();
      await sleep(180);
    }
    return null;
  }

  function findPropertyBlock(chinese, english) {
    const root = findSectionRoot("customProperties");
    if (!root) return null;
    const blocks = [...root.querySelectorAll(".J-stand-prop")];
    return blocks.find((block) => {
      const label = block.querySelector(".form-label")?.textContent || "";
      const czName = block.getAttribute("cz-name") || "";
      return normalize(label).includes(normalize(chinese)) || normalize(czName).includes(normalize(english));
    });
  }

  function fillSelectOrOther(select, value, block) {
    const option = [...select.options].find((item) => sameOption(value, item.textContent) || sameOption(value, item.getAttribute("cz-html") || ""));
    if (option) {
      select.value = option.value;
      syncSelectAttribute(select);
      dispatchEditableEvents(select);
      return;
    }

    const other = [...select.options].find((item) => item.value === "-1" || normalize(item.textContent).includes("other"));
    if (other) {
      select.value = other.value;
      syncSelectAttribute(select);
      dispatchEditableEvents(select);
      const otherInput = block.querySelector("input.J-prop-other, input[name='industryPropOtherValue']");
      if (otherInput) {
        otherInput.disabled = false;
        otherInput.style.display = "";
        applyValue(otherInput, value, "Other");
      }
    }
  }

  function sameOption(value, label) {
    const a = normalize(value).replace(/pixels?/g, "").replace(/inch|英寸/g, "");
    const b = normalize(label).replace(/pixels?/g, "").replace(/inch|英寸/g, "");
    return Boolean(a && b && (a === b || a.includes(b) || b.includes(a)));
  }

  function isFillableKnownControl(control) {
    return control && canFill(control) && !control.disabled;
  }

  function parseBulkText(text) {
    const trimmed = text.trim();
    if (!trimmed) return [];

    const jsonEntries = parseJsonEntries(trimmed);
    if (jsonEntries.length) return jsonEntries;

    const entries = [];
    let current = null;
    let currentSection = "";
    for (const rawLine of trimmed.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) continue;
      if (line.startsWith("#")) {
        currentSection = cleanSectionName(line);
        current = null;
        continue;
      }

      const bullet = line.replace(/^[-*•]\s*/, "");
      const pair = bullet.match(/^([^:：=]{1,60})\s*[:：=]\s*(.*)$/);
      if (pair) {
        current = { key: pair[1].trim(), value: pair[2].trim(), section: currentSection };
        entries.push(current);
      } else if (current && looksLikeContinuation(current.key)) {
        current.value = `${current.value}\n${bullet}`.trim();
      }
    }

    return entries.filter((entry) => entry.key && entry.value);
  }

  function cleanSectionName(line) {
    return String(line || "")
      .replace(/^#+\s*/, "")
      .replace(/^[-–—]+\s*/, "")
      .replace(/[（(].*?[）)]/g, "")
      .trim();
  }

  function parseJsonEntries(text) {
    if (!/^[{[]/.test(text)) return [];
    try {
      const parsed = JSON.parse(text);
      const flat = [];
      flattenJson(parsed, "", flat);
      return flat;
    } catch {
      return [];
    }
  }

  function flattenJson(value, prefix, out) {
    if (Array.isArray(value)) {
      out.push({ key: prefix, value: value.join("; ") });
      return;
    }

    if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) {
        flattenJson(child, prefix ? `${prefix}.${key}` : key, out);
      }
      return;
    }

    out.push({ key: prefix, value: String(value ?? "") });
  }

  function expandEntries(entries) {
    const expanded = [];
    for (const entry of entries) {
      if (isMultiValueKey(entry.key)) {
        const values = splitValues(entry.value);
        if (entry.key.includes("关键词") || /keywords?/i.test(entry.key)) {
          values.forEach((value, index) => expanded.push({ ...entry, key: `${entry.key}${index + 1}`, value }));
        } else {
          expanded.push(entry);
        }
      } else {
        expanded.push(entry);
      }
    }
    return expanded;
  }

  function splitValues(value) {
    return value
      .split(/\r?\n|[;；]/)
      .map((part) => part.replace(/^[-*•]\s*/, "").trim())
      .filter(Boolean);
  }

  function isMultiValueKey(key) {
    const normalized = normalize(key);
    return MULTI_VALUE_KEYS.some((item) => normalized.includes(normalize(item)));
  }

  function looksLikeContinuation(key) {
    return isMultiValueKey(key) || /详情|description|overview|答案|answer/i.test(key);
  }

  function getAliases(key) {
    const base = key.replace(/\d+$/, "").replace(/价格区间\d+/, "价格区间");
    const aliases = [key, base];

    for (const [canonical, values] of KEY_ALIASES.entries()) {
      const normalizedKey = normalize(base);
      if (normalize(canonical) === normalizedKey || values.some((value) => normalizedKey === normalize(value))) {
        aliases.push(canonical, ...values);
      }
    }

    if (/价格区间\d+起订量/.test(key)) aliases.push("最小起订量", "MOQ", "采购数量");
    if (/价格区间\d+单价/.test(key)) aliases.push("单价", "price", "US$");
    if (/价格区间\d+库存/.test(key)) aliases.push("库存", "stock");

    return [...new Set(aliases)];
  }

  function canFill(control) {
    const type = (control.getAttribute("type") || "").toLowerCase();
    return !["file", "button", "submit", "reset", "image"].includes(type);
  }

  function applyValue(control, value, key) {
    const type = (control.getAttribute("type") || "").toLowerCase();
    if (type === "checkbox" || type === "radio") {
      fillChoice(control, value);
      return;
    }

    if (control.tagName === "SELECT") {
      fillSelect(control, value);
      return;
    }

    if (control.isContentEditable) {
      control.focus();
      control.textContent = fitControlValue(control, value);
      dispatchEditableEvents(control);
      return;
    }

    const fittedValue = fitControlValue(control, value);

    if (isRichModuleTextarea(control)) {
      fillByUserLikeTextInput(control, fittedValue);
      return;
    }

    control.focus();
    setNativeValue(control, fittedValue);
    dispatchEditableEvents(control);

  }

  function fitControlValue(control, value) {
    const text = String(value ?? "");
    const maxLength = Number(control.getAttribute("maxlength") || control.maxLength || -1);
    if (Number.isFinite(maxLength) && maxLength > 0 && text.length > maxLength) {
      return text.slice(0, maxLength);
    }
    return text;
  }

  function isRichModuleTextarea(control) {
    return control.matches?.("#highlightRoot textarea, #faqRoot textarea");
  }

  function fillByUserLikeTextInput(control, value) {
    control.focus();
    control.select?.();
    const inserted = document.execCommand?.("insertText", false, value);
    if (!inserted) setNativeValue(control, value);
    dispatchEditableEvents(control);
  }

  function applyModuleTextareaValue(control, value) {
    control.focus();
    setNativeValue(control, fitControlValue(control, value));
    dispatchEditableEvents(control);
  }

  function setNativeValue(control, value) {
    const prototype = control instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
    if (setter) setter.call(control, value);
    else control.value = value;
    if (control instanceof HTMLTextAreaElement) {
      control.defaultValue = value;
      control.textContent = value;
    } else if (control instanceof HTMLInputElement) {
      control.defaultValue = value;
      control.setAttribute("value", value);
    }
  }

  function fillSelect(select, value) {
    const normalizedValue = normalize(value);
    const normalizedAliases = unitAliases(value).map(normalize);
    const option = [...select.options].find((item) => {
      const optionValues = [
        item.textContent,
        item.value,
        item.getAttribute("cz-unit"),
        item.getAttribute("cz-html")
      ].map(normalize);
      return optionValues.some((optionValue) =>
        optionValue && (optionValue.includes(normalizedValue) || normalizedValue.includes(optionValue) || normalizedAliases.includes(optionValue))
      );
    });
    if (option) {
      select.value = option.value;
    } else {
      const other = [...select.options].find((item) => item.value === "99" || item.value === "-1" || normalize(item.textContent).includes("其他") || normalize(item.textContent).includes("other"));
      if (other) select.value = other.value;
    }
    syncSelectAttribute(select);
    dispatchEditableEvents(select);
  }

  function syncSelectAttribute(select) {
    for (const option of select.options) {
      if (option.value === select.value) {
        option.selected = true;
        option.setAttribute("selected", "selected");
      } else {
        option.selected = false;
        option.removeAttribute("selected");
      }
    }
  }

  function unitAliases(value) {
    const normalizedValue = normalize(value);
    const aliases = {
      meter: ["米", "m"],
      metre: ["米", "m"],
      meters: ["米", "m"],
      metres: ["米", "m"],
      piece: ["个", "pcs", "pc"],
      pieces: ["个", "pcs", "pc"],
      pcs: ["个", "piece", "pieces"],
      pc: ["个", "piece", "pieces"],
      kilogram: ["千克", "kg"],
      kilograms: ["千克", "kg"],
      kg: ["千克", "kilogram"],
      carton: ["箱"],
      box: ["箱"],
      boxes: ["箱"],
      set: ["套"],
      sets: ["套"],
      roll: ["卷"],
      rolls: ["卷"]
    };
    return aliases[normalizedValue] || [];
  }

  function fillChoice(control, value) {
    const type = (control.getAttribute("type") || "").toLowerCase();
    const normalizedValue = normalize(value);
    const nearby = normalize(getNearbyText(control));
    const shouldCheck = ["是", "yes", "true", "1"].some((yes) => normalizedValue.includes(normalize(yes))) || nearby.includes(normalizedValue);
    if (control.checked !== shouldCheck) {
      control.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
    control.checked = shouldCheck;
    if (type === "radio") syncRadioGroupAttribute(control);
    else syncCheckedAttribute(control, shouldCheck);
    dispatchEditableEvents(control);
  }

  function syncCheckedAttribute(control, checked = control.checked) {
    control.checked = checked;
    control.defaultChecked = checked;
    if (checked) control.setAttribute("checked", "checked");
    else control.removeAttribute("checked");
  }

  function syncRadioGroupAttribute(control) {
    if ((control.getAttribute("type") || "").toLowerCase() !== "radio" || !control.name) {
      syncCheckedAttribute(control);
      return;
    }
    for (const item of document.querySelectorAll(`input[type='radio'][name="${CSS.escape(control.name)}"]`)) {
      syncCheckedAttribute(item, item === control);
    }
  }

  function dispatchEditableEvents(control) {
    control.dispatchEvent(new Event("input", { bubbles: true }));
    control.dispatchEvent(new Event("change", { bubbles: true }));
    control.blur();
  }

  function getNearbyText(control) {
    const parts = [];
    let node = control;
    for (let depth = 0; depth < 4 && node; depth += 1) {
      const previous = node.previousElementSibling;
      if (previous) parts.push(previous.textContent);
      const parent = node.parentElement;
      if (parent) {
        parts.push(parent.getAttribute("aria-label"));
        parts.push(parent.querySelector("label")?.textContent);
        parts.push(parent.textContent?.slice(0, 220));
      }
      node = parent;
    }
    return compact(parts).join(" ");
  }

  function isVisible(element) {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }

  function isDisplayed(element) {
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[：:：*＊()（）\[\]【】,，;；。.\-_/\\]/g, "");
  }

  function compact(values) {
    return values
      .map((value) => String(value || "").trim())
      .filter(Boolean);
  }
})();
