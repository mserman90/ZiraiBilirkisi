// Service Worker - Zirai Bilirkişi Portalı (Offline-First PWA)
const CACHE_NAME = 'zirai-bilirkisi-v2';
const PRECACHE_ASSETS = [
  '/ZiraiBilirkisi/',
  '/ZiraiBilirkisi/index.html',
  '/ZiraiBilirkisi/manifest.json',
  '/ZiraiBilirkisi/icon.svg',
  '/ZiraiBilirkisi/icon-192.png',
  '/ZiraiBilirkisi/icon-512.png',
  '/ZiraiBilirkisi/apple-touch-icon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// Message listener to trigger immediate activation when new version arrives
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Install: Precache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Precache partial fallback:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache generations and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== 'map-tiles-cache') {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and chrome extension protocols
  if (event.request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // 1. Map Tiles (OSM / Esri): Cache with Stale-While-Revalidate
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

  // 2. Navigation Requests (HTML Document): Network-First with Offline Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return (
              cached ||
              caches.match('/ZiraiBilirkisi/index.html') ||
              caches.match('/ZiraiBilirkisi/')
            );
          });
        })
    );
    return;
  }

  // 3. Static Assets (Scripts, Styles, Fonts, Images): Cache-First with Stale-While-Revalidate
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
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
