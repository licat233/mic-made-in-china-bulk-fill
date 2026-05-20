---
name: mic-made-in-china-fill
description: Generate paste-ready product upload text for the Made-in-China Bulk Fill Chrome extension. Use when the user wants an AI/Hermes agent to turn product specs, catalog copy, supplier notes, spreadsheets, PDFs, images, or rough product descriptions into the exact `字段名：内容` format that can be pasted into the Made-in-China product upload autofill plugin.
---

# Made-in-China Bulk Fill Text

## Output Contract

Produce plain text only, using one field per line.

The Chrome extension expects Chinese field names. Do not output Markdown tables, JSON, bullets, explanations, or code fences unless the user explicitly asks for them.

Use `# 板块名` comment lines to group fields by section. The Chrome extension uses these section headings to limit fallback field matching to the corresponding Made-in-China DOM section, so keep the standard section names when possible:

```text
# 基本信息
产品名称：Dynamic Full Color LCD Electronic Shelf Label
产品型号：HM-2026-02

# 产品亮点
产品亮点1：Full-color LCD display supports dynamic pricing.
```

Use semicolons for list fields:

```text
关键词：Full Color ESL; LCD Price Tag; Inventory Management Display
支付方式：L/C; T/T; Paypal
```

Keep values concise enough for product form inputs. Preserve English product-facing copy for Made-in-China listings unless the user asks for Chinese.

## Plugin Limitations

The following fields **cannot** be auto-filled by the plugin and require manual handling:

- **产品展示** — Image/video upload. Max 6 images + 1 video/GIF. Not supported by the plugin.
- **运费信息** — Destination region (`region4estimate`) selector only. The freight template is auto-selected to the default recommended option.
- **产品详情** — Rich text editor with module-based layout. The plugin can fill plain text into the page's detail submission fields; complex layouts with images/videos must still be edited manually.

## Core Workflow

1. Extract all available product facts from the user's source material.
2. Normalize facts into the supported field names below.
3. Infer reasonable marketing copy only when the source clearly supports it.
4. Leave unknown fields out instead of fabricating precise values such as price, stock, dimensions, HS code, weight, certification, or warranty.
5. Return the paste-ready text block.

## Supported Fields

Always use the Made-in-China page's visual order below, grouped by section. Omit any section or field that the source material does not provide. Keep section headings in this order because the Chrome extension uses them for DOM-scoped matching.

**Strict section rules:**

- Use the exact section headings shown below. Do not rename them.
- Do not output legacy headings such as `# 样品交易设置`, `# 其它信息`, or place `# 产品详情` before `# FAQ`.
- If a section has no fillable fields, omit the whole section instead of outputting an empty placeholder line.
- `# FAQ` must appear before `# 产品详情`.
- `# 样品单交易设置` and `# 其他信息设置` are the only accepted names for those two sections.
- Prefer exact page option text for units, for example `计量单位：米` and `样品单位：米`, not `Meter`.
- Keep `样品描述` within 45 characters.
- Do not output `Package Gross Weight：` when the value is unknown or empty.
- In `# 产品属性`, the required standard fields are: `认证`, `功率`, `发光颜色`, `电压`, `防护等级`, `运输包装`, `规格`, `商标`, `原产地`. Always output these fields when generating paste-ready Made-in-China product information.

