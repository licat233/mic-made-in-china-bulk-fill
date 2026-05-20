# Made-in-China Bulk Fill

这是一个本地 Chrome 插件雏形，用来在 Made-in-China 产品上传/修改页面批量填充资料。

## 安装

1. 打开 Chrome，进入 `chrome://extensions/`
2. 打开右上角“开发者模式”
3. 点击“加载已解压的扩展程序”
4. 选择这个文件夹：

   `/Users/licat/chrome_extensions/made-in-china-bulk-fill`

## 使用

1. 打开 Made-in-China 产品上传或修改页面
2. 点击浏览器右上角插件图标
3. 粘贴产品资料，格式使用 `字段名：内容`
4. 点击“预览匹配”检查能匹配多少字段
5. 点击“填充当前页面”

也可以先复制好整段资料，然后点“读取剪贴板并填充”。

## 推荐资料格式

```text
产品名称：Dynamic Full Color LCD Electronic Shelf Label for Retail Inventory Management
关键词：Full Color ESL; LCD Price Tag; Inventory Management Display
产品型号：HM-2026-02
产品亮点1：Full-color LCD display supports dynamic price, image, and barcode updates.
规格名称：Size
规格值：Single Screen; Double Screen
港口：Huangpu
样品单价：32.13
支付方式：L/C; T/T; Paypal
```

插件也支持 JSON，但普通文本最方便复制粘贴。

## 注意

- 上传图片、视频这类文件字段不能自动从文本里填充。
- 如果页面里有自定义下拉框、标签输入框或弹窗选择器，插件会尽量触发输入事件；个别字段可能仍需要人工确认。
- 建议先用“预览匹配”，确认无误后再填充。
