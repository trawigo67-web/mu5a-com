/* Namazım — çevrimdışı çalışma için önbellek */
var CACHE = "namazim-ad51af62b3";
var ASSETS = ["./", "index.html", "fonts.css", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "fonts/amiri-700-latin-ext.woff2", "fonts/amiri-700-latin.woff2", "fonts/atkinson-hyperlegible-next-400-latin-ext.woff2", "fonts/atkinson-hyperlegible-next-400-latin.woff2", "fonts/atkinson-hyperlegible-next-600-latin-ext.woff2", "fonts/atkinson-hyperlegible-next-600-latin.woff2", "fonts/atkinson-hyperlegible-next-700-latin-ext.woff2", "fonts/atkinson-hyperlegible-next-700-latin.woff2", "fonts/scheherazade-new-400-arabic.woff2"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(function (res) {
      var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put("index.html", copy); });
      return res;
    }).catch(function () { return caches.match("index.html"); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) {
    return hit || fetch(req).then(function (res) {
      var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); });
      return res;
    });
  }));
});
