const CACHE = "rocsta-archive-v2";
const STATIC_ASSETS = [
  "/asia-rocsta-hub/",
  "/asia-rocsta-hub/robots.txt",
  "/asia-rocsta-hub/favicon.svg",
  "/asia-rocsta-hub/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (request.method !== "GET") return;

  const isHashedAsset = /assets\/.*\.[a-f0-9]{8,}\.(js|css|jpg|jpeg|png|webp|svg|woff2)$/.test(url.pathname);

  if (isHashedAsset) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          });
        })
      )
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/asia-rocsta-hub/"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request).then((response) => {
        if (response.ok && url.pathname.startsWith("/asia-rocsta-hub/assets/")) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
      return cached || fetched;
    })
  );
});
