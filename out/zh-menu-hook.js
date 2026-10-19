/* ZHD-MENU-HOOK: GitHub Desktop 简体中文补丁 - 原生菜单运行时钩子（可重复追加，勿手改） */
try {
  (function () {
    if (typeof require !== 'function') { return; }
    var el = null;
    try { el = require('electron'); } catch (e) { return; }
    if (!el || !el.Menu) { return; }
    var Menu = el.Menu;
    if (Menu.__zhPatched) { return; }

    // 让 Chromium 内置的编辑菜单（Undo/Cut/Copy…）跟随中文
    try {
      if (el.app && el.app.commandLine) { el.app.commandLine.appendSwitch('lang', 'zh-CN'); }
    } catch (e) {}

    var ROLE_ZH = {
      undo: '撤销', redo: '重做', cut: '剪切', copy: '复制', paste: '粘贴',
      pasteAndMatchStyle: '粘贴并匹配样式', delete: '删除', selectAll: '全选',
      reload: '重新加载', forceReload: '强制重新加载', toggleDevTools: '切换开发者工具',
      resetZoom: '重置缩放', zoomIn: '放大', zoomOut: '缩小', togglefullscreen: '切换全屏',
      minimize: '最小化', close: '关闭', quit: '退出', about: '关于',
      hide: '隐藏', hideOthers: '隐藏其他', unhide: '显示全部', front: '前置',
      zoom: '缩放', window: '窗口', help: '帮助', services: '服务'
    };

    var PAIRS = [
      [/^(&?)Open in (.+)$/, '$1在 $2 中打开'],
      [/^O&pen in (.+)$/, '在 $1 中打开'],
      [/^&?O&pen in (.+)$/, '在 $1 中打开'],
      [/^(&?)(Hide|Show) (.+) Filter$/, null],
      [/^(&?)Show stashed changes$/, '&显示暂存的改动'],
      [/^(&?)Hide stashed changes$/, '&隐藏暂存的改动']
    ];

    function conv(s) {
      if (typeof s !== 'string' || !/[A-Za-z]/.test(s)) { return s; }
      var t = s;
      for (var i = 0; i < PAIRS.length; i++) {
        var re = PAIRS[i][0];
        var rep = PAIRS[i][1];
        var m = re.exec(t);
        if (!m) { continue; }
        if (rep === null) {
          t = (m[1] || '') + (m[2] === 'Hide' ? '隐藏' : '显示') + m[3] + '筛选';
        } else {
          t = rep.replace(/\$(\d)/g, function (_, n) { return m[Number(n)] || ''; });
        }
        break;
      }
      return t;
    }

    // GitHub Desktop 的编辑菜单用 new Menu() + append(MenuItem) 构建，绕过 buildFromTemplate，
    // 这里对 append / insert 再做一层 role -> 中文 label 的兜底
    function localizeItem(item) {
      try {
        if (!item || !item.role) { return; }
        var zh = ROLE_ZH[item.role];
        if (!zh) { return; }
        var cur = item.label;
        if (!cur || /^[A-Za-z]/.test(String(cur))) { item.label = zh; }
      } catch (e) {}
    }

    if (!Menu.prototype.__zhAppendPatched) {
      var origAppend = Menu.prototype.append;
      Menu.prototype.append = function (item) {
        localizeItem(item);
        return origAppend.apply(this, arguments);
      };
      var origInsert = Menu.prototype.insert;
      if (origInsert) {
        Menu.prototype.insert = function (pos, item) {
          localizeItem(item);
          return origInsert.apply(this, arguments);
        };
      }
      Menu.prototype.__zhAppendPatched = true;
    }

    var orig = Menu.buildFromTemplate.bind(Menu);
    Menu.buildFromTemplate = function (template) {
      try {
        var walk = function (items) {
          if (!Array.isArray(items)) { return; }
          for (var i = 0; i < items.length; i++) {
            var it = items[i];
            if (!it) { continue; }
            if (typeof it.label === 'string') { it.label = conv(it.label); }
            if (!it.label && it.role && ROLE_ZH[it.role]) { it.label = ROLE_ZH[it.role]; }
            if (Array.isArray(it.submenu)) { walk(it.submenu); }
          }
        };
        walk(template);
      } catch (e) {}
      return orig(template);
    };
    Menu.__zhPatched = true;
  })();
} catch (e) {}