/* =========================================================
   home.js — 库存首页
   剩余天数 = 保质期天数 −（今天 − 加入日期）
   红 ≤2 天 / 橙 3–6 天 / 绿 >6 天，红橙优先于"新加入"的绿色标记
   ========================================================= */
(function () {
  'use strict';

  var S = window.Store, U = window.UI;
  var foods = [];
  var items = [];
  var showDone = false;

  /* ---------------- 渲染 ---------------- */

  function inStock() {
    return items.filter(function (i) { return i.status !== '已处理'; });
  }

  function doneItems() {
    return items.filter(function (i) { return i.status === '已处理'; })
      .sort(function (a, b) { return String(b.processed_at || '').localeCompare(String(a.processed_at || '')); });
  }

  function storageOf(name) {
    var f = foods.filter(function (x) { return x.name === name; })[0];
    return f ? f.storage : null;
  }

  function daysText(r) {
    if (r < 0) return { big: String(-r), small: '天前过期' };
    if (r === 0) return { big: '0', small: '今天到期' };
    return { big: String(r), small: '天后过期' };
  }

  function cardHTML(item) {
    var r = S.remainingDays(item);
    var level = S.levelOf(r);
    var t = daysText(r);
    // 加入 2 天内算新加入；红/橙优先，只有绿色档才显示这个标记
    var isNew = S.daysBetween(item.added_on, S.todayISO()) <= 2;
    var store = storageOf(item.food_name);

    return '' +
      '<article class="card ' + level + '" data-id="' + U.esc(item.id) + '">' +
        '<div class="card-main">' +
          '<div class="card-name">' + U.esc(item.food_name) +
            (level === 'green' && isNew ? '<span class="badge badge-new">新加入</span>' : '') +
            (store ? '<span class="badge badge-store">' + U.esc(store) + '</span>' : '') +
          '</div>' +
          '<div class="card-meta">' +
            U.esc(item.added_on) + ' 加入 · 保质期 ' + item.shelf_days + ' 天' +
          '</div>' +
        '</div>' +
        '<div class="days ' + level + '"><b>' + t.big + '</b><span>' + t.small + '</span></div>' +
        '<div class="card-acts">' +
          '<button type="button" class="mini mini-go" data-act="done">已处理</button>' +
          '<button type="button" class="mini" data-act="edit">改</button>' +
        '</div>' +
      '</article>';
  }

  function doneCardHTML(item) {
    return '' +
      '<article class="card done" data-id="' + U.esc(item.id) + '">' +
        '<div class="card-main">' +
          '<div class="card-name">' + U.esc(item.food_name) + '</div>' +
          '<div class="card-meta">' + U.esc(item.added_on) + ' 加入 · 已处理</div>' +
        '</div>' +
        '<div class="days done"><b>✓</b><span>处理掉了</span></div>' +
        '<div class="card-acts">' +
          '<button type="button" class="mini" data-act="restore">放回</button>' +
          '<button type="button" class="mini" data-act="drop">删除</button>' +
        '</div>' +
      '</article>';
  }

  function render() {
    var live = inStock().sort(function (a, b) {
      var d = S.remainingDays(a) - S.remainingDays(b);
      return d !== 0 ? d : String(a.food_name).localeCompare(String(b.food_name), 'zh');
    });

    var counts = { red: 0, orange: 0, green: 0 };
    live.forEach(function (i) { counts[S.levelOf(S.remainingDays(i))]++; });

    var done = doneItems();

    var html = '' +
      '<div class="page-head">' +
        '<h1 class="page-title">我的库存</h1>' +
        '<p class="page-note">' + S.todayISO() + ' · 共 ' + live.length + ' 份</p>' +
      '</div>' +

      '<div class="summary">' +
        '<div class="sum red"><b>' + counts.red + '</b><span>≤2 天 快做掉</span></div>' +
        '<div class="sum orange"><b>' + counts.orange + '</b><span>3–6 天 留意</span></div>' +
        '<div class="sum green"><b>' + counts.green + '</b><span>还早</span></div>' +
      '</div>' +

      (live.length
        ? '<div class="list" id="list">' + live.map(cardHTML).join('') + '</div>'
        : '<div class="empty"><b>冰箱是空的</b>点右下角「＋ 加食材」把买回来的东西记上。</div>') +

      (done.length
        ? '<div class="section-label">已处理 ' + done.length + ' 条 ' +
            '<button type="button" class="linkbtn" id="toggledone">' + (showDone ? '收起' : '展开') + '</button>' +
          '</div>' +
          (showDone ? '<div class="list" id="donelist">' + done.map(doneCardHTML).join('') + '</div>' : '')
        : '');

    U.el('#app').innerHTML = html;

    var tg = U.el('#toggledone');
    if (tg) tg.addEventListener('click', function () { showDone = !showDone; render(); });

    U.els('#list .card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-act]');
        if (!btn) return;
        var id = card.getAttribute('data-id');
        if (btn.getAttribute('data-act') === 'done') markDone(id);
        else openEditSheet(id);
      });
    });

    U.els('#donelist .card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-act]');
        if (!btn) return;
        var id = card.getAttribute('data-id');
        if (btn.getAttribute('data-act') === 'restore') {
          S.updateItem(id, { status: '在库' }).then(reload);
        } else if (confirm('永久删除这条记录？')) {
          S.deleteItem(id).then(reload);
        }
      });
    });
  }

  /* ---------------- 操作 ---------------- */

  function markDone(id) {
    var item = items.filter(function (i) { return i.id === id; })[0];
    S.updateItem(id, { status: '已处理' })
      .then(reload)
      .then(function () {
        U.toast('「' + (item ? item.food_name : '这份食材') + '」已处理', {
          actionLabel: '撤销',
          onAction: function () { S.updateItem(id, { status: '在库' }).then(reload); }
        });
      })
      .catch(failed);
  }

  function failed(e) {
    console.error(e);
    U.toast('操作失败：' + U.explainError(e), { tone: 'warn', duration: 14000 });
  }

  /* ---------------- 弹层 ---------------- */

  function openSheet(title, bodyHTML, wire) {
    var back = document.createElement('div');
    back.className = 'sheet-back';
    back.innerHTML =
      '<div class="sheet" role="dialog" aria-modal="true">' +
        '<div class="sheet-head">' +
          '<h2 class="sheet-title">' + U.esc(title) + '</h2>' +
          '<button type="button" class="sheet-x" aria-label="关闭">×</button>' +
        '</div>' + bodyHTML +
      '</div>';
    document.body.appendChild(back);

    function close() {
      back.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    back.addEventListener('click', function (e) { if (e.target === back) close(); });
    U.el('.sheet-x', back).addEventListener('click', close);
    document.addEventListener('keydown', onKey);

    wire(back, close);
    // 立刻聚焦，且只在弹层里还没有任何东西被聚焦时才做 ——
    // 以前这里挂了个 30ms 的延时 focus，用户手快先点了别的框，
    // 焦点会被硬拽回第一个输入框，后面敲的字就跑到名称栏里去了。
    var first = back.querySelector('input, select');
    if (first && !back.contains(document.activeElement)) first.focus();
    return close;
  }

  /* -------- 添加食材 -------- */

  function openAddSheet() {
    var today = S.todayISO();

    // 用得最多的几种，一键填入
    var freq = {};
    items.forEach(function (i) { freq[i.food_name] = (freq[i.food_name] || 0) + 1; });
    var quick = Object.keys(freq)
      .sort(function (a, b) { return freq[b] - freq[a]; })
      .slice(0, 6);

    var body = '' +
      '<form id="addform">' +
        (quick.length
          ? '<div class="chips" id="quick">' + quick.map(function (n) {
              return '<button type="button" class="chip" data-name="' + U.esc(n) + '">' + U.esc(n) + '</button>';
            }).join('') + '</div>'
          : '') +

        '<label class="field"><span>食材名称</span>' +
          '<input id="f-name" list="foodlist" autocomplete="off" placeholder="选一个，或直接打新名字" required>' +
        '</label>' +
        '<datalist id="foodlist">' +
          foods.map(function (f) { return '<option value="' + U.esc(f.name) + '">'; }).join('') +
        '</datalist>' +

        '<div class="field-row">' +
          '<label class="field"><span>这一份的保质期（天）</span>' +
            '<input id="f-days" type="number" inputmode="numeric" min="0" max="3650" value="7" required>' +
          '</label>' +
          '<label class="field"><span>加入日期</span>' +
            '<input id="f-date" type="date" value="' + today + '">' +
          '</label>' +
        '</div>' +
        '<p class="field-hint" id="f-hint">加入日期默认是今天。</p>' +

        '<div id="f-newbox" hidden>' +
          '<label class="field"><span>储存方式</span></label>' +
          '<div class="seg" style="margin:-9px 0 13px">' +
            ['冷藏', '冷冻', '常温'].map(function (s, idx) {
              return '<label><input type="radio" name="f-store" value="' + s + '"' + (idx === 0 ? ' checked' : '') + '><span>' + s + '</span></label>';
            }).join('') +
          '</div>' +
        '</div>' +

        '<div class="sheet-acts">' +
          '<button type="button" class="btn" id="f-cancel">取消</button>' +
          '<button type="submit" class="btn btn-primary">加入库存</button>' +
        '</div>' +
      '</form>';

    openSheet('加入库存', body, function (back, close) {
      var name = U.el('#f-name', back);
      var days = U.el('#f-days', back);
      var hint = U.el('#f-hint', back);
      var newbox = U.el('#f-newbox', back);

      // 用户一旦自己动过天数，就不能再被自动填充覆盖掉 —— 换成另一种食材时才重置。
      // （典型场景：选了豆腐自动填 3 天，按包装改成 5 天，回头再碰一下名称框，
      //   datalist 会再抛一个 change，5 天就被悄悄改回 3 天了。）
      var daysTouched = false;
      var lastName = null;

      days.addEventListener('input', function () { daysTouched = true; });

      function sync() {
        var v = name.value.trim();
        if (v !== lastName) { daysTouched = false; lastName = v; }

        var known = foods.filter(function (f) { return f.name === v; })[0];
        if (known) {
          if (!daysTouched) days.value = known.default_days;
          newbox.hidden = true;
          hint.textContent = '默认保质期 ' + known.default_days + ' 天（' + known.storage +
            '）。包装上写的和这个不一样，就直接改上面的天数，只影响这一份。';
        } else {
          newbox.hidden = !v;
          hint.textContent = v
            ? '「' + v + '」还不在食材库里。加入库存的同时，会用这里填的天数把它存进食材库，下次直接选。'
            : '加入日期默认是今天。';
        }
      }

      name.addEventListener('input', sync);
      name.addEventListener('change', sync);

      U.els('#quick .chip', back).forEach(function (c) {
        c.addEventListener('click', function () {
          name.value = c.getAttribute('data-name');
          sync();
        });
      });

      U.el('#f-cancel', back).addEventListener('click', close);

      U.el('#addform', back).addEventListener('submit', function (e) {
        e.preventDefault();
        var v = name.value.trim();
        if (!v) return;
        var d = parseInt(days.value, 10);
        if (!isFinite(d) || d < 0) { U.toast('保质期天数填个 0 以上的整数', { tone: 'warn' }); return; }

        var known = foods.filter(function (f) { return f.name === v; })[0];
        var pre = known
          ? Promise.resolve()
          : S.addFood({
              name: v,
              default_days: d,
              storage: (back.querySelector('input[name="f-store"]:checked') || {}).value || '冷藏'
            });

        pre.then(function () {
          return S.addItem({
            food_name: v,
            added_on: U.el('#f-date', back).value || today,
            shelf_days: d
          });
        })
          .then(function () { close(); return reload(); })
          .then(function () {
            U.toast('「' + v + '」已加入库存' + (known ? '' : '，并存进了食材库'));
          })
          .catch(failed);
      });

      sync();
    });
  }

  /* -------- 修改这一份（只影响这一份） -------- */

  function openEditSheet(id) {
    var item = items.filter(function (i) { return i.id === id; })[0];
    if (!item) return;

    var body = '' +
      '<form id="editform">' +
        '<div class="field-row">' +
          '<label class="field"><span>这一份的保质期（天）</span>' +
            '<input id="e-days" type="number" inputmode="numeric" min="0" max="3650" value="' + item.shelf_days + '" required>' +
          '</label>' +
          '<label class="field"><span>加入日期</span>' +
            '<input id="e-date" type="date" value="' + U.esc(item.added_on) + '">' +
          '</label>' +
        '</div>' +
        '<p class="field-hint" id="e-preview"></p>' +
        '<p class="field-hint">只改这一份，用来对上包装实际标注的日期。' +
          '要改「' + U.esc(item.food_name) + '」以后新加入时的默认天数，去<a href="foods.html">食材库</a>。</p>' +
        '<div class="sheet-acts">' +
          '<button type="button" class="btn btn-danger" id="e-del">删除</button>' +
          '<button type="submit" class="btn btn-primary">保存</button>' +
        '</div>' +
      '</form>';

    openSheet('修改「' + item.food_name + '」这一份', body, function (back, close) {
      var days = U.el('#e-days', back);
      var date = U.el('#e-date', back);
      var prev = U.el('#e-preview', back);

      function preview() {
        var d = parseInt(days.value, 10);
        if (!isFinite(d) || !date.value) { prev.textContent = ''; return; }
        var r = d - S.daysBetween(date.value, S.todayISO());
        var t = daysText(r);
        prev.textContent = '改完之后：' + (r < 0 ? '已经过期 ' + t.big + ' 天' : t.big + ' ' + t.small);
      }
      days.addEventListener('input', preview);
      date.addEventListener('change', preview);
      preview();

      U.el('#e-del', back).addEventListener('click', function () {
        if (!confirm('删除「' + item.food_name + '」这条记录？')) return;
        S.deleteItem(id).then(function () { close(); return reload(); }).catch(failed);
      });

      U.el('#editform', back).addEventListener('submit', function (e) {
        e.preventDefault();
        var d = parseInt(days.value, 10);
        if (!isFinite(d) || d < 0) { U.toast('保质期天数填个 0 以上的整数', { tone: 'warn' }); return; }
        S.updateItem(id, { shelf_days: d, added_on: date.value || item.added_on })
          .then(function () { close(); return reload(); })
          .then(function () { U.toast('这一份已更新'); })
          .catch(failed);
      });
    });
  }

  /* ---------------- 启动 ---------------- */

  function reload() {
    return Promise.all([S.listFoods(), S.listItems()]).then(function (r) {
      foods = r[0] || [];
      items = r[1] || [];
      U.renderModeBar();
      render();
    });
  }

  U._onData = function () { reload(); };

  U.boot('home', function () {
    U.el('#fab').hidden = false;
    U.el('#fab').addEventListener('click', openAddSheet);
    // 跨过午夜还开着页面时，剩余天数要跟着日期走
    var day = S.todayISO();
    setInterval(function () {
      if (S.todayISO() !== day) { day = S.todayISO(); render(); }
    }, 60000);
    return reload();
  });
})();
