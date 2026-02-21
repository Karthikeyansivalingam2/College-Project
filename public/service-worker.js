
const CACHE_NAME = 'foodie-zone-v4';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './order.html',
    './about.html',
    './halls.html',
    './assets/css/common.css',
    './assets/js/common.js',
    './assets/js/order.js',
    './manifest.json',
    './image/large.png',
    './components/navbar.html',
    './components/footer.html'
];

// Install Event
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app shell');
                // Use addAll but catch individual failures if needed
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[SW] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        }).then(() => self.clients.claim())
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(res => {
                    // Optional: cache new dynamic assets here if desired
                    return res;
                });
            })
            .catch(() => {
                // Offline fallback could go here
                console.log("[SW] Fetch failed for:", event.request.url);
            })
    );
});