```text
# 基本信息
产品名称：
中心词：
关键词：
产品分组：
产品型号：

# 产品展示
# 插件不自动上传图片/视频；默认省略产品展示字段。

# 产品亮点
产品亮点1：
产品亮点2：
产品亮点3：
产品亮点4：
产品亮点5：
产品亮点6：
产品亮点7：
产品亮点8：
产品亮点9：
产品亮点10：

# 产品属性
# -- 标准属性（页面上的下拉选择框或多选框）
适用门店：
安装方式：
内容支持：
显示颜色：
分辨率：
屏幕尺寸：
显示技术：
认证：
功率：
发光颜色：
电压：
防护等级：
运输包装：
规格：
商标：
原产地：

# -- 自定义属性（英文名称的文本输入框，页面可自动添加行）
Logic：
Weight：
Update Efficiency：
Work Efficiency：
Technology：
Power Supply Mode：

# 规格管理
# 本板块对应页面 data-anchor="specsMng"，只放规格组字段。
规格名称：
规格值：
规格2名称：
规格2值：
规格3名称：
规格3值：

# FOB价格设置
# -- 价格类型由页面选择，插件根据提供的数据自动选择对应的单选模式：
# -- 一口价销售（模式0）：规格最小起订量、规格商品编码、规格库存、规格单价
# -- 按采购数量-阶梯价销售（模式1）：价格区间N起订量/单价（所有区间共享1个库存）
# -- 按采购数量-区间价销售（模式2）：区间价最小起订量、区间价最低价、区间价最高价、区间价库存
规格最小起订量：
规格商品编码：
规格库存：
规格单价：
价格区间1起订量：
价格区间1单价：
价格区间2起订量：
价格区间2单价：
价格区间3起订量：
价格区间3单价：
价格区间4起订量：
价格区间4单价：
价格区间5起订量：
价格区间5单价：
库存：
区间价最小起订量：
区间价最低价：
区间价最高价：
区间价库存：

# 计量单位
计量单位：

# 包裹尺寸
Package Gross Weight：
单个包裹内产品数量：
单个包裹长：
单个包裹宽：
单个包裹高：
单个包裹毛重：

# 运费信息
# 插件默认选择官方物流推荐模板；一般不需要输出字段。

# 发货效率信息
港口：
发货期数量：
发货期时间：
发货期数量2：
发货期时间2：
发货期数量3：
发货期时间3：

# 样品单交易设置
提供样品：
样品单价：
样品单位：
单次最多拿样数量：
样品描述：

# 其他信息设置
支付方式：
产量：
海关编码：

# FAQ
FAQ问题1：
FAQ答案1：
FAQ问题2：
FAQ答案2：
FAQ问题3：
FAQ答案3：

# 产品详情
产品详情：
```

### Custom Attributes

The extension also maps existing custom attributes on the page. If the source has a product attribute whose label already appears on the Made-in-China page, output it exactly as the label, for example:

```text
Battery Life：5 years
Waterproof Rating：IP65
Connectivity：2.4G WiFi
```

**Custom Attribute Rules:**
- Maximum 15 custom attributes per product
- Each attribute value must not exceed 50 characters
- Attribute names must be in English only — Chinese characters are NOT allowed in attribute name fields
- Fill as many relevant attributes as product information supports

## Field Rules

### Product Name

Write an English B2B listing title. Aim for 8-12 words when possible. Include product type and main use. Avoid phone numbers, email, company slogans, unsupported certifications, and keyword stuffing.

**Input type:** Textarea (`name="prodName"`), max 160 characters.

### Center Words

Use 3-6 short core words from the product name, separated by semicolons:

```text
中心词：label; shelf; lcd; retail; display
```

### Keywords

Use up to 10 English keyword phrases. Put the most important three first. Use 2-4 words per phrase where possible. Separate with semicolons. The current Made-in-China page supports 10 keyword slots.

**Input type:** Multiple textarea fields (`name="prodKeyword"`). The page starts with 1 slot and has an "添加关键词" button to add more.

### Highlights

Write benefit-oriented English highlights, one sentence each. Up to 20 highlights supported. The page starts with 3 textarea slots (`class="highlight-text"`) and has a "+ 添加亮点" button to add more. Fill as many slots as product features and benefits support. Avoid claims that require proof unless the source provides them.

### Product Attributes — Standard

These appear as dropdown selects (`class="J-prop-select"`) or checkboxes (`name="propertyValue"`) on the page. Use exact option text when known because the plugin matches page options by label:

For this Made-in-China LED strip category, these standard fields are required and should be present in every paste-ready output:

```text
认证：
功率：
发光颜色：
电压：
防护等级：
运输包装：
规格：
商标：
原产地：
```

Use product-source values first. If the source only implies the value, choose the closest page option conservatively. `电压` is required but single-select, so choose one primary/default option such as `12V`; list additional voltage variants in `# 规格管理`.

