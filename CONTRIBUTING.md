# 贡献指南

感谢你愿意帮这个项目变得更好！三种贡献方式，按难度从低到高。

## 1. 补词条（最常见）

发现界面还有英文？两种做法：

### 方式 A：用 `-Scan` 找，手工补

```powershell
pwsh -File .\一键汉化.ps1 -Scan
```

会生成 `scan-app-x.y.z.txt`，里面是词典还没覆盖的英文句子。挑界面相关的，按「英文 + Tab + 中文」加进 `dict7.tsv`：

```
Copy file path	复制文件路径
```

### 方式 B：直接改

已知英文原文时，直接往 `dict7.tsv`（界面）/ `main-dict.tsv`（菜单）追加一行。

## 2. 补模板规则

如果英文是「前缀 + 变量」结构（例如 `Open in ${label}`），往 `dict-regex.tsv` 加一行：

```
(Open in )(\$\{[^}]*\})	在 $2 中打开
```

要点：**只翻英文前缀，把 `${...}` 表达式用捕获组原样保留**，替换文本里用 `$2` 引用。

## 3. 补运行时规则

单单词按钮、动态计数、相对时间这类只能在 DOM 层处理，改 `out/zh-cn.js`：

- `EXACT`：整段文本全等匹配
- `FRAG_RAW`：片段包含匹配（按长度降序）
- `REGEX`：正则匹配（如 `12 minutes ago` → `12 分钟前`）

## 提交前自检

```powershell
# 1. 词典格式
pwsh -File .\tools\validate-dict.ps1

# 2. 预演，看命中数是否符合预期
pwsh -File .\一键汉化.ps1 -DryRun

# 3. 真正跑一遍并启动应用确认
pwsh -File .\一键汉化.ps1
```

## PR 约定

- 标题：`feat(dict): 补充右键菜单词条` / `fix(hook): 修正 open in shell 助记符`
- 说明里附**改前/改后截图**或 `-DryRun` 输出
- 不要提交 `backup/`、`scan-*.txt`、`out/renderer.js` 等本地生成物（已在 .gitignore）

## 代码风格

- `.ps1` 用 UTF-8 **带 BOM** 保存（Windows PowerShell 5.1 需要）
- `.tsv` 用 UTF-8 无 BOM，Tab 分隔，不要用空格对齐
- JS 补丁（`out/*.js`）保持 ES5 语法，兼容旧版 Electron
