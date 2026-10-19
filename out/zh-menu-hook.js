/* ZHD-MENU-HOOK: GitHub Desktop 简体中文补丁 - 原生菜单运行时钩子（可重复追加，勿手改） */
try {
  (function () {
    if (typeof require !== 'function') { return; }
    var el = null;
    try { el = require('electron'); } catch (e) { return; }
    if (!el || !el.Menu) { return; }
    var Menu = el.Menu;
    if (Menu.__zhPatched) { return; }

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

    var orig = Menu.buildFromTemplate.bind(Menu);
    Menu.buildFromTemplate = function (template) {
      try {
        var walk = function (items) {
          if (!Array.isArray(items)) { return; }
          for (var i = 0; i < items.length; i++) {
            var it = items[i];
            if (!it) { continue; }
            if (typeof it.label === 'string') { it.label = conv(it.label); }
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