/**
 * WineCalc Service Worker
 * Provides offline functionality and caching for the PWA
 */

const CACHE_NAME = 'winecalc-v1.6.0';
const RUNTIME_CACHE = 'winecalc-runtime';

// Files to cache on install
const PRECACHE_URLS = [
  './',
  './index.html',
  './calculators.html',
  './formulas.html',
  './blend.html',
  './css/theme.css',
  './css/styles.css',
  './js/main.js',
  './js/utils.js',
  './js/i18n.js',
  './js/theme-manager.js',
  './js/settings-ui.js',
  './js/pwa-install.js',
  './js/blend-manager.js',
  './js/modules/app-state.js',
  './js/modules/calculator-loader.js',
  './js/modules/calculator-manager.js',
  './js/modules/template-generator.js',
  './js/modules/form-handler.js',
  './js/modules/results-renderer.js',
  './js/modules/search-manager.js',
  './calculators-config.json',
  './locales/it/common.json',
  './locales/en/common.json',
  './assets/icons/favicon/favicon.jpg',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',
  './assets/img/logo-white.png',
  // Bootstrap CSS
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  // Bootstrap Icons
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  // Bootstrap JS
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  // i18next
  'https://cdn.jsdelivr.net/npm/i18next@23.7.6/i18next.min.js'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching static resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Precaching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old cache versions
              return cacheName.startsWith('winecalc-') &&
                     cacheName !== CACHE_NAME &&
                     cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated successfully');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Network-first strategy for HTML pages (always get fresh content)
  if (request.mode === 'navigate' || request.destination === 'document' ||
      url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the new version
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Cache-first strategy for static resources (CSS, JS, images, etc.)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache dynamic resources (calculators, translations, etc.)
            if (shouldCache(url)) {
              caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            }

            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            throw error;
          });
      })
  );
});

// Helper function to determine if a resource should be cached
function shouldCache(url) {
  // Cache calculator files
  if (url.pathname.startsWith('/js/calculators/')) return true;
  if (url.pathname.startsWith('/js/calculators-fields/')) return true;

  // Cache translation files
  if (url.pathname.startsWith('/locales/')) return true;

  // Cache formula templates
  if (url.pathname.startsWith('/formulas/')) return true;

  // Don't cache external resources dynamically (already precached)
  if (!url.origin.includes(self.location.origin)) return false;

  return false;
}

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});
