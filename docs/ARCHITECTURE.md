# 架构与设计决策

> 本文解释「为什么这么做」，操作步骤见 [README](../README.md) 与 [教程](教程.md)。

## 1. 目标与约束

| 目标 | 约束 |
|---|---|
| 任意 3.x 版本可用 | 官方无语言包，文案硬编码在 Electron 资源里 |
| 一条命令装/卸 | 用户不该手工改 bundle |
| 不破坏应用 | 绝不触碰逻辑标识符、不修改 exe、不注入进程 |
| 可长期维护 | 官方改文案后能快速定位补词 |
| 可回滚 | 任何时候能回到英文原版 |

由此定下四条原则：

1. **只改字符串，不改结构** —— 所有替换都是「英文原文 → 中文」，不存在代码级改写（唯一例外是菜单拼接表达式，见 §5）。
2. **分层兜底** —— 静态能改的静态改，静态改不了的运行时改。
3. **词典与逻辑分离** —— 词表是纯文本 TSV，非程序员也能贡献。
4. **幂等 + 全量重建** —— 每次都从 backup 的原始文件重新生成，永远不会「越改越脏」。

---

## 2. 四层架构

```
                  ┌─────────────────────────────────────────┐
   启动           │  Electron 主进程                         │
   ① ────────────►│  main.js                                │
                  │   · 菜单 label / 对话框 title 静态替换    │
                  │   · 末尾追加 ZHD-MENU-HOOK               │
                  │     └─ 拦截 Menu.buildFromTemplate        │
                  │        对运行时拼接的 label 二次翻译       │
                  └───────────────┬─────────────────────────┘
                                  │ BrowserWindow.loadFile
                  ┌───────────────▼─────────────────────────┐
   ② ────────────►│  resources/app/renderer.js               │
                  │   · 859 条整串字面量替换（打包层）        │
                  │   · 33 条模板正则（含 ${..} 的拼接句）     │
                  └───────────────┬─────────────────────────┘
                                  │ DOM 渲染
                  ┌───────────────▼─────────────────────────┐
   ③ ────────────►│  resources/app/zh-cn.js（index.html 注入）│
                  │   · MutationObserver 监听文本/属性        │
                  │   · EXACT / FRAG / REGEX / MIXED 四类规则 │
                  │   · 1.5s 定时补扫（portal 浮层兜底）      │
                  └─────────────────────────────────────────┘
```

### ① 打包层（renderer.js 整串替换）

JSX 编译产物里，界面文案就是字符串字面量：

```js
Ae.createElement("h1", null, "Pull requests")
```

对 "Pull requests" 做精确的整串替换即可。工具只替换**被引号完整包裹**的字符串（三种引号都试），
并额外支持「引号内带一个尾随空格」的变体（"Pull requests "），因为 JSX 常这么写。

**为什么安全**：词典里没有任何裸单词，全是带空格的短语，因此不可能命中
e[e.Commit=0]="Commit"、case "push" 这类逻辑常量。

### ② 模板层（dict-regex.tsv）

有些文案是模板字符串，整串匹配不到：

```js
label: `Open in ${shellLabel}`
```

处理策略是「两捕获组」：只翻英文外壳，把 ${...} 原样保留。

`
(Open in )(\$\{[^}]*\})   →   在 $2 中打开
`

反例（不要写成这样）：直接把 "Open in " 做片段替换 → Open in Windows Terminal 会变成
「在 Windows Terminal」（缺后缀），更糟的是 Pull requests 会被 "Pull " 拆成「拉取 requests」。
**前缀式替换必须用整段正则。**

### ③ 主进程层（main.js + 菜单钩子）

原生菜单的 label 在主进程构建，DOM 层够不到。分两步：

- 静态项（label:"&File"）→ 整串替换
- 动态项（模板 label）→ 替换模板；仍漏的由钩子兜底

钩子是追加在 main.js 末尾的一段 IIFE：

```js
var orig = Menu.buildFromTemplate.bind(Menu);
Menu.buildFromTemplate = function (template) {
  walk(template);          // 对 label 做正则翻译
  return orig(template);
};
```

之所以需要它：O&pen in Windows Terminal 这种把助记符 & 插在单词中间的写法，
正则永远匹配不到 "Open in "，只能等运行时拿到拼接结果再翻。

### ④ 运行时层（zh-cn.js）

处理静态改不了的：单单词按钮、动态计数、相对时间、模板替换后夹生的句子。

```
EXACT   整段全等     "Changes" → 改动
FRAG    片段包含     "Commit 1 file to" → "提交 1 个文件到"
REGEX   整段正则     "12 minutes ago" → "12 分钟前"
MIXED   中英混排     "推送 commits 到 origin 远程" → "推送 提交 到 …"
```

**安全边界**：跳过 pre/code/textarea/input/svg；只改文本节点与
placeholder/title/aria-label/alt；不改 value（避免污染用户输入与提交信息）。

---

## 3. 一次安装的数据流

```
定位 app-*  ──►  停止进程  ──►  备份原始文件（首次）
                                      │
                                      ▼
        以 backup 中的原始文件为源（不是当前文件！）
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
       整串替换(uiDict)         整串替换(menuDict)        追加菜单钩子
              │                       │                       │
              ▼                       ▼                       ▼
       模板正则(regexRules)     模板正则(regexRules)       ─── 写入 ───
                                      │
                                      ▼
                        部署 zh-cn.js + 注入 index.html
```

**为什么从 backup 读源**：保证输出只取决于「原始文件 + 当前词典」，
多次运行结果一致；即使上次装坏了，重跑也能自愈。

---

## 4. 版本适配

- 不读版本号，只扫 %LOCALAPPDATA%\GitHubDesktop\app-*，按 [version] 排序
- 每个版本独立备份 backup/app-x.y.z/
- 词典按英文原文匹配，跨小版本命中率很高；命中不了的自动跳过
- 新增文案用 -Scan 找（以 backup 原始文件为源，与词典做差集）
- 若官方改用 app.asar 打包，脚本会提示 npx asar extract，其余流程不变

---

## 5. 唯一的例外：改拼接表达式

Create alias 这类菜单项，源码是：

```js
label: (alias === null ? "Create" : "Change") + " alias"
```

整串不存在、模板也不是（它由两段拼接），且该菜单在部分版本走原生渲染，DOM 层够不到。
唯一可行的做法是**把拼接表达式本身改成中文**：

`
(null==t.alias?"Create":"Change")+" alias"   →   (null==t.alias?"创建":"更改")+"别名"
`

这条规则放在 dict-regex.tsv 里。代价是依赖压缩后的变量名，跨版本可能失效——
所以 DOM 层同时保留了 ^(Create|Change) alias$ 的整段正则作为兜底。

---

## 6. 失败模式与回滚

| 现象 | 原因 | 处理 |
|---|---|---|
| 界面空白/打不开 | 词典误伤或文件写坏 | -Restore，或从 backup 手工覆盖 |
| 某处半中半英 | 前缀式替换污染 | 改为整段正则 |
| 新版本仍有英文 | 词典未覆盖 | -Scan 找出来补 |
| 覆盖后应用报 JS 错 | 替换破坏了语法 | 脚本每次都跑语法校验（CI 中） |

---

## 7. 性能

- 整串替换：String.Replace + IndexOf 预检，3.2MB × 800 条约 1–2 秒（PowerShell）
- 模板正则：30 条左右，每条先 Matches 计数再替换
- 运行时：MutationObserver + 16ms 批量 + 1.5s 兜底扫描，纯文本操作，开销可忽略

---

## 8. 扩展点

| 想加什么 | 改哪里 |
|---|---|
| 一条固定文案 | dictN.tsv（当前到 dict10.tsv） |
| 一条带变量的文案 | dict-regex.tsv |
| 菜单项 | main-dict.tsv，或 out/zh-menu-hook.js |
| 运行时文本规律 | out/zh-cn.js 的 EXACT / FRAG_RAW / REGEX / MIXED |
