
const CACHE = "musabaqa-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/js/auth.js",
  "/images/logo-musabaqa.svg",
  "/images/logo-vision.svg",
  "/images/logo-talabia.svg",
  "/images/icon-192.png",
  "/images/icon-512.png",
  "/images/favicon.png",
  "/images/preview.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
