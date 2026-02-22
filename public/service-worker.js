
// ─── CACHE CONFIG ──────────────────────────────────────────────────────────
// ⚠️ BUMP THIS VERSION EVERY TIME YOU DEPLOY CHANGES
const CACHE_VERSION = 'foodie-zone-v10';

// Only cache truly static assets (images/fonts)
// HTML, CSS, JS → always fetch fresh from network
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const STATIC_ASSETS = [
    './manifest.json',
    './image/large.png',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap'
];

// ─── INSTALL ───────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
    console.log('[SW] Installing v', CACHE_VERSION);
    // Take over immediately without waiting for old SW to finish
    self.skipWaiting();
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch(err => {
                console.warn('[SW] Static pre-cache partial fail:', err);
            });
        })
    );
});

// ─── ACTIVATE ──────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating v', CACHE_VERSION);
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter(key => key !== STATIC_CACHE)
                    .map(key => {
                        console.log('[SW] Deleting old cache:', key);
                        return caches.delete(key);
                    })
            )
        ).then(() => self.clients.claim())
    );
});

// ─── FETCH STRATEGY ─────────────────────────────────────────────────────────
// NETWORK-FIRST for all HTML, CSS, JS → always get fresh code
// CACHE-FIRST only for images/fonts
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET and cross-origin API calls
    if (event.request.method !== 'GET') return;
    if (!url.origin.includes(self.location.hostname) && !url.hostname.includes('fonts.g')) return;

    const isHtmlCssJs = /\.(html|css|js)(\?.*)?$/.test(url.pathname) || url.pathname === '/' || url.pathname.endsWith('/');
    const isImage = /\.(png|jpg|jpeg|gif|svg|webp|ico)(\?.*)?$/.test(url.pathname);
    const isFont = url.hostname.includes('fonts.g') || url.hostname.includes('cdnjs');

    if (isHtmlCssJs) {
        // 🌐 NETWORK-FIRST: Always try network, fall back to cache
        event.respondWith(
            fetch(event.request)
                .then(res => {
                    // Clone and store in cache only if valid response
                    if (res && res.status === 200) {
                        const resClone = res.clone();
                        caches.open(STATIC_CACHE).then(cache => cache.put(event.request, resClone));
                    }
                    return res;
                })
                .catch(() => {
                    // Offline fallback: serve from cache
                    return caches.match(event.request).then(cached => {
                        if (cached) return cached;
                        // Last resort for HTML pages
                        if (isHtmlCssJs) return caches.match('./index.html');
                    });
                })
        );
    } else if (isImage) {
        // 🖼️ CACHE-FIRST for images (they don't change often)
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(res => {
                    if (res && res.status === 200) {
                        const resClone = res.clone();
                        caches.open(STATIC_CACHE).then(cache => cache.put(event.request, resClone));
                    }
                    return res;
                });
            })
        );
    } else if (isFont) {
        // 🔤 CACHE-FIRST for fonts (stable)
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(res => {
                    if (res && res.status === 200) {
                        const resClone = res.clone();
                        caches.open(STATIC_CACHE).then(cache => cache.put(event.request, resClone));
                    }
                    return res;
                });
            })
        );
    }
    // Everything else (API calls): let them pass through normally
});