- `适用门店`: `Electronics Store; Convenience Store; Supermarket; Pharmacies; Other`
- `安装方式`: known options include `Slot-in`, `Magnetic Mount`, `Adhesive Back`, `Other`; use a precise custom value if the source says another mounting method.
- `内容支持`: known options include `QR Code Display`, `Multi-language Text`, `Price + Barcode`.
- `显示颜色`: known options include `Full Color`, `3-Color (BWR)`, `Black & White`.
- `显示技术`: known options include `LCD`, `LED Segment`, `E-Ink Carta`.
- LED strip/light category fields may include:
  - `认证` (checkbox): known options include `CE`, `RoHS`, `FCC`, `EMC`, `LVD`, `CCC`, `FDA`, `GS`, `SAA`, `VDE`.
  - `功率` (select): known options include `<6W`, `6-10W`, `11-15W`, `16-20W`, `21-30W`, `>30W`.
  - `发光颜色` (select): known options include `White`, `Warm White`, `Red`, `Blue`, `Green`, `Yellow`, `Changeable`; use exact page option text when known.
  - `电压` (select): known options include `12V`, `36V`, `110V`, `220V`.
  - `防护等级` (select): known options include `IP33`, `IP44`, `IP54`, `IP65`, `IP66`, `IP67`, `IP68`.

For single-select standard attributes such as `电压`, output only one page option. If the product has multiple variants such as 12V and 24V, put those variants in `# 规格管理` as `规格名称：Voltage` and `规格值：12V; 24V`. Do not output `电压：12V; 24V`.

For resolution and screen size, output the actual value from the source. If it does not match a built-in option, the plugin will select `Other` and fill the custom value.

The plugin can also fill other current-page Made-in-China standard attributes by exact field label. If a category page shows a standard attribute, output its label exactly as shown.

### Product Attributes — Custom

These are English-name text input pairs (`name="customPropName"` + `name="customPropValue"`) with an "添加自定义属性" button to add more rows. Do not put the required fixed fields `运输包装`, `规格`, `商标`, or `原产地` here; keep them under `# -- 标准属性`.

### Specification Management

Use these fields when the Made-in-China "规格管理" section should be filled. **MIC recommends filling at least one spec group to improve buyer shopping experience. Maximum 300 spec combinations allowed.**

Each spec group has a name input (`name="specName"`) and value input (`name="specValue"`), with an "添加规格值" button for values and "添加规格" button for new groups.

```text
# 规格管理
规格名称：Size
规格值：Single Screen; Double Screen
```

For multiple spec groups, use numbered fields. The plugin will click "添加规格" to create new groups as needed:

```text
规格1名称：Size
规格1值：Single Screen; Double Screen
规格2名称：Color
规格2值：Black; White; Silver
规格3名称：Material
规格3值：Plastic; Metal
```

If the listing uses spec-based fixed price fields (visible under "一口价" mode in FOB价格设置), output only values provided by the source:

```text
规格最小起订量：10
规格库存：100000
规格单价：32.13
```

### FOB Price Settings

The page has three pricing modes selected by radio buttons (`name="fobPriceType"`): Fixed price (一口价, value='0'), Ladder price (阶梯价, value='1'), Reference price (区间价, value='2'). The plugin detects which mode to use based on the fields provided in the source data:

- If `规格最小起订量` / `规格单价` / `规格库存` / `规格商品编码` are present → selects **一口价** mode
- If `价格区间1起订量` / `价格区间1单价` / `价格区间1库存` are present → selects **阶梯价** mode
- If `区间价最低价` / `区间价最高价` / `区间价最小起订量` / `区间价库存` are present → selects **区间价** mode

Only output price, stock, package dimensions, weight, port, sample, payment, production capacity, or HS code when provided by the user/source. Do not invent them.

Use numbers without currency symbols for price fields:

```text
价格区间1起订量：10
价格区间1单价：32.13
```

### Unit

The page has a dropdown select (`name="prodMinimumOrderTypeOfLadder"` or similar) with options: 个, 平方英尺, 吨, 码, 千克, 包, 箱, 英尺, 米, 双, 令, 卷, 套, 其他. Prefer exact page option text such as `米` instead of `Meter` when possible. The plugin also maps common English unit aliases.

### Package Dimensions

**Input type:** Text inputs (`name="packProdNum"`, `packDepth`, `packWidth`, `packHeight"`, `grossWeight"`). Dimensions are in cm, weight in kg.

### Delivery Efficiency

The "发货效率信息" section has two text inputs per row (`name="stockingNum"` for quantity, `name="stockingDay"` for days) with an "添加数量区间" button (max 3 rows). Use `发货期数量` + `发货期时间` for the first row, or add numeric suffixes for additional rows:

```text
发货期数量：100
发货期时间：15
发货期数量2：1000
发货期时间2：20
```

### Port

Always fill `港口：Huangpu` unless the source specifies another port. This is a text input (`class="J-port"`).

### Sample

The page has a radio button (`name="provideMode"`, values 1/0) to enable/disable sample fields. When enabled, the following text/select inputs become active: `samplesPrice`, `samplesPricePacking` (select), `maxSamplesCount`, `samplesDesc`.

**Note:** The plugin switches `提供样品` to `是` when requested and then fills the sample price, unit, max quantity, and description fields.

The `samplesPricePacking` select uses value codes: `0` = 个, `10` = 平方英尺, `11` = 吨, etc. Output the unit name and the plugin will select the correct value.

Keep `样品描述` within 45 characters because the page input has a 50-character limit and the plugin should avoid visible truncation.

For LED strip samples, a safe concise example is:

```text
样品描述：COB strip sample, 1m, 12V/24V
```

### Payment Methods

The page shows checkboxes (`name="prodPaymentType"`) with options: L/C, T/T, D/P, Western Union, Paypal, Money Gram, Others. Selecting "Others" enables a custom text input. Use semicolons to specify multiple methods:

```text
支付方式：L/C; T/T; Paypal
```

### FAQ

Create short buyer-facing FAQs from real product information. Keep answers specific but safe. If facts are missing, omit the FAQ fields.

The page starts with 3 FAQ pairs (question + answer textarea, `class="atom-faq__textarea"`) and has a "+ 添加FAQ" button to add more.

### Product Details

Write concise English overview copy. Plain text is safest for the current plugin. Keep it to 1-3 short paragraphs unless the user asks for a long description.

The page uses a rich text editor with Normal (普通编辑) and Pro (编辑器Pro) modes. The plugin fills the plain text/HTML submission fields (`newDescStr` / `newDescHtml`) when present; complex layouts with images/videos must be edited manually.

## Example Output

```text
# 基本信息
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

# 运费信息
# 插件默认选择官方物流推荐模板；一般不需要输出字段。

# 发货效率信息
港口：Huangpu
发货期数量：100
发货期时间：15

# 样品单交易设置
提供样品：是
样品单价：32.13
样品单位：个
单次最多拿样数量：10
样品描述：COB strip sample, 1 meter, 12V/24V

# 其他信息设置
支付方式：L/C; T/T; Paypal
产量：5000PCS/Month
海关编码：8528729000

# FAQ
FAQ问题1：What is the lead time?
FAQ答案1：Please contact us for current lead time based on order quantity.
FAQ问题2：Can you customize the screen size?
FAQ答案2：Yes, we offer customization for bulk orders over 5,000 units.

# 产品详情
产品详情：10.1 Inch Wireless Electronic Shelf Labels help retailers update prices and product information efficiently. The full-color LCD display supports price, barcode, and promotional content for supermarkets, convenience stores, and electronics stores.
```

## Quality Check

Before final output:

- Confirm `# 板块名` comment lines group fields by section.
- Confirm the section order is exactly: 基本信息, 产品展示, 产品亮点, 产品属性, 规格管理, FOB价格设置, 计量单位, 包裹尺寸, 运费信息, 发货效率信息, 样品单交易设置, 其他信息设置, FAQ, 产品详情.
- Confirm legacy section names are not used: `样品交易设置`, `其它信息`.
- Confirm `FAQ` appears before `产品详情`.
- Confirm every field line uses `：`.
- Confirm list fields use semicolons.
- Confirm no unsupported facts were invented.
- Confirm fields unknown from the source are omitted.
- Confirm required product attribute fields are included: `认证`, `功率`, `发光颜色`, `电压`, `防护等级`, `运输包装`, `规格`, `商标`, `原产地`.
- Confirm there is no commentary around the paste-ready block.
- Confirm unsupported fields (product images, destination region selector) are omitted.
- Confirm sample description is 45 characters or shorter.
