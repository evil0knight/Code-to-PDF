# Code-to-PDF
最近在使用企鹅家的IMA.Copilot的时候发现知识库不能上传.C.H文件，所以根据别的开源，做了代码转PDF的工具   


# 代码转 PDF

将您的源代码转换为格式精美、带语法高亮的 PDF 文档，支持多种编程语言和主题。

## 功能特性

### 双输入模式

| 模式 | 说明 |
|------|------|
| **文本输入** | 直接在编辑器中粘贴或输入代码 |
| **文件上传** | 上传单个文件或整个文件夹 |

### 文件上传功能

- **拖放上传**：只需将文件或文件夹拖入上传区域
- **多文件选择**：一次上传多个文件
- **文件夹上传**：上传整个目录并保留文件夹结构
- **自动语言检测**：自动识别 20+ 种文件扩展名
- **文件管理**：在转换前查看、重新排序（拖动排序）和删除文件
- **批量转换**：一键转换所有已上传的文件

### PDF 生成选项

- **分离 PDF**：为每个文件生成单独的 PDF
- **合并 PDF**：将所有文件合并为一个 PDF，带文件分隔符
- **自定义保存位置**：选择 PDF 保存位置并保留文件夹结构
- **语法高亮**：11 种精美主题可供选择

### 支持的编程语言

**系统编程**：C、C++、Rust、Go、ARM 汇编、x86 汇编

**Web 开发**：JavaScript、TypeScript、HTML、CSS、PHP

**通用语言**：Python、Java、Kotlin、Swift、C#、R、JSON

## 使用方法

### 文本输入模式

1. 选择 **Text Input（文本输入）** 标签页
2. 在文本框中输入或粘贴您的代码
3. 从下拉菜单中选择编程语言
4. 选择语法高亮主题
5. 输入文件名（可选）
6. 点击 **Print（打印）** 生成 PDF

### 文件上传模式

1. 选择 **File Upload（文件上传）** 标签页
2. 通过以下方式上传文件：
   - 将文件/文件夹拖放到上传区域
   - 点击 **Select Files（选择文件）** 上传单个文件
   - 点击 **Select Folder（选择文件夹）** 上传整个目录
3. 在文件列表中查看已上传的文件
4. 拖动文件以重新排序（影响合并顺序）
5. 选择语法高亮主题
6. 选择转换模式：
   - **Separate PDFs（分离 PDF）**：每个文件生成独立的 PDF
   - **Merge to One PDF（合并为一个 PDF）**：所有文件合并并带分隔符
7. （可选）勾选 **Choose save location（选择保存位置）** 指定 PDF 保存位置
8. 点击 **Convert to PDF（转换为 PDF）**

## 支持的文件扩展名

```
.c, .cpp, .cc, .cxx, .h, .hpp (C/C++)
.js, .ts, .json (JavaScript/TypeScript)
.html, .css, .php (Web)
.py (Python)
.r (R)
.cs (C#)
.rs (Rust)
.go (Go)
.java (Java)
.kt (Kotlin)
.swift (Swift)
.s, .asm (汇编)
```

## 主题

### 深色主题
- Atom One Dark
- Visual Studio Code
- Nord
- Monokai
- Github Dark
- Github Dark Dimmed

### 浅色主题
- Atom One Light
- Default
- Xcode
- Intellij Light
- Github Light

## 浏览器兼容性

| 功能 | Chrome | Edge | Safari | Firefox |
|------|--------|------|--------|---------|
| 文本输入 | ✅ | ✅ | ✅ | ✅ |
| 文件上传 | ✅ | ✅ | ✅ | ✅ |
| 文件夹上传 | ✅ | ✅ | ⚠️ | ⚠️ |
| 自定义保存位置 | ✅ | ✅ | ❌ | ❌ |

> **注意**：自定义保存位置功能需要 File System Access API，目前仅在基于 Chromium 的浏览器（Chrome、Edge）中支持。

## 技术栈

- **highlight.js** - 语法高亮
- **jsPDF** - PDF 生成
- **html2canvas** - HTML 转图像
- **File System Access API** - 自定义保存位置

## 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/tarikjaber/Code-to-PDF.git
```

2. 在浏览器中打开 `index.html`

无需构建过程或依赖安装！

## 常见问题

**问：为什么我的 PDF 没有保存到选定的文件夹？**
答：自定义保存位置功能需要 File System Access API，该功能仅在基于 Chromium 的浏览器（Chrome、Edge）中可用。请使用这些浏览器以使用此功能。

**问：可以上传文件夹吗？**
答：可以！点击 "Select Folder（选择文件夹）" 按钮或将整个文件夹拖入上传区域。保存时将保留文件夹结构。

**问：分离 PDF 和合并 PDF 模式有什么区别？**
答：分离模式为每个文件创建一个 PDF，而合并模式将所有文件合并到一个 PDF 中，并使用清晰的分隔符显示文件路径。

**问：如何在转换前重新排序文件？**
答：只需在文件列表中拖放文件即可。顺序会影响合并 PDF 中的文件顺序。

**问：支持哪些文件类型？**
答：我们支持 20+ 种编程语言文件扩展名。不支持的文件会在上传时自动跳过。

## 许可证

MIT License

## 贡献

欢迎贡献！可以随时提交问题或拉取请求。

## 致谢

原始项目由 [Tarik Jaber](https://github.com/tarikjaber/Code-to-PDF) 创建

扩展了文件上传功能和批量处理能力。

