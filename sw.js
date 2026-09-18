const CACHE_NAME = 'tsubasa-guide-v2';
const PRECACHE_ASSETS = [
  '/tsubasa-guide/',
  '/tsubasa-guide/index.html',
  '/tsubasa-guide/assets/hero-bg.webp',
  '/tsubasa-guide/assets/hero-bg-640w.webp',
  '/tsubasa-guide/assets/cover-1.webp',
  '/tsubasa-guide/assets/cover-1-200w.webp',
  '/tsubasa-guide/assets/cover-2.webp',
  '/tsubasa-guide/assets/cover-2-200w.webp',
  '/tsubasa-guide/assets/cover-3.webp',
  '/tsubasa-guide/assets/cover-3-200w.webp',
  '/tsubasa-guide/assets/cover-4.webp',
  '/tsubasa-guide/assets/cover-4-200w.webp',
  '/tsubasa-guide/assets/cover-5.webp',
  '/tsubasa-guide/assets/cover-5-200w.webp',
  '/tsubasa-guide/assets/cover-6.webp',
  '/tsubasa-guide/assets/cover-6-200w.webp',
  '/tsubasa-guide/assets/cover-7.webp',
  '/tsubasa-guide/assets/cover-7-200w.webp',
  '/tsubasa-guide/assets/cover-8.webp',
  '/tsubasa-guide/assets/cover-8-200w.webp',
  '/tsubasa-guide/assets/playlist.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            if (request.url.startsWith('http')) {
              cache.put(request, clone);
            }
          });
          return response;
        })
        .catch(() => cached);
    })
  );
});
