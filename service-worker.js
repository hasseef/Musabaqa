self.addEventListener('install', e=>{
  e.waitUntil(caches.open('musabaqa-v1').then(cache=>cache.addAll(['./','index.html','Vision2030.png','talbiya.png','manifest.json'])));
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});
