// Service Worker - Zirai ve Hayvancılık Bilirkişi Portalı (Offline First PWA)
const CACHE_NAME = 'zirai-bilirkisi-v1';
const PRECACHE_ASSETS = [
  '/ZiraiBilirkisi/',
  '/ZiraiBilirkisi/index.html',
  '/ZiraiBilirkisi/manifest.json',
  '/ZiraiBilirkisi/icon.svg',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// Install: Cache initial static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Precache partial fallback', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First with Cache Fallback for dynamic requests, Cache-First for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET or chrome-extension requests
  if (event.request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // Handle map tiles or remote heavy APIs: Stale-While-Revalidate
  if (url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('arcgisonline.com')) {
    event.respondWith(
      caches.open('map-tiles-cache').then((tileCache) => {
        return tileCache.match(event.request).then((cached) => {
          const networkFetch = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              tileCache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cached);
          return cached || networkFetch;
        });
      })
    );
    return;
  }

  // App Shell & Static assets: Stale While Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for navigation requests to root index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/ZiraiBilirkisi/index.html') || caches.match('/ZiraiBilirkisi/');
        }
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
