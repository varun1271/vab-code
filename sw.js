/* ============================================================
   VAB-CODE (vab-code) — Service Worker for Aggressive Browser Caching
   Shields users from "Slow Wi-Fi" and heavy WASM download lag
   ============================================================ */

const CACHE_NAME = 'vab-code-v5.4';
const CORE_ASSETS = [
  '/',
  '/index.html?v=5.4',
  '/style.css?v=5.4',
  '/app.js?v=5.4',
  '/assets/logo-icon.png?v=5.4',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/lucide/0.469.0/umd/lucide.min.js'
];

// Install: Pre-cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch(() => {});
    }).then(() => self.skipWaiting())
  );
});

// Instant skip waiting on update
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Activate: Clean up older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Aggressive caching for WebAssembly (Pyodide) and CDN assets
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Bypass cache completely for localhost development
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Stale-While-Revalidate or Cache-First for Pyodide WASM & Monaco CDN assets
  if (
    url.includes('cdn.jsdelivr.net/pyodide') ||
    url.includes('monaco-editor') ||
    url.includes('cdnjs.cloudflare.com') ||
    url.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          // Serve from Cache immediately (instant subsequent loads)
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (fetchErr) {
          console.warn('[Service Worker] CDN fetch error:', fetchErr);
          return cachedResponse;
        }
      })
    );
    return;
  }

  // Network-First with Cache fallback for app files
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response && response.status === 200 && event.request.method === 'GET') {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
      }
      return response;
    }).catch(async () => {
      const match = await caches.match(event.request);
      if (match) return match;
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
