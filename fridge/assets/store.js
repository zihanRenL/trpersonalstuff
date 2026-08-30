/* =========================================================
   store.js — 数据层
   ---------------------------------------------------------
   对页面暴露一套统一的异步接口，底下有两种实现：
     LocalBackend  数据存 localStorage（config.js 没填时）
     CloudBackend  数据存 Supabase，带登录和实时同步（config.js 填了时）
   页面代码完全不需要知道当前是哪一种。
   ========================================================= */
(function () {
  'use strict';

  var CFG = window.FRIDGE_CONFIG || {};
  var HAS_CLOUD = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);

  var K_FOODS  = 'fridge.foods.v1';
  var K_ITEMS  = 'fridge.items.v1';
  var K_MIRROR = 'fridge.mirror.v1';

  /* ---------------- 日期工具（一律按本地时区算） ---------------- */

  function todayISO() {
    var d = new Date();
    return isoOf(d);
  }

  function isoOf(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  // 把 'YYYY-MM-DD' 解析成本地时间的当天零点，避免 new Date(str) 按 UTC 解析导致差一天
  function parseISO(s) {
    var p = String(s || '').split('-');
    return new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1);
  }

  // 两个日期之间隔了几个整天
  function daysBetween(fromISO, toISO) {
    var a = parseISO(fromISO), b = parseISO(toISO);
    return Math.round((b - a) / 86400000);
  }

  // 剩余天数 = 保质期天数 −（今天 − 加入日期）
  function remainingDays(item, ref) {
    return item.shelf_days - daysBetween(item.added_on, ref || todayISO());
  }

  /* ---------------- 颜色分级 ----------------
     红：剩余 ≤ 2
     橙：2 < 剩余 ≤ 6
     绿：剩余 > 6
     红/橙优先于"新加入"的绿色标记
  ------------------------------------------- */
  function levelOf(remaining) {
    if (remaining <= 2) return 'red';
    if (remaining <= 6) return 'orange';
    return 'green';
  }

  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function normStorage(s) {
    return (s === '冷冻' || s === '常温') ? s : '冷藏';
  }

  function normDays(n) {
    n = parseInt(n, 10);
    if (!isFinite(n) || n < 0) n = 0;
    return Math.min(n, 3650);
  }

  /* =========================================================
     本机模式
     ========================================================= */

  function LocalBackend() {
    this.kind = 'local';
    this.needsAuth = false;
    this._subs = [];
  }

  LocalBackend.prototype._foods = function () {
    var foods = readJSON(K_FOODS, null);
    if (!foods) {
      foods = (window.SEED_FOODS || []).map(function (f) {
        return {
          id: uid(),
          name: f.name,
          default_days: normDays(f.days),
          storage: normStorage(f.storage)
        };
      });
      writeJSON(K_FOODS, foods);
    }
    return foods;
  };

  LocalBackend.prototype._items = function () {
    return readJSON(K_ITEMS, []);
  };

  LocalBackend.prototype._emit = function () {
    this._subs.forEach(function (cb) { try { cb(); } catch (e) {} });
  };

  LocalBackend.prototype.init = function () { return Promise.resolve(); };

  LocalBackend.prototype.onChange = function (cb) { this._subs.push(cb); };

  LocalBackend.prototype.listFoods = function () {
    return Promise.resolve(this._foods().slice());
  };

  LocalBackend.prototype.addFood = function (food) {
    var foods = this._foods();
    var name = String(food.name || '').trim();
    var hit = foods.filter(function (f) { return f.name === name; })[0];
    if (hit) return Promise.resolve(hit);
    var row = {
      id: uid(),
      name: name,
      default_days: normDays(food.default_days),
      storage: normStorage(food.storage)
    };
    foods.push(row);
    writeJSON(K_FOODS, foods);
    this._emit();
    return Promise.resolve(row);
  };

  LocalBackend.prototype.updateFood = function (id, patch) {
    var foods = this._foods();
    foods.forEach(function (f) {
      if (f.id !== id) return;
      if (patch.name !== undefined) f.name = String(patch.name).trim();
      if (patch.default_days !== undefined) f.default_days = normDays(patch.default_days);
      if (patch.storage !== undefined) f.storage = normStorage(patch.storage);
    });
    writeJSON(K_FOODS, foods);
    this._emit();
    return Promise.resolve();
  };

  LocalBackend.prototype.deleteFood = function (id) {
    var foods = this._foods().filter(function (f) { return f.id !== id; });
    writeJSON(K_FOODS, foods);
    this._emit();
    return Promise.resolve();
  };

  LocalBackend.prototype.listItems = function () {
    return Promise.resolve(this._items().slice());
  };

  LocalBackend.prototype.addItem = function (item) {
    var items = this._items();
    var row = {
      id: uid(),
      food_name: String(item.food_name || '').trim(),
      added_on: item.added_on || todayISO(),
      shelf_days: normDays(item.shelf_days),
      status: '在库',
      created_at: new Date().toISOString(),
      processed_at: null
    };
    items.push(row);
    writeJSON(K_ITEMS, items);
    this._emit();
    return Promise.resolve(row);
  };

  LocalBackend.prototype.updateItem = function (id, patch) {
    var items = this._items();
    items.forEach(function (it) {
      if (it.id !== id) return;
      if (patch.shelf_days !== undefined) it.shelf_days = normDays(patch.shelf_days);
      if (patch.added_on !== undefined) it.added_on = patch.added_on;
      if (patch.food_name !== undefined) it.food_name = String(patch.food_name).trim();
      if (patch.status !== undefined) {
        it.status = patch.status;
        it.processed_at = patch.status === '已处理' ? new Date().toISOString() : null;
      }
    });
    writeJSON(K_ITEMS, items);
    this._emit();
    return Promise.resolve();
  };

  LocalBackend.prototype.deleteItem = function (id) {
    var items = this._items().filter(function (it) { return it.id !== id; });
    writeJSON(K_ITEMS, items);
    this._emit();
    return Promise.resolve();
  };

  /* =========================================================
     云端模式（Supabase）
     ========================================================= */

  function CloudBackend() {
    this.kind = 'cloud';
    this.needsAuth = true;
    this.offline = false;
    this._subs = [];
    this.sb = null;
    this.user = null;
  }

  CloudBackend.prototype._emit = function () {
    this._subs.forEach(function (cb) { try { cb(); } catch (e) {} });
  };

  CloudBackend.prototype.onChange = function (cb) { this._subs.push(cb); };

  CloudBackend.prototype.init = function () {
    var self = this;
    return import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm')
      .then(function (mod) {
        self.sb = mod.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, {
          auth: { persistSession: true, autoRefreshToken: true }
        });
        return self.sb.auth.getSession();
      })
      .then(function (res) {
        self.user = (res.data && res.data.session && res.data.session.user) || null;
        self.sb.auth.onAuthStateChange(function (_evt, session) {
          self.user = (session && session.user) || null;
        });
        if (self.user) self._listen();
      });
  };

  // 实时同步：任何一台设备写入，其他设备立刻收到通知并刷新
  CloudBackend.prototype._listen = function () {
    var self = this;
    if (self._channel) return;
    self._channel = self.sb
      .channel('fridge-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory_items' }, function () { self._emit(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'food_defaults' }, function () { self._emit(); })
      .subscribe();
  };

  CloudBackend.prototype.signIn = function (email, password) {
    var self = this;
    return self.sb.auth.signInWithPassword({ email: email, password: password })
      .then(function (res) {
        if (res.error) throw res.error;
        self.user = res.data.user;
        self._listen();
      });
  };

  CloudBackend.prototype.signOut = function () {
    var self = this;
    try { localStorage.removeItem(K_MIRROR); } catch (e) {}
    return self.sb.auth.signOut().then(function () { self.user = null; });
  };

  CloudBackend.prototype._mirror = function (patch) {
    var m = readJSON(K_MIRROR, { foods: [], items: [] });
    if (patch.foods) m.foods = patch.foods;
    if (patch.items) m.items = patch.items;
    writeJSON(K_MIRROR, m);
  };

  CloudBackend.prototype.listFoods = function () {
    var self = this;
    return self.sb.from('food_defaults').select('*').order('name')
      .then(function (res) {
        if (res.error) throw res.error;
        self.offline = false;
        self._mirror({ foods: res.data });
        return res.data;
      })
      .catch(function (err) {
        self.offline = true;
        console.warn('[fridge] 读取食材库失败，改用离线快照', err);
        return readJSON(K_MIRROR, { foods: [] }).foods || [];
      });
  };

  CloudBackend.prototype.listItems = function () {
    var self = this;
    return self.sb.from('inventory_items').select('*').order('added_on', { ascending: true })
      .then(function (res) {
        if (res.error) throw res.error;
        self.offline = false;
        self._mirror({ items: res.data });
        return res.data;
      })
      .catch(function (err) {
        self.offline = true;
        console.warn('[fridge] 读取库存失败，改用离线快照', err);
        return readJSON(K_MIRROR, { items: [] }).items || [];
      });
  };

  CloudBackend.prototype.addFood = function (food) {
    var self = this;
    var name = String(food.name || '').trim();
    return self.sb.from('food_defaults')
      .upsert({
        name: name,
        default_days: normDays(food.default_days),
        storage: normStorage(food.storage)
      }, { onConflict: 'name', ignoreDuplicates: true })
      .select()
      .then(function (res) {
        if (res.error) throw res.error;
        self._emit();
        return (res.data && res.data[0]) || { name: name };
      });
  };

  CloudBackend.prototype.updateFood = function (id, patch) {
    var self = this;
    var row = {};
    if (patch.name !== undefined) row.name = String(patch.name).trim();
    if (patch.default_days !== undefined) row.default_days = normDays(patch.default_days);
    if (patch.storage !== undefined) row.storage = normStorage(patch.storage);
    return self.sb.from('food_defaults').update(row).eq('id', id)
      .then(function (res) {
        if (res.error) throw res.error;
        self._emit();
      });
  };

  CloudBackend.prototype.deleteFood = function (id) {
    var self = this;
    return self.sb.from('food_defaults').delete().eq('id', id)
      .then(function (res) {
        if (res.error) throw res.error;
        self._emit();
      });
  };

  CloudBackend.prototype.addItem = function (item) {
    var self = this;
    return self.sb.from('inventory_items').insert({
      food_name: String(item.food_name || '').trim(),
      added_on: item.added_on || todayISO(),
      shelf_days: normDays(item.shelf_days),
      status: '在库'
    }).select()
      .then(function (res) {
        if (res.error) throw res.error;
        self._emit();
        return res.data && res.data[0];
      });
  };

  CloudBackend.prototype.updateItem = function (id, patch) {
    var self = this;
    var row = {};
    if (patch.shelf_days !== undefined) row.shelf_days = normDays(patch.shelf_days);
    if (patch.added_on !== undefined) row.added_on = patch.added_on;
    if (patch.food_name !== undefined) row.food_name = String(patch.food_name).trim();
    if (patch.status !== undefined) {
      row.status = patch.status;
      row.processed_at = patch.status === '已处理' ? new Date().toISOString() : null;
    }
    return self.sb.from('inventory_items').update(row).eq('id', id)
      .then(function (res) {
        if (res.error) throw res.error;
        self._emit();
      });
  };

  CloudBackend.prototype.deleteItem = function (id) {
    var self = this;
    return self.sb.from('inventory_items').delete().eq('id', id)
      .then(function (res) {
        if (res.error) throw res.error;
        self._emit();
      });
  };

  // 云端库是空的时候，把预置食材灌进去（只在第一次登录后发生一次）
  CloudBackend.prototype.seedIfEmpty = function () {
    var self = this;
    return self.sb.from('food_defaults').select('id', { count: 'exact', head: true })
      .then(function (res) {
        if (res.error) throw res.error;
        if (res.count && res.count > 0) return false;
        var rows = (window.SEED_FOODS || []).map(function (f) {
          return { name: f.name, default_days: normDays(f.days), storage: normStorage(f.storage) };
        });
        if (!rows.length) return false;
        return self.sb.from('food_defaults')
          .upsert(rows, { onConflict: 'name', ignoreDuplicates: true })
          .then(function (r2) {
            if (r2.error) throw r2.error;
            return true;
          });
      });
  };

  /* =========================================================
     对外接口
     ========================================================= */

  var backend = HAS_CLOUD ? new CloudBackend() : new LocalBackend();

  var Store = {
    mode: backend.kind,
    backend: backend,

    todayISO: todayISO,
    isoOf: isoOf,
    parseISO: parseISO,
    daysBetween: daysBetween,
    remainingDays: remainingDays,
    levelOf: levelOf,

    get user() { return backend.user || null; },
    get offline() { return !!backend.offline; },
    get needsAuth() { return !!backend.needsAuth; },

    init: function () { return backend.init(); },
    onChange: function (cb) { backend.onChange(cb); },

    signIn: function (email, pw) { return backend.signIn(email, pw); },
    signOut: function () { return backend.signOut(); },
    seedIfEmpty: function () {
      return backend.seedIfEmpty ? backend.seedIfEmpty() : Promise.resolve(false);
    },

    listFoods:  function () { return backend.listFoods(); },
    addFood:    function (f) { return backend.addFood(f); },
    updateFood: function (id, p) { return backend.updateFood(id, p); },
    deleteFood: function (id) { return backend.deleteFood(id); },

    listItems:  function () { return backend.listItems(); },
    addItem:    function (i) { return backend.addItem(i); },
    updateItem: function (id, p) { return backend.updateItem(id, p); },
    deleteItem: function (id) { return backend.deleteItem(id); }
  };

  window.Store = Store;
})();
