self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('chuanxun-v3').then(function (c) {
      return c.addAll(['./index.html', './manifest.json', './icon-192.png?v=3', './icon-512.png?v=3']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== 'chuanxun-v3'; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open('chuanxun-v3').then(function (c) { return c.put(e.request, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (m) { return m || caches.match('./index.html'); });
    })
  );
});