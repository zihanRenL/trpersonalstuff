/* =========================================================
   pedia.js — 蔬菜储存百科
   纯静态内容页，和库存数据无关，不需要登录也能看。
   ========================================================= */
(function () {
  'use strict';

  var U = window.UI;
  var DATA = window.PEDIA || [];
  var CATS = ['全部'].concat(DATA.map(function (d) { return d.category; })
    .filter(function (c, i, a) { return a.indexOf(c) === i; }));

  var query = '';
  var cat = '全部';

  function tagClass(v) {
    if (v === '要冷藏' || v === '要密封') return 'tag-yes';
    if (v === '别冷藏' || v === '别密封') return 'tag-no';
    return 'tag-maybe';
  }

  function visible() {
    var q = query.trim().toLowerCase();
    return DATA.filter(function (d) {
      if (cat !== '全部' && d.category !== cat) return false;
      if (!q) return true;
      return (d.name + d.category + d.how + d.myth).toLowerCase().indexOf(q) >= 0;
    });
  }

  function cardHTML(d) {
    return '' +
      '<article class="pedia-card">' +
        '<div class="pedia-head">' +
          '<span class="pedia-name">' + U.esc(d.name) + '</span>' +
          '<span class="tag ' + tagClass(d.fridge) + '">' + U.esc(d.fridge) + '</span>' +
          '<span class="tag ' + tagClass(d.seal) + '">' + U.esc(d.seal) + '</span>' +
        '</div>' +
        '<p class="pedia-line"><b>怎么存</b>' + U.esc(d.how) + '</p>' +
        '<p class="pedia-line myth"><b>常见误区</b>' + U.esc(d.myth) + '</p>' +
      '</article>';
  }

  function render() {
    var list = visible();

    U.el('#app').innerHTML = '' +
      '<div class="page-head">' +
        '<h1 class="page-title">储存百科</h1>' +
        '<p class="page-note">' + DATA.length + ' 条</p>' +
      '</div>' +

      '<p class="count-note">常见蔬菜到底要不要冷藏、要不要密封，以及那些一直在悄悄缩短保质期的习惯。</p>' +

      '<div class="searchbar"><input id="q" type="search" placeholder="搜蔬菜名，或者搜「乙烯」「密封」这类词" value="' + U.esc(query) + '"></div>' +

      '<div class="chips" id="cats">' +
        CATS.map(function (c) {
          return '<button type="button" class="chip' + (c === cat ? ' on' : '') + '" data-c="' + U.esc(c) + '">' + U.esc(c) + '</button>';
        }).join('') +
      '</div>' +

      (list.length
        ? '<div class="list">' + list.map(cardHTML).join('') + '</div>'
        : '<div class="empty"><b>没找到</b>换个说法试试，或者点上面的「全部」。</div>');

    var q = U.el('#q');
    q.addEventListener('input', function () {
      query = q.value;
      var pos = q.selectionStart;
      render();
      var q2 = U.el('#q');
      q2.focus();
      try { q2.setSelectionRange(pos, pos); } catch (e) {}
    });

    U.els('#cats .chip').forEach(function (c) {
      c.addEventListener('click', function () {
        cat = c.getAttribute('data-c');
        render();
      });
    });
  }

  U.renderChrome('pedia');
  render();
})();
