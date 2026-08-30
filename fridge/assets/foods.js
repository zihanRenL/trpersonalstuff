/* =========================================================
   foods.js — 食材库（全局默认保质期）
   这里改的是"以后新加入时的默认天数"，
   已经在库存里的记录一律不动 —— 那个入口在首页每条记录的「改」。
   ========================================================= */
(function () {
  'use strict';

  var S = window.Store, U = window.UI;
  var foods = [];
  var usedNames = {};
  var query = '';
  var filter = '全部';

  var STORAGES = ['冷藏', '冷冻', '常温'];

  function visible() {
    var q = query.trim().toLowerCase();
    return foods
      .filter(function (f) {
        if (filter !== '全部' && f.storage !== filter) return false;
        return !q || String(f.name).toLowerCase().indexOf(q) >= 0;
      })
      .sort(function (a, b) {
        return String(a.name).localeCompare(String(b.name), 'zh');
      });
  }

  function render() {
    var list = visible();

    var html = '' +
      '<div class="page-head">' +
        '<h1 class="page-title">食材库</h1>' +
        '<p class="page-note">共 ' + foods.length + ' 种</p>' +
      '</div>' +

      '<p class="count-note">这里存的是每种食材的<b>默认</b>保质期。改了只影响之后新加入的同名食材，' +
        '已经在库存里的记录不受影响（要改某一份，去首页点那条的「改」）。</p>' +

      '<div class="searchbar"><input id="q" type="search" placeholder="搜食材名" value="' + U.esc(query) + '"></div>' +

      '<div class="chips" id="filters">' +
        ['全部'].concat(STORAGES).map(function (s) {
          return '<button type="button" class="chip' + (s === filter ? ' on' : '') + '" data-f="' + s + '">' + s + '</button>';
        }).join('') +
      '</div>' +

      (list.length
        ? '<div class="list" id="rows">' + list.map(function (f) {
            return '<article class="row" data-id="' + U.esc(f.id) + '">' +
              '<span class="row-name">' + U.esc(f.name) + '</span>' +
              '<span class="badge badge-store">' + U.esc(f.storage) + '</span>' +
              '<span class="row-days">默认 ' + f.default_days + ' 天</span>' +
              '<button type="button" class="mini" data-act="edit">改</button>' +
            '</article>';
          }).join('') + '</div>'
        : '<div class="empty"><b>没有匹配的食材</b>换个关键词，或者点右下角新建一种。</div>');

    U.el('#app').innerHTML = html;

    var q = U.el('#q');
    q.addEventListener('input', function () {
      query = q.value;
      var pos = q.selectionStart;
      render();
      var q2 = U.el('#q');
      q2.focus();
      try { q2.setSelectionRange(pos, pos); } catch (e) {}
    });

    U.els('#filters .chip').forEach(function (c) {
      c.addEventListener('click', function () {
        filter = c.getAttribute('data-f');
        render();
      });
    });

    U.els('#rows .row').forEach(function (row) {
      row.addEventListener('click', function (e) {
        if (!e.target.closest('button[data-act]')) return;
        openEdit(row.getAttribute('data-id'));
      });
    });
  }

  function failed(e) {
    console.error(e);
    U.toast('操作失败：' + (e && e.message ? e.message : '请稍后再试'), { tone: 'warn' });
  }

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
    // 延时 focus 会在用户已经点了别的输入框之后把焦点硬拽回来。
    var first = back.querySelector('input');
    if (first && !back.contains(document.activeElement)) first.focus();
  }

  function formBody(f, opts) {
    return '' +
      '<form id="ff">' +
        '<label class="field"><span>食材名称</span>' +
          '<input id="ff-name" value="' + U.esc(f.name || '') + '" autocomplete="off" required>' +
        '</label>' +
        '<label class="field"><span>默认保质期（天）</span>' +
          '<input id="ff-days" type="number" inputmode="numeric" min="0" max="3650" value="' +
            (f.default_days == null ? 7 : f.default_days) + '" required>' +
        '</label>' +
        '<label class="field"><span>储存方式</span></label>' +
        '<div class="seg" style="margin:-9px 0 13px">' +
          STORAGES.map(function (s) {
            return '<label><input type="radio" name="ff-store" value="' + s + '"' +
              ((f.storage || '冷藏') === s ? ' checked' : '') + '><span>' + s + '</span></label>';
          }).join('') +
        '</div>' +
        '<p class="field-hint">' + opts.hint + '</p>' +
        '<div class="sheet-acts">' +
          (opts.canDelete ? '<button type="button" class="btn btn-danger" id="ff-del">删除</button>' : '') +
          '<button type="submit" class="btn btn-primary">' + opts.submit + '</button>' +
        '</div>' +
      '</form>';
  }

  function readForm(back) {
    return {
      name: U.el('#ff-name', back).value.trim(),
      default_days: parseInt(U.el('#ff-days', back).value, 10),
      storage: (back.querySelector('input[name="ff-store"]:checked') || {}).value || '冷藏'
    };
  }

  function valid(v) {
    if (!v.name) { U.toast('食材名称不能为空', { tone: 'warn' }); return false; }
    if (!isFinite(v.default_days) || v.default_days < 0) { U.toast('默认保质期填个 0 以上的整数', { tone: 'warn' }); return false; }
    return true;
  }

  function openEdit(id) {
    var f = foods.filter(function (x) { return x.id === id; })[0];
    if (!f) return;
    var used = usedNames[f.name] || 0;

    openSheet('修改默认值 · ' + f.name, formBody(f, {
      submit: '保存默认值',
      canDelete: true,
      hint: '改完只对<b>以后</b>新加入的「' + U.esc(f.name) + '」生效' +
        (used ? '；库存里现有的 ' + used + ' 份不会变' : '') + '。'
    }), function (back, close) {
      var del = U.el('#ff-del', back);
      if (del) del.addEventListener('click', function () {
        if (!confirm('把「' + f.name + '」从食材库里删掉？\n（库存里已有的记录不受影响）')) return;
        S.deleteFood(id).then(function () { close(); return reload(); }).catch(failed);
      });

      U.el('#ff', back).addEventListener('submit', function (e) {
        e.preventDefault();
        var v = readForm(back);
        if (!valid(v)) return;
        var clash = foods.filter(function (x) { return x.id !== id && x.name === v.name; })[0];
        if (clash) { U.toast('食材库里已经有「' + v.name + '」了', { tone: 'warn' }); return; }
        S.updateFood(id, v)
          .then(function () { close(); return reload(); })
          .then(function () { U.toast('「' + v.name + '」的默认值已更新'); })
          .catch(failed);
      });
    });
  }

  function openNew() {
    openSheet('新建食材', formBody({ storage: '冷藏', default_days: 7 }, {
      submit: '存进食材库',
      canDelete: false,
      hint: '只是登记默认值，不会往库存里加东西。要加库存去首页。'
    }), function (back, close) {
      U.el('#ff', back).addEventListener('submit', function (e) {
        e.preventDefault();
        var v = readForm(back);
        if (!valid(v)) return;
        if (foods.filter(function (x) { return x.name === v.name; })[0]) {
          U.toast('食材库里已经有「' + v.name + '」了', { tone: 'warn' });
          return;
        }
        S.addFood(v)
          .then(function () { close(); return reload(); })
          .then(function () { U.toast('「' + v.name + '」已存进食材库'); })
          .catch(failed);
      });
    });
  }

  function reload() {
    return Promise.all([S.listFoods(), S.listItems()]).then(function (r) {
      foods = r[0] || [];
      usedNames = {};
      (r[1] || []).forEach(function (i) {
        if (i.status !== '已处理') usedNames[i.food_name] = (usedNames[i.food_name] || 0) + 1;
      });
      U.renderModeBar();
      render();
    });
  }

  U._onData = function () { reload(); };

  U.boot('foods', function () {
    var fab = U.el('#fab');
    fab.hidden = false;
    fab.textContent = '＋ 新建食材';
    fab.addEventListener('click', openNew);
    return reload();
  });
})();
