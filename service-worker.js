const CACHE_NAME = "Ala-Re-v1";

const FILES_TO_CACHE = [
  "/",
  "index.html",
  "manifest.json",
  "alare.css",
  "alare.js",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  const isDoc = req.mode === 'navigate' || req.destination === 'document' || url.pathname.endsWith('.html');
  const isCode = ['script', 'style'].includes(req.destination) || url.pathname.endsWith('.js') || url.pathname.endsWith('.css');
  const isJson = url.pathname.endsWith('.json');

  if (isDoc || isCode) {
    event.respondWith(
      caches.match(req).then(cached => {
        return cached || fetch(req).then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
          return res;
        }).catch(() => {
          // 🔥 추가: 오프라인 fallback 핵심
          return caches.match("/") || caches.match("index.html");
        });
      })
    );
    return;
  }

  if (isJson) {
    event.respondWith(
      fetch(req, { cache: 'no-store' }).catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});