/* =========================================================
   sw.js — Service Worker
   只负责让"添加到主屏幕"之后能离线打开外壳。
   数据请求（Supabase）一律直连网络，不进缓存。
   改了页面文件记得把 VERSION 往上加一位，否则老缓存不会换。
   ========================================================= */

var VERSION = 'fridge-v2';

var SHELL = [
  './',
  './index.html',
  './foods.html',
  './pedia.html',
  './config.js',
  './manifest.webmanifest',
  './assets/app.css',
  './assets/store.js',
  './assets/ui.js',
  './assets/home.js',
  './assets/foods.js',
  './assets/pedia.js',
  './assets/seed-foods.js',
  './assets/pedia-data.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION)
      .then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k === VERSION ? null : caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  // 只管自家的静态文件；Supabase 和 CDN 交给浏览器自己处理
  if (url.origin !== self.location.origin) return;

  // stale-while-revalidate：先给缓存的版本，后台顺手更新
  e.respondWith(
    caches.open(VERSION).then(function (cache) {
      return cache.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) {
          if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
          return res;
        }).catch(function () {
          return hit || cache.match('./index.html');
        });
        return hit || net;
      });
    })
  );
});
