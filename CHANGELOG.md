# Changelog

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.2] - 2025-02-XX

### 修复

- **仓库别名菜单/对话框**：`Create alias` 由 `(alias==null?"Create":"Change")+" alias"` 拼接生成，词典与模板都命中不到，改为直接改写拼接表达式；对话框标题与描述一并中文化
- **切换分支对话框**：`Always bring my changes to my new branch`、`Always stash and leave my changes…`、`Ask me where I want the changes to go` 等
- **Copilot / 通知设置**：`Add model`、`Add custom provider`、`AI credits`、`Allow the display of notifications…`
- **进度标题**：`Fetching origin` / `Hang on…` → 正在获取 origin / 请稍候…
- **`Pull requests` 被拆成「拉取 requests」**：删除 `Pull ` / `Push ` / `Fetch ` 三条前缀片段规则，改为整段正则；前缀式替换不得再用于长词条

### 新增

- `dict10.tsv`（33 条：切换分支、Copilot 设置、通知设置）
- 运行时层 `MIXED` 规则：中英混排文本只替换受控英文词
- 运行时层 1.5s 定时补扫：兜住 portal 浮层错过 MutationObserver 的情况
- 文档：`docs/ARCHITECTURE.md`、`SECURITY.md`、`CODE_OF_CONDUCT.md`
- 发布流程：`.github/workflows/release.yml` + `tools/pack-release.ps1`（打 tag 自动出 zip）

## [1.0.1] - 2025-02-XX

### 修复

- **错误提示半中半英**：`Failed to move the repository directory to …` 这类「模板 + 变量 + 转义换行」的错误消息整串匹配不到，改用捕获组正则拆分翻译
- **仓库右键菜单遗漏**：`Create alias` / `Change alias`、`Remove…` / `Rename…` / `Delete…`
- **工作树对话框**：`Worktree name` / `worktree name` / `worktree path`
- **建议卡片**：`Open the repository in your external editor`、`View the files of your repository in …`、`You have … waiting to be pushed to …`
- **中英混排文本**：新增 `fixMixed()`，文本节点为中英混合时只替换受控残留词（commits / commit / tags / tag / stashes）

### 新增

- `dict8.tsv`：77 条错误提示
- `dict9.tsv`：界面文案（建议卡片、工作树、合并/冲突提示）

## [1.0.0] - 2025-02-XX

首个公开版本。

### 新增

- **一键脚本** `一键汉化.ps1`：自动定位 `app-*` 版本目录，纯 PowerShell 实现，零依赖、可重复执行
- **四层汉化**
  - 打包层：`renderer.js` 整串字面量替换
  - 模板层：`dict-regex.tsv` 正则替换，处理带变量的拼接文案
  - 主进程层：`main.js` 菜单/对话框标题替换 + `ZHD-MENU-HOOK` 运行时钩子拦截 `Menu.buildFromTemplate`
  - 运行时层：`out/zh-cn.js` 基于 MutationObserver 的 DOM 兜底（单单词、动态计数、相对时间、中英混排）
- **安全与可逆**：全程备份到 `backup/app-x.y.z/`，`-Restore` 一键还原；词典内无裸单词，不触碰逻辑常量
- **维护工具**：`-Scan`、`-DryRun`、`-All`、`-AppDir`
- **CI**：词典格式校验 + PowerShell/JS 语法检查

### 已知问题

- Copilot 相关文案部分仍为英文（动态生成，词典未覆盖）
- 仓库数据（文件名、提交信息、分支名）按设计不翻译
