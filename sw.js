
// Service Worker for UNILAG Flashcards App
const CACHE_NAME = 'unilag-flashcards-cache-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/communication-skills.json',
  '/critical-thinking.json',
  '/emotional-intelligence.json',
  '/logical-reasoning.json',
  '/problem-solving.json',
  '/research-aptitude.json',
  '/verbal-reasoning.json'
];

// Install event: Cache all essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(filesToCache);
      })
      .catch(error => console.error('Service Worker: Cache failed', error))
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Fetch event: Serve cached files or fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Return cached response
        }
        return fetch(event.request).then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
      .catch(error => {
        console.error('Service Worker: Fetch failed', error);
        throw error;
      })
  );
});