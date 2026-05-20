# Made-in-China Bulk Fill Plugin Field Map

The Chrome extension prioritizes these selectors when filling the product upload page. Keep generated product text grouped in the Made-in-China page's visual order:

1. 基本信息
2. 产品展示
3. 产品亮点
4. 产品属性
5. 规格管理
6. FOB价格设置
7. 计量单位
8. 包裹尺寸
9. 运费信息
10. 发货效率信息
11. 样品单交易设置
12. 其他信息设置
13. FAQ
14. 产品详情

| Field | Page target |
| --- | --- |
| # 基本信息 | `.bd.J-bd:has([data-anchor='prodName'])` |
| 产品名称 | `textarea[name='prodName']` |
| 关键词 | `textarea[name='prodKeyword']` list, max 10 slots |
| 产品型号 | `input[name='prodModel']` |
| # 产品展示 | image/video upload, not auto-filled by the plugin |
| # 产品亮点 | `#highlightRoot` |
| 产品亮点1-20 | `#highlightRoot textarea.highlight-text`; plugin clicks "+ 添加亮点" as needed |
| # 产品属性 | `.bd.J-properties-wrap.J-bd[data-anchor='prodAttrs']` |
| 适用门店 | standard property checkbox block |
| 安装方式 | standard property select block |
| 内容支持 | standard property select block |
| 显示颜色 | standard property select block |
| 分辨率 | standard property select/custom value |
| 屏幕尺寸 | standard property select/custom value |
| 显示技术 | standard property select block |
| Current category standard attributes | `.J-stand-prop` by Chinese label or `cz-name` |
| 认证 | standard property checkbox block |
| 功率 | standard property select block |
| 发光颜色 | standard property select block |
| 电压 | standard property select block |
| 防护等级 | standard property select block |
| 运输包装 | `input[name='prodPacking']` |
| 规格 | `input[name='prodStandard']` |
| 商标 | `input[name='prodTrademark']` |
| 原产地 | `input[name='prodOrigin']` |
| Existing custom attributes | `input[name='customPropName']` + matching `customPropValue` |
| # 规格管理 | `.bd.J-bd.spec-mng[data-anchor='specsMng']`; only spec group fields belong here |
| 规格名称 | `input[name='specName']` |
| 规格值 | `input[name='specValue']` list |
| # FOB价格设置 | `.bd.J-bd[data-anchor='skuFob']` |
| 规格最小起订量 | `input[name='skuMinOrder_one']` |
| 规格商品编码 | `input[name='skuCode_one']` |
| 规格库存 | `input[name='skuStock_one']` |
| 规格单价 | `input[name='skuPrice_one']` |
| 价格区间N起订量 | `#JminOrderOfLadder{N-1}` |
| 价格区间N单价 | `#JpriceNewOfLadder{N-1}` |
| 价格区间1库存 | `#prodStockNewOfLadder0` |
| # 计量单位 | `.bd.J-bd[data-anchor='unit']` |
| 计量单位 | unit selects for ladder/base/negotiate modes: `prodMinimumOrderTypeOfLadder`, `prodMinimumOrderTypeOfBase`, `prodMinimumOrderTypeOfNegotiate` |
| # 包裹尺寸 | `.bd.J-bd[data-anchor='package']` |
| 单个包裹内产品数量 | `input[name='packProdNum']` |
| 单个包裹长 | `input[name='packDepth']` |
| 单个包裹宽 | `input[name='packWidth']` |
| 单个包裹高 | `input[name='packHeight']` |
| 单个包裹毛重 | `input[name='grossWeight']` |
| # 运费信息 | `.bd.J-bd[data-anchor='shipping']`; destination region only, plugin picks the default recommended freight template |
| # 发货效率信息 | `.bd.J-bd[data-anchor='sent']` |
| 港口 | `input.J-port` |
| # 样品单交易设置 | `.bd.J-bd[data-anchor='sample']` |
| 提供样品 | `input[name='provideMode']` |
| 样品单价 | `input[name='samplesPrice']` |
| 样品单位 | `select[name='samplesPricePacking']` |
| 单次最多拿样数量 | `input[name='maxSamplesCount']` |
| 样品描述 | `input[name='samplesDesc']` |
| # 其他信息设置 | `.bd.J-bd[data-anchor='other']` |
| 支付方式 | `input[name='prodPaymentType']` checkboxes |
| 产量 | `input[name='prodProductivity']` |
| 海关编码 | `input[name='hsCode']` |
| # FAQ | `#faqRoot` |
| FAQ问题/答案 | `#faqRoot textarea` |
| # 产品详情 | `.prod-desc[data-anchor='prodDescript']` |
| 产品详情 | detail submission fields `textarea[name='newDescStr']` / `textarea[name='newDescHtml']`, with legacy `#detailRoot` fallback |

Use this reference only when debugging why a generated field did not fill.
