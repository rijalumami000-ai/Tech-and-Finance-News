const CACHE_NAME = 'byteindonesia-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/logo.png',
  '/favicon.svg',
  '/manifest.json'
];

// Install Event: Cache Core Static Assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return (self as any).skipWaiting();
    })
  );
});

// Activate Event: Cleanup Stale Old Caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return (self as any).clients.claim();
    })
  );
});

// Fetch Event: Smart Offline Caching Strategy
self.addEventListener('fetch', (e: any) => {
  const url = new URL(e.request.url);

  // For Local API Requests or main bundle js/css (Vite builds) - network first, fallback to cache
  if (url.origin === self.location.origin || e.request.url.includes('/api/v1/')) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          // If valid response, clone and cache it dynamically
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, copy);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline fallback: try matches in cache
          return caches.match(e.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Return index.html as a fallback for hash router routes if requested page is document
            if (e.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
        })
    );
  } else {
    // For static external assets (Unsplash images, Google Fonts) - cache first, fallback to network
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(e.request).then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, copy);
            });
          }
          return response;
        });
      })
    );
  }
});
