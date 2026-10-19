<div align="center">

# GitHub Desktop 简体中文汉化

**不注入 · 不打包 · 不联网 —— 四层字面量替换 + 双运行时兜底，一条命令把 GitHub Desktop 变成中文。**

[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-0078D4?style=flat-square)]()
[![PowerShell](https://img.shields.io/badge/PowerShell-5.1%2B%20%7C%207-5391FE?style=flat-square)]()
[![No Node.js](https://img.shields.io/badge/Node.js-not%20required-3fb950?style=flat-square)]()
[![Desktop](https://img.shields.io/badge/GitHub%20Desktop-3.x-58a6ff?style=flat-square)]()
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)]()

[快速开始](#-快速开始) · [工作原理](#-工作原理) · [架构详解](docs/ARCHITECTURE.md) · [命令行](#-命令行参数) · [贡献词条](#-贡献词条) · [FAQ](#-faq)

</div>

![效果截图](docs/images/screenshot.png?v=2)

<p align="center"><em>GitHub Desktop 3.6.7 —— 菜单栏、侧栏、提交区、建议卡片全部中文</em></p>

---

## 为什么做这个

GitHub Desktop 官方**从未提供中文语言包**，界面文案全部硬编码在 Electron 的资源里。网上的汉化补丁大多只支持某个固定版本、装完还容易被自动更新覆盖，也没有卸载方案。

这个项目换了个思路：**把汉化当成一次可重复、可回滚、可维护的源码补丁**。

- 词典与逻辑分离（纯 `英文<TAB>中文` 文本，非程序员也能改）
- 一次替换，四个文件，随时 `-Restore` 回到原版
- 版本更新？重跑一条命令，新版本自动单独备份
- 官方哪天改了文案？`-Scan` 把没覆盖的英文列给你

---

## ✨ 特性

| | |
|---|---|
| **零依赖** | 纯 PowerShell，不需要 Node.js、不需要 Python、不需要联网 |
| **全版本自适应** | 自动扫描 `%LOCALAPPDATA%\GitHubDesktop\app-*`，取最高版本；也可 `-All` 批量处理所有版本 |
| **四层覆盖** | 打包层整串替换 → 模板层正则替换 → DOM 运行时兜底 → 原生菜单运行时钩子 |
| **安全边界** | 词典里没有裸单词，绝不误伤 `e[e.Commit=0]="Commit"` 这类逻辑常量；`pre/code/textarea` 内的代码与 diff 内容一律跳过 |
| **完全可逆** | 原始文件按版本备份到 `backup\app-x.y.z\`，`-Restore` 一键还原 |
| **幂等** | 每次从备份原始文件全量重建，重复运行不会二次替换 |
| **可维护** | `-Scan` 扫描未覆盖英文；`-DryRun` 预演不落盘 |
| **可验证** | 每次运行都报告「命中词条数 / 替换处数 / 模板处数」 |

当前覆盖量：**857 条界面文案 + 116 条菜单项 + 33 条模板正则**，实测 App 3.6.7（Windows）菜单栏、侧栏、提交区、克隆/设置对话框、右键菜单、错误提示全中文。

---

## 🚀 快速开始

### 1. 获取

```bash
git clone https://github.com/<your-name>/github-desktop-zh.git
cd github-desktop-zh
```

或用 Code → Download ZIP 解压。

### 2. 安装

先**完全退出** GitHub Desktop（托盘图标也要退），然后：

```powershell
# Windows PowerShell 5.1 / PowerShell 7 均可
pwsh -File .\一键汉化.ps1
# 没有 pwsh？右键 一键汉化.ps1 →「使用 PowerShell 运行」
```

看到下面这样就成了：

```
== GitHub Desktop 简体中文汉化  v1.0 ==
  界面词条: 857    菜单词条: 116    模板规则: 33

[app-3.6.7]
  renderer.js: 805 条词条 / 808 处 / 模板 32 处
  main.js    : 114 条词条 / 114 处 / 模板 5 处
  备份目录   : .\backup\app-3.6.7
  已部署 zh-cn.js
  已注入 index.html

汉化完成: app-3.6.7
```

打开 GitHub Desktop，收工。

### 3. 还原

```powershell
pwsh -File .\一键汉化.ps1 -Restore
```

---

## 🧠 工作原理

```
         ┌──────────────────────────────────────────────┐
         │  GitHub Desktop (Electron)                    │
         │                                               │
  ① 打包层│  resources/app/renderer.js                    │  857 条整串替换
         │    Ae.createElement("h1",null,"Pull requests")│  -> "拉取请求"
         │                                               │
  ② 模板层│  Ignore all ${ext} files (add to .gitignore)  │  33 条正则
         │    -> 忽略所有 ${ext} 文件（添加到 .gitignore）│
         │                                               │
  ③ 主进程│  resources/app/main.js  (+ ZHD-MENU-HOOK)     │  116 条 + 菜单钩子
         │    label:"&File" -> "文件(&F)"                │
         │    Menu.buildFromTemplate / Menu.append 拦截  │
         │                                               │
  ④ 运行时│  resources/app/zh-cn.js  (+ index.html 一行)  │  DOM 兜底
         │    Changes -> 改动 / Commit 1 file to main    │
         │    -> 提交 1 个文件到 main / 12 minutes ago   │
         │    -> 12 分钟前                               │
         └──────────────────────────────────────────────┘
```

### 为什么需要四层

- **① 打包层**：JSX 里的文案是字符串字面量，直接精确替换。零运行时开销、无闪烁，覆盖 80% 以上。
- **② 模板层**：有些文案是模板字符串（`Open in ${shell}`、`Ignore all ${ext} files`），整串匹配不到。用「两捕获组」正则只翻前缀、保留表达式，例如
  `(O&pen in )(\$\{[^}]*\})` → `在 $2 中打开`。
- **③ 主进程层**：原生菜单项的 label 不在 renderer 里。除静态替换外，还会在 `main.js` 末尾注入**幂等钩子**：拦截 `Menu.buildFromTemplate` 与 `Menu.prototype.append/insert`，对运行时才拼出来的 label（`O&pen in Windows Terminal`、`Undo` 这类 role 项）做二次翻译。
- **④ 运行时层**：单单词按钮、动态计数、相对时间、以及「模板替换后夹生」的句子，由 `zh-cn.js` 用 MutationObserver 处理，只改**文本节点与 placeholder/title/aria-label**，`pre/code/textarea` 内一律跳过。

### 安全设计（重要）

1. 打包层词典**没有任何裸单词**，全部是带空格的短语 → 不可能命中 `e[e.Commit=0]="Commit"`、`case "push"` 这类逻辑标识符。
2. 单单词（`Changes` → 改动）只在 DOM 显示层替换，不改数据。
3. 提交摘要框里的 `Update xxx.sys` 是 placeholder 模板，只翻显示层，**不会把中文写进你的 git 提交历史**。
4. 所有替换都是「原文不存在就跳过」，坏词典最多无效，不会让应用起不来。

---

## ⌨ 命令行参数

| 参数 | 说明 |
|---|---|
| 无 | 汉化版本号最高的 `app-*` |
| `-All` | 汉化所有已安装版本 |
| `-AppDir <path>` | 手动指定 `resources\app` 目录 |
| `-Restore` | 还原英文原版（会删除 `zh-cn.js`） |
| `-DryRun` | 只统计命中，不写文件（改完词典先预演） |
| `-Scan` | 扫描词典未覆盖的英文，输出 `scan-app-x.y.z.txt` |
| `-Help` | 帮助 |

```powershell
pwsh -File .\一键汉化.ps1 -DryRun -AppDir "$env:LOCALAPPDATA\GitHubDesktop\app-3.6.7\resources\app"
```

---

## 📦 目录结构

```
github-desktop-zh/
├─ 一键汉化.ps1                 主程序：安装 / -Restore / -Scan / -DryRun / -All / -AppDir
├─ dict1~10.tsv                 界面文案词典（857 条，Tab 分隔）
├─ main-dict.tsv                菜单与对话框标题词典（116 条）
├─ dict-regex.tsv               模板正则词典（33 条）
│
├─ out/
│  ├─ zh-cn.js                  运行时兜底层（DOM 观察器 + 定时补扫 + 中英混排修正）
│  └─ zh-menu-hook.js           原生菜单钩子（buildFromTemplate + append/insert）
│
├─ tools/
│  ├─ validate-dict.ps1         词典格式 / 正则编译校验（CI 同款）
│  └─ pack-release.ps1          打 Release zip（不含本地产物）
│
├─ docs/
│  ├─ 教程.md                   手把手教程（手动方案、扩词、FAQ）
│  ├─ ARCHITECTURE.md           架构与设计决策（四层模型、数据流、失败模式）
│  └─ images/
│     └─ screenshot.png         效果截图
│
├─ .github/
│  ├─ workflows/
│  │  ├─ ci.yml                 词典 + PS/JS 语法 + 注入标记检查
│  │  └─ release.yml            打 tag 自动打包并发布
│  ├─ ISSUE_TEMPLATE/           Bug / 功能建议模板
│  └─ PULL_REQUEST_TEMPLATE.md
│
├─ README.md
├─ CONTRIBUTING.md              贡献指南（三种补词场景 + PR 约定）
├─ CHANGELOG.md
├─ SECURITY.md                  安全模型与风险声明
├─ CODE_OF_CONDUCT.md           行为准则
├─ LICENSE                      MIT
└─ .gitignore / .gitattributes / .editorconfig
```

> `backup/`、`scan-*.txt`、`out/renderer.js`、`dist/` 等运行时产物已在 `.gitignore` 中排除，不入库。

词典格式就一行一条，Tab 分隔：

```
Pull request markdown body	拉取请求 markdown 正文
```

---

## 🤝 贡献词条

### 场景 1：整句英文

界面上看到 `Copy file path`，就往 `dict10.tsv` 加：

```
Copy file path	复制文件路径
```

### 场景 2：带变量的模板

源码里是 `Open in ${label}` 这种，写进 `dict-regex.tsv`：

```
(Open in )(\$\{[^}]*\})	在 $2 中打开
```

原则：**只翻英文前缀，表达式原样保留**。

### 场景 3：运行时才出现的文本

单单词、动态计数、相对时间 → 改 `out/zh-cn.js` 里的 `EXACT` / `FRAG_RAW` / `REGEX` / `MIXED`。

### 找漏网之鱼

```powershell
pwsh -File .\一键汉化.ps1 -Scan
```

会生成 `scan-app-x.y.z.txt`，里面是词典还没覆盖的英文。挑界面相关的补进词典，重跑安装脚本即可。

改完记得 `-DryRun` 看一眼命中数，再正式跑。

---

## ❓ FAQ

**Q：换个版本还能用吗？**
A：能。脚本不认版本号，只认 `app-*` 目录结构。词典按英文原文匹配，跨小版本命中率很高；新版新增文案用 `-Scan` 找出来补即可。

**Q：自动更新之后变英文了？**
A：官方更新会装到新的 `app-x.y.z` 目录，重跑一次 `一键汉化.ps1` 就行，各版本备份互不干扰。

**Q：装完打不开怎么办？**
A：`pwsh -File .\一键汉化.ps1 -Restore`。也可以直接把 `backup\app-x.y.z\` 里的三个文件拷回去。

**Q：为什么有些地方还是英文？**
A：三类：① 词典还没收录（用 `-Scan` 找出来补）；② 仓库里的数据（文件名、提交信息、分支名）——这些**故意不翻**；③ Copilot 动态生成的内容。

**Q：会不会改坏我的仓库？**
A：不会。补丁只动 `resources\app` 下的 4 个资源文件，与你的仓库完全隔离。

**Q：macOS / Linux 能用吗？**
A：脚本的路径定位默认走 Windows 的 `%LOCALAPPDATA%`，其他平台用 `-AppDir` 指定：macOS `/Applications/GitHub Desktop.app/Contents/Resources/app`、Linux 对应安装目录下的 `resources/app`。核心替换逻辑与平台无关。

**Q：会不会被杀毒或代码签名策略拦截？**
A：不修改 exe，不注入进程，只改 JS 资源文本。若企业环境有完整性校验策略，请先在测试机验证。

---

## 🗺 Roadmap

- [x] 四层静态替换 + 双运行时兜底
- [x] 多版本批量、Scan、DryRun、备份/还原
- [x] 错误提示、右键菜单、原生编辑菜单覆盖
- [ ] 词条 JSON 化 + 术语一致性校验
- [ ] 跨平台路径自动识别（macOS / Linux 一键）
- [ ] 更新后自动重打（监听 app-* 目录变化）

---

## ⚠️ 免责声明

本项目仅用于**本地界面的中文化研究**，不修改任何账号、网络请求或仓库数据，不分发 GitHub Desktop 本体。
GitHub Desktop 的版权归 GitHub, Inc. 所有；本项目与 GitHub 无任何关联。
修改后请自行承担风险，生产环境请先在测试机器验证。

## License

MIT © contributors
