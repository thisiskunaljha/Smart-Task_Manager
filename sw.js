const CACHE_NAME = 'task-manager-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html?pwa=1',
  '/manifest.json'
];

const NETWORK_FIRST_ROUTES = [
  '/sync',
  '/api'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('💾 Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.log('⚠️ Some assets could not be cached (may not exist during development):', err);
          // Add only the essential files that exist
          return cache.addAll(['/index.html', '/manifest.json']).catch(e => console.log(e));
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✨ Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions
  if (url.origin === 'chrome-extension://') {
    return;
  }

  // Network-first strategy for API calls and sync requests
  if (NETWORK_FIRST_ROUTES.some(route => url.pathname.includes(route))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Update cache with fresh response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fall back to cache if network fails
          return caches.match(request)
            .then(response => response || createOfflineResponse());
        })
    );
    return;
  }

  // Cache-first strategy for static assets and HTML
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          console.log('📦 Serving from cache:', request.url);
          return response;
        }

        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response && response.status === 200 && response.type !== 'error') {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            console.log('📵 Offline - serving fallback for:', request.url);
            // Return cached version if available
            return caches.match(request)
              .then(response => response || createOfflineResponse());
          });
      })
  );
});

// Create offline fallback response
function createOfflineResponse() {
  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline Mode</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #74ebd5, #9face6);
          color: #333;
        }
        .offline-container {
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          max-width: 400px;
        }
        h1 { font-size: 48px; margin: 0; }
        p { margin: 10px 0 0 0; color: #666; }
        .hint { margin-top: 20px; font-size: 14px; color: #999; }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <h1>📵</h1>
        <h2>You're Offline</h2>
        <p>Your app works offline - your data is synced when connected.</p>
        <p>Tip: Your local data is safely stored.</p>
        <div class="hint">Connection will be restored automatically.</div>
      </div>
    </body>
    </html>`,
    {
      headers: { 'Content-Type': 'text/html' },
      status: 503,
      statusText: 'Service Unavailable'
    }
  );
}

// Background sync (when online, sync tasks)
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered');
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  }
});

async function syncTasks() {
  try {
    console.log('🔄 Syncing tasks to cloud...');
    // Tasks sync would happen here
    // For now, just log it
    return Promise.resolve();
  } catch (error) {
    console.log('❌ Sync failed:', error);
    return Promise.reject(error);
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  console.log('💬 Message received by Service Worker:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});