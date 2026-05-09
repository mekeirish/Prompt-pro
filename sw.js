const CACHE_NAME = 'lb-code-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Installation : Mise en cache initiale
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activation : Nettoyage des vieux caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// Stratégie : Réseau en priorité, Cache en secours
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
