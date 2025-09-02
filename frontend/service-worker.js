const CACHE_NAME = 'gympro-manager-v2'; // Cambiado a v2 para forzar la actualización
const urlsToCache = [
  '/',
  '/index.html',
  '/icon.svg',
  '/manifest.json'
];

// Instalar el service worker y cachear los assets iniciales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Limpiar cachés antiguas cuando el nuevo service worker se active
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Estrategia "Stale-While-Revalidate" para las peticiones que no son de la API
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) {
    // No usar la caché para las peticiones a la API, siempre ir a la red.
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

        // Devolver la respuesta de la caché (si existe) o esperar a la red
        return response || fetchPromise;
      });
    })
  );
});