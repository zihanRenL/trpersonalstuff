/* =========================================================
   ui.js — 三个页面共用的外壳
   顶栏 / 标签页 / 提示条 / 登录闸门 / PWA 注册
   ========================================================= */
(function () {
  'use strict';

  var UI = {};

  /* ---------------- 小工具 ---------------- */

  UI.el = function (sel, root) { return (root || document).querySelector(sel); };
  UI.els = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  UI.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  /* 把后端的原始报错翻成"该去哪儿改" —— 这两种是配置没配完时唯一会碰到的 */
  UI.explainError = function (e) {
    var msg = (e && e.message) ? e.message : String(e || '');
    if (/permission denied/i.test(msg)) {
      return msg + '（数据库没给 authenticated 授权：去 Supabase 的 SQL Editor 跑一遍 schema.sql 里 GRANT 那一段）';
    }
    if (/schema cache|PGRST205|relation .* does not exist/i.test(msg)) {
      return msg + '（表还没建：去 Supabase 的 SQL Editor 把 schema.sql 整个跑一遍）';
    }
    return msg || '请稍后再试';
  };

  /* ---------------- 提示条（带撤销按钮） ---------------- */

  var toastTimer = null;

  UI.toast = function (message, opts) {
    opts = opts || {};
    var host = UI.el('#toast');
    if (!host) return;
    clearTimeout(toastTimer);

    host.innerHTML = '<span>' + UI.esc(message) + '</span>' +
      (opts.actionLabel ? '<button type="button" class="toast-act">' + UI.esc(opts.actionLabel) + '</button>' : '');
    host.className = 'toast show' + (opts.tone ? ' toast-' + opts.tone : '');

    var btn = UI.el('.toast-act', host);
    if (btn) {
      btn.addEventListener('click', function () {
        host.className = 'toast';
        if (opts.onAction) opts.onAction();
      });
    }
    toastTimer = setTimeout(function () { host.className = 'toast'; }, opts.duration || 5000);
  };

  /* ---------------- 顶栏 ---------------- */

  var TABS = [
    { href: 'index.html',  label: '库存',  key: 'home' },
    { href: 'foods.html',  label: '食材库', key: 'foods' },
    { href: 'pedia.html',  label: '储存百科', key: 'pedia' }
  ];

  UI.renderChrome = function (activeKey) {
    var head = UI.el('#appbar');
    if (!head) return;
    head.innerHTML =
      '<div class="appbar-in">' +
        '<a class="logo" href="index.html"><span class="logo-mark"></span>冰箱</a>' +
        '<nav class="tabs">' +
          TABS.map(function (t) {
            return '<a href="' + t.href + '"' + (t.key === activeKey ? ' class="on" aria-current="page"' : '') + '>' + t.label + '</a>';
          }).join('') +
        '</nav>' +
        '<div class="appbar-end" id="appbar-end"></div>' +
      '</div>' +
      '<div class="modebar" id="modebar" hidden></div>';
  };

  UI.renderModeBar = function () {
    var bar = UI.el('#modebar');
    var end = UI.el('#appbar-end');
    if (!bar) return;

    if (window.Store.mode === 'local') {
      bar.hidden = false;
      bar.className = 'modebar';
      bar.innerHTML = '本机模式 · 数据只存在这台设备，换设备看不到，也没有登录保护。' +
        '想在手机和电脑之间同步，按 <code>fridge/README.md</code> 配置 Supabase。';
      if (end) end.innerHTML = '';
      return;
    }

    if (window.Store.offline) {
      bar.hidden = false;
      bar.className = 'modebar warn';
      bar.innerHTML = '离线中 · 下面显示的是上次同步的快照，改动暂时存不上去。';
    } else {
      bar.hidden = true;
      bar.innerHTML = '';
    }

    if (end && window.Store.user) {
      end.innerHTML = '<button type="button" class="linkbtn" id="signout">退出</button>';
      UI.el('#signout').addEventListener('click', function () {
        window.Store.signOut().then(function () { location.reload(); });
      });
    }
  };

  /* ---------------- 登录闸门 ---------------- */

  function loginMarkup() {
    return '' +
      '<div class="gate">' +
        '<form class="gate-card" id="loginform">' +
          '<h1 class="gate-title">冰箱</h1>' +
          '<p class="gate-sub">食材过期提醒 · 请先登录</p>' +
          '<label class="field"><span>邮箱</span>' +
            '<input type="email" id="gate-email" autocomplete="username" required></label>' +
          '<label class="field"><span>密码</span>' +
            '<input type="password" id="gate-pw" autocomplete="current-password" required></label>' +
          '<p class="gate-err" id="gate-err" hidden></p>' +
          '<button class="btn btn-primary btn-wide" type="submit" id="gate-go">登录</button>' +
        '</form>' +
      '</div>';
  }

  /* 启动流程：初始化数据层 → 需要登录就先挡住 → 通过后跑页面自己的 start() */
  UI.boot = function (activeKey, start) {
    UI.renderChrome(activeKey);

    var root = UI.el('#app');

    function run() {
      UI.renderModeBar();
      return Promise.resolve()
        .then(function () {
          return window.Store.mode === 'cloud' ? window.Store.seedIfEmpty() : null;
        })
        .catch(function (e) {
          console.warn('[fridge] 预置食材写入跳过', e);
          UI.toast('预置食材没写进去：' + UI.explainError(e), { tone: 'warn', duration: 14000 });
        })
        .then(function () { return start(); });
    }

    function gate() {
      root.innerHTML = loginMarkup();
      var form = UI.el('#loginform');
      var err = UI.el('#gate-err');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = UI.el('#gate-go');
        btn.disabled = true;
        btn.textContent = '登录中…';
        err.hidden = true;
        window.Store.signIn(UI.el('#gate-email').value.trim(), UI.el('#gate-pw').value)
          .then(function () { root.innerHTML = ''; return run(); })
          .catch(function (e2) {
            err.hidden = false;
            err.textContent = '登录失败：' + (e2 && e2.message ? e2.message : '请检查邮箱和密码');
            btn.disabled = false;
            btn.textContent = '登录';
          });
      });
    }

    root.innerHTML = '<p class="loading">载入中…</p>';

    window.Store.init()
      .then(function () {
        if (window.Store.needsAuth && !window.Store.user) return gate();
        root.innerHTML = '';
        return run();
      })
      .catch(function (e) {
        console.error(e);
        root.innerHTML = '<p class="loading">连接后端失败：' + UI.esc(e && e.message ? e.message : e) +
          '<br><br>检查 <code>fridge/config.js</code> 里的地址和 key，或者清空这两项回到本机模式。</p>';
      });

    // 数据变了（本机写入或其他设备的实时推送）就重画
    window.Store.onChange(function () {
      if (typeof UI._onData === 'function') UI._onData();
    });
  };

  /* ---------------- PWA ---------------- */

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (e) {
        console.warn('[fridge] Service Worker 注册失败', e);
      });
    });
  }

  window.UI = UI;
})();
