/* GitHub Desktop 简体中文补丁 - 运行时文本层（不改动业务逻辑） */
(function () {
  'use strict';
  try {
    var EXACT = {
      "Add": "添加", "New": "新建", "Yes": "是", "No": "否", "Use": "使用", "Undo": "撤销",
      "Name": "名称", "Save": "保存", "Line": "行", "Skip": "跳过", "Dark": "深色", "Light": "浅色",
      "Theme": "主题", "Path": "路径", "Path:": "路径：", "Done": "完成", "Done!": "完成！",
      "None": "无", "none": "无", "Type": "类型", "Open": "打开", "Stop": "停止", "Press": "按下",
      "Clear": "清除", "Close": "关闭", "Email": "邮箱", "Size:": "大小：", "Added": "已添加",
      "Swipe": "滑动", "Split": "拆分", "Date:": "日期：", "Usage": "用量", "Hooks": "钩子",
      "Local": "本地", "Clone": "克隆", "Fetch": "获取", "Error": "错误", "Alias": "别名",
      "Login": "登录", "Abort": "中止", "Ignore": "忽略", "Remote": "远程", "Filter": "筛选",
      "Re-run": "重新运行", "Delete": "删除", "Cancel": "取消", "Author": "作者", "System": "系统",
      "Models": "模型", "Remove": "移除", "Update": "更新", "Rebase": "变基", "Bypass": "绕过",
      "Editing": "编辑中", "Restore": "恢复", "Deleted": "已删除", "Search…": "搜索…",
      "Unified": "统一", "Commits": "提交", "Changes": "改动", "History": "历史记录",
      "Choose…": "选择…", "Prompts": "提示词", "API key": "API 密钥", "Default": "默认",
      "Locate…": "定位…", "License": "许可", "Account": "账户", "Privacy": "隐私",
      "warning": "警告", "Discard": "丢弃", "Resolve": "解决", "Merging": "合并中",
      "Context": "上下文", "Summary": "摘要", "Enabled": "已启用", "Overage": "超额",
      "Secrets": "机密", "failed.": "失败。", "Warning:": "警告：", "Branches": "分支",
      "Accounts": "账户", "Advanced": "高级", "Provider": "服务商", "Archived": "已归档",
      "Username": "用户名", "Password": "密码", "Current:": "当前：", "Checkout": "检出",
      "Continue": "继续", "Rebasing": "变基中", "Reviews:": "审阅：", "Endpoint": "端点",
      "Override": "覆盖", "Committed": "已提交", "Reachable": "可达", "Your Name": "你的姓名",
      "Arguments": "参数", "Expected:": "预期：", "Overwrite": "覆盖", "Comments:": "评论：",
      "Unlimited": "无限制", "Learn more": "了解更多", "Onion Skin": "洋葱皮",
      "Difference": "差异", "Whitespace": "空白字符", "Hang tight": "请稍候",
      "Welcome to": "欢迎使用", "what's new": "新功能", "Formatting": "格式设置",
      "Configure…": "配置…", "Appearance": "外观", "Reordering": "重新排序",
      "local only": "仅本地", "Avatar URL": "头像 URL", "Reset date": "重置日期",
      "Learn more.": "了解更多。", "Description": "描述", "Unreachable": "不可达",
      "Get started": "开始使用", "usage stats": "使用统计", "completions": "补全",
      "Clone Again": "再次克隆", "Preferences": "偏好设置", "Miscellanea": "杂项",
      "Please wait": "请稍候", "Diff display": "差异显示", "Last fetched": "上次获取",
      "You're done!": "你完成了！", "Applications": "应用程序", "App location": "应用位置",
      "Integrations": "集成", "Bearer token": "持有者令牌", "Beta Channel": "Beta 通道",
      "Organization": "组织", "File options": "文件选项", "Icon Preview": "图标预览",
      "Fake account": "模拟账户", "I understand": "我明白", "Resize handle": "调整大小手柄",
      "Input cleared": "输入已清空", "Committing as": "提交身份：", "Ignored files": "忽略的文件",
      "Stop amending": "停止修补", "Clear filters": "清除筛选", "Branch filter": "分支筛选",
      "Delete branch": "删除分支", "Configure Git": "配置 Git", "Throw It Away": "丢弃它",
      "Commit Length": "提交长度", "Force pushing": "正在强制推送", "release notes": "发行说明",
      "Error details": "错误详情", "Used requests": "已用请求数", "Notifications": "通知",
      "Accessibility": "辅助功能", "Hands clapping": "鼓掌", "Start tutorial": "开始教程",
      "Example commit": "示例提交", "View conflicts": "查看冲突", "Default branch": "默认分支",
      "default branch": "默认分支", "Search for user": "搜索用户", "switch branches": "切换分支",
      "The branch name": "分支名", "Stashed changes": "暂存的改动", "Stashed Changes": "暂存的改动",
      "Open repository": "打开仓库", "Secret Scanning": "机密扫描", "Publish branch": "发布分支",
      "Last Modified:": "最后修改：", "View on GitHub": "在 GitHub 上查看",
      "Checks Summary": "检查摘要", "Filter Options": "筛选选项", "Commit message": "提交信息",
      "Push pull button": "推送/拉取按钮", "Review requested": "请求审阅", "Application menu": "应用菜单",
      "No local changes": "没有本地改动", "This will update": "这将更新", "I have an editor": "我有编辑器",
      "Terms of Service": "服务条款", "Discarding stash": "正在丢弃暂存", "grant permission": "授予权限",
      "Select an editor": "选择编辑器", "Move and Restart": "移动并重启", "You contributed:": "你贡献了：",
      "Switch to manual": "切换到手动", "No reviews found": "未找到审阅", "Submodule changes": "子模块改动",
      "The file is empty": "文件为空", "Copy the full SHA": "复制完整 SHA", "important updates": "重要更新",
      "Refresh this list": "刷新此列表", "SSH User Password": "SSH 用户密码", "Remember password": "记住密码",
      "No comments found": "未找到评论", "Branch (optional)": "分支（可选）", "Forcefully delete": "强制删除",
      "View check details": "查看检查详情", "No worktrees found": "未找到工作树",
      "No files in commit": "提交中没有文件", "No commit selected": "未选择提交",
      "Repository sidebar": "仓库侧边栏", "Enterprise address": "企业版地址", "Configure manually": "手动配置",
      "Background updates": "后台更新", "Path to executable": "可执行文件路径", "Discarding changes": "正在丢弃改动",
      "Removing worktrees": "正在移除工作树", "Let's get started!": "让我们开始吧！",
      "Initialize Git LFS": "初始化 Git LFS", "Resolution summary": "解决方案摘要",
      "SSH Key Passphrase": "SSH 密钥密码短语", "Test Notifications": "测试通知",
      "Publish repository": "发布仓库", "most recent commit": "最近的提交",
      "Cherry-picking from": "正在从以下分支拣选", "Remember passphrase": "记住密码短语",
      "Common reasons are:": "常见原因包括：", "Review without body": "无正文的审阅",
      "Ignore and Continue": "忽略并继续", "Publish your branch": "发布你的分支",
      "Downloading update…": "正在下载更新…", "Additional Services": "附加服务",
      "repository settings": "仓库设置", "Your Account Emails": "你的账户邮箱",
      "create a new branch": "创建新分支", "custom instructions": "自定义指令",
      "create a repository": "创建仓库", "add this repository": "添加此仓库",
      "Configure Copilot in app settings": "在应用设置中配置 Copilot",
      "Sign in to GitHub Enterprise": "登录 GitHub Enterprise",
      "Add account": "添加账户", "Sign in": "登录", "Sign Out": "退出登录", "Sign out": "退出登录",
      "Remove…": "移除…", "Rename…": "重命名…", "Publish": "发布", "Pull": "拉取", "Push": "推送",
      "Commit": "提交", "Discard all changes…": "丢弃所有改动…", "Stash all changes…": "暂存所有改动…",
      "Stash All Changes": "暂存所有改动", "Preview Pull Request": "预览拉取请求",
      "Create Pull Request": "创建拉取请求", "Choose a branch": "选择分支",
      "No branches found": "未找到分支", "Loading…": "加载中…", "Loading": "加载中",
      "Settings": "设置", "Options": "选项", "Repository": "仓库", "Repository settings": "仓库设置",
      "About": "关于", "Help": "帮助", "Contributors": "贡献者", "Edit": "编辑",
      "Duplicate": "复制副本", "Show": "显示", "Hide": "隐藏", "Ignore file": "忽略文件",
      "Open in external editor": "在外部编辑器中打开", "Custom": "自定义", "Test": "测试",
      "Verify": "验证", "Retry": "重试", "Next": "下一步", "Back": "返回", "Finish": "完成",
      "Skip tutorial": "跳过教程", "Your repositories": "你的仓库",
      "Current repository": "当前仓库", "Current branch": "当前分支",
      "Never fetched": "从未获取", "Fork this repository": "fork 此仓库",
      "Commit to ": "提交到 ", "Commit to": "提交到",
      "Files must be selected to commit": "需先选择文件再提交",
      "No changes to commit": "没有要提交的改动", "Committing changes…": "正在提交改动…",
      "Select one or more files to commit": "选择要提交的一个或多个文件",
      "Show stashed changes": "显示暂存的改动", "Hide stashed changes": "隐藏暂存的改动",
      "Show Toggle Changes Filter": "显示筛选切换", "Hide Toggle Changes Filter": "隐藏筛选切换",
      "Open in shell": "在 shell 中打开", "Open in browser": "在浏览器中打开",
      "Open in Windows Terminal": "在 Windows 终端中打开",
      "Remove": "移除", "Create": "创建", "Change": "更改", "Copy": "复制", "Current": "当前",
      "Create alias": "创建别名", "Change alias": "更改别名", "Remove alias": "移除别名",
      "Repository": "仓库", "Duplicate": "复制副本", "Forget": "忽略"
    };

    var FRAG_RAW = [
      ["A force push will rewrite history on the remote. Any collaborators working on this branch will need to reset their own local branch to match the history of the remote.", "强制推送会重写远程的历史记录。任何在此分支上协作的人都必须重置自己的本地分支以匹配远程历史。"],
      ["file already. Checking this box will result in the existing file being overwritten.", "文件已存在。勾选此项将导致现有文件被覆盖。"],
      ["and renaming this branch will not change the branch name on the remote.", "重命名此分支不会改变远程上的分支名。"],
      ["Your current stash will be overwritten by creating a new stash", "创建新暂存将覆盖你当前的暂存"],
      ["is where you store your code and collaborate with others.", "是你存放代码并与他人协作的地方。"],
      ["for non-reasoning models or to let the provider pick.", "用于非推理模型，或让服务商自行选择。"],
      ["will move your stashed files to the Changes list.", "会将你暂存的文件移到“改动”列表。"],
      ["are entirely different commit histories.", "是完全不同的提交历史。"],
      ["account. Do you want to sign in again?", "账户。是否要重新登录？"],
      ["helps you work with GitHub locally.", "帮助你在本地使用 GitHub。"],
      ["before creating your pull request?", "在创建拉取请求之前？"],
      ["to store large files on GitHub.", "以便在 GitHub 上存储大文件。"],
      ["is the version control system.", "是版本控制系统。"],
      ["already exists on the remote.", "已在远程存在。"],
      ["now and open a pull request?", "立即打开拉取请求？"],
      ["Can't automatically merge.", "无法自动合并。"],
      ["No newline at end of file", "文件末尾没有换行符"],
      ["to choose a new location.", "以选择新位置。"],
      ["is already up to date with", "已与以下分支保持同步："],
      ["is already up to date", "已是最新状态"],
      ["is not a valid name.", "不是有效的名称。"],
      ["Resolve with Copilot", "使用 Copilot 解决"],
      ["already exists", "已存在"],
      ["Able to merge.", "可以合并。"],
      ["to confirm.", "以确认。"],
      ["It looks like you don’t have write access to", "看起来你没有以下仓库的写入权限："],
      ["Do you want to create a fork of this repository at", "是否在以下位置 fork 此仓库："],
      [" to continue?", " 以继续？"],
      ["changed files", "个文件已更改"],
      ["changed file", "个文件已更改"],
      ["files to ", "个文件到 "],
      ["file to ", "个文件到 "],
      ["Open in ", "在 "],
      ["Commit ", "提交 "],
      ["Force push", "强制推送"],
      ["Fetch origin", "获取 origin"],
      ["Pull origin", "拉取 origin"],
      ["Push origin", "推送 origin"],
      ["Publish branch", "发布分支"],
      ["Commit to ", "提交到 "],
      ["files changed", "个文件已更改"],
      ["file changed", "个文件已更改"],
      ["commits behind", "个提交落后"],
      ["commit behind", "个提交落后"],
      ["commits ahead", "个提交领先"],
      ["commit ahead", "个提交领先"]
    ];

    var REGEX = [
      [/^Commit (\d+) files? to (.+)$/, function (m) { return "提交 " + m[1] + " 个文件到 " + m[2]; }],
      [/^(\d+) changed files?$/, function (m) { return m[1] + " 个文件已更改"; }],
      [/^(\d+) files? changed$/, function (m) { return m[1] + " 个文件已更改"; }],
      [/^just now$/, function () { return "刚刚"; }],
      [/^(\d+) seconds? ago$/, function (m) { return m[1] + " 秒前"; }],
      [/^(\d+) minutes? ago$/, function (m) { return m[1] + " 分钟前"; }],
      [/^(\d+) hours? ago$/, function (m) { return m[1] + " 小时前"; }],
      [/^(\d+) days? ago$/, function (m) { return m[1] + " 天前"; }],
      [/^(\d+) months? ago$/, function (m) { return m[1] + " 个月前"; }],
      [/^(\d+) commits? ahead$/, function (m) { return m[1] + " 个提交领先"; }],
      [/^(\d+) commits? behind$/, function (m) { return m[1] + " 个提交落后"; }],
      [/^Open in (.+)$/, function (m) { return "在 " + m[1] + " 中打开"; }],
      [/^(Create|Change) alias$/, function (m) { return (m[1] === "Create" ? "创建" : "更改") + "别名"; }],
      [/^(Push|Pull|Fetch) (.+)$/, function (m) {
        return (m[1] === "Push" ? "推送 " : m[1] === "Pull" ? "拉取 " : "获取 ") + m[2];
      }],
      [/^Fetching (.+)$/, function (m) { return "正在获取 " + m[1]; }],
      [/^Pushing (.+)$/, function (m) { return "正在推送 " + m[1]; }],
      [/^Pulling (.+)$/, function (m) { return "正在拉取 " + m[1]; }],
      [/^commits$/, function () { return "提交"; }],
      [/^commit$/, function () { return "提交"; }],
      [/^1 commit$/, function () { return "1 个提交"; }],
      [/^(\d+) commits$/, function (m) { return m[1] + " 个提交"; }],
      [/^1 local commit$/, function () { return "1 个本地提交"; }],
      [/^(\d+) local commits$/, function (m) { return m[1] + " 个本地提交"; }],
      [/^1 tag$/, function () { return "1 个标签"; }],
      [/^(\d+) tags$/, function (m) { return m[1] + " 个标签"; }],
      [/^the remote$/, function () { return "远程"; }],
      [/^(Create|Change) (repository |worktree )?alias$/, function (m) {
        var mid = m[2] === "repository " ? "仓库" : m[2] === "worktree " ? "工作树" : "";
        return (m[1] === "Create" ? "创建" : "更改") + mid + "别名";
      }],
      [/^Hide (.+) Filter$/, function (m) { return "隐藏" + m[1] + "筛选"; }],
      [/^Show (.+) Filter$/, function (m) { return "显示" + m[1] + "筛选"; }],
      [/^(\d+) of (\d+)$/, function (m) { return m[1] + " / " + m[2]; }]
    ];
    function applyRegex(s) {
      var t = s.trim();
      for (var i = 0; i < REGEX.length; i++) {
        var m = REGEX[i][0].exec(t);
        if (m) {
          var out = REGEX[i][1](m);
          var idx = s.indexOf(t);
          return s.slice(0, idx) + out + s.slice(idx + t.length);
        }
      }
      return null;
    }

    var SP = "\\^$.*+?()[]{}|";
    function esc(s) {
      var out = "";
      for (var i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        out += SP.indexOf(c) >= 0 ? "\\" + c : c;
      }
      return out;
    }

    var FRAG_MAP = {};
    for (var i = 0; i < FRAG_RAW.length; i++) FRAG_MAP[FRAG_RAW[i][0]] = FRAG_RAW[i][1];
    var FRAG_SORTED = FRAG_RAW.slice().sort(function (a, b) { return b[0].length - a[0].length; });
    var FRAG_RE = new RegExp(FRAG_SORTED.map(function (p) { return esc(p[0]); }).join("|"), "g");

    var SKIP = { SCRIPT: 1, STYLE: 1, PRE: 1, CODE: 1, TEXTAREA: 1, INPUT: 1, SVG: 1 };
    var ATTRS = ["placeholder", "title", "aria-label", "alt"];

    function hasCJK(s) { return /[\u4e00-\u9fff]/.test(s); }
    function hasLatin(s) { return /[A-Za-z]/.test(s); }

    // 中英混排文本（如 "推送 commits 到 origin 远程"）里的英文残留词，只做受控替换
    var MIXED = [
      ["commits", "提交"], ["commit", "提交"],
      ["tags", "标签"], ["tag", "标签"],
      ["stashes", "暂存"], ["stashed", "暂存"]
    ];
    function fixMixed(s) {
      var out = s;
      for (var i = 0; i < MIXED.length; i++) {
        if (out.indexOf(MIXED[i][0]) >= 0) { out = out.split(MIXED[i][0]).join(MIXED[i][1]); }
      }
      return out;
    }

    function convert(s) {
      if (!s || !hasLatin(s)) return null;
      var t = s.trim();
      if (!t) return null;
      if (hasCJK(s)) {
        var mixed = fixMixed(s);
        return mixed !== s ? mixed : null;
      }
      if (Object.prototype.hasOwnProperty.call(EXACT, t)) {
        var idx = s.indexOf(t);
        return s.slice(0, idx) + EXACT[t] + s.slice(idx + t.length);
      }
      var rx = applyRegex(s);
      if (rx !== null) return rx;
      if (t.length < 4) return null;
      var out = s.replace(FRAG_RE, function (m) { return FRAG_MAP[m] || m; });
      return out !== s ? out : null;
    }

    function skipNode(node) {
      var el = node.parentElement;
      while (el) {
        if (SKIP[el.tagName]) return true;
        if (el.isContentEditable) return true;
        el = el.parentElement;
      }
      return false;
    }

    function doTextNode(node) {
      try {
        var v = node.nodeValue;
        if (!v || v.length > 4000) return;
        var r = convert(v);
        if (r !== null && r !== v) node.nodeValue = r;
      } catch (e) {}
    }

    var ATTR_DONE = new WeakMap();
    function doAttrs(el) {
      try {
        if (!el.getAttribute) return;
        for (var i = 0; i < ATTRS.length; i++) {
          var a = ATTRS[i];
          var v = el.getAttribute(a);
          if (!v) continue;
          if (ATTR_DONE.get(el) === v) continue;
          var r = convert(v);
          if (r !== null) { el.setAttribute(a, r); ATTR_DONE.set(el, r); }
        }
      } catch (e) {}
    }

    function walk(root) {
      try {
        if (root.nodeType === 3) { if (!skipNode(root)) doTextNode(root); return; }
        if (root.nodeType !== 1) return;
        if (SKIP[root.tagName]) return;
        doAttrs(root);
        var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
        var n;
        while ((n = tw.nextNode())) {
          if (n.nodeType === 3) doTextNode(n); else doAttrs(n);
        }
      } catch (e) {}
    }

    var queue = [];
    var scheduled = false;
    function flush() {
      scheduled = false;
      var items = queue; queue = [];
      for (var i = 0; i < items.length; i++) walk(items[i]);
    }
    function schedule(node) {
      queue.push(node);
      if (!scheduled) { scheduled = true; setTimeout(flush, 16); }
    }

    function start() {
      walk(document.body);
      var mo = new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
          var r = records[i];
          if (r.type === "characterData") { if (!skipNode(r.target)) doTextNode(r.target); continue; }
          for (var j = 0; j < r.addedNodes.length; j++) {
            var nd = r.addedNodes[j];
            if (nd.nodeType === 1 || nd.nodeType === 3) schedule(nd);
          }
        }
      });
      mo.observe(document.body, { childList: true, subtree: true, characterData: true });
      // 兜底：某些 portal 渲染的浮层可能错过观察器，定时补扫
      setInterval(function () {
        try { if (document.body) walk(document.body); } catch (e) {}
      }, 1500);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  } catch (e) { console.error("[zh-cn] init failed", e); }
})();
