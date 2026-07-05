const CACHE_NAME = "himnario-v5";
const CORE_PRECACHE_URLS = ["/", "/buscar", "/favoritos", "/configuracion", "/hymns.json", "/icon.svg", "/offline.html", "/precache-urls.json"];
const PRECACHE_BATCH_SIZE = 24;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        await precacheUrls(cache, CORE_PRECACHE_URLS);

        try {
          const response = await fetch("/precache-urls.json");
          if (response.ok) {
            const urls = await response.json();
            await precacheUrls(cache, urls);
          }
        } catch {
          // Hymn precache runs when the manifest is available during install.
        }
      })
      .then(() => self.skipWaiting())
  );
});

async function precacheUrls(cache, urls) {
  for (let index = 0; index < urls.length; index += PRECACHE_BATCH_SIZE) {
    const batch = urls.slice(index, index + PRECACHE_BATCH_SIZE);

    await Promise.allSettled(
      batch.map(async (url) => {
        try {
          await cache.add(url);
        } catch {
          // Best-effort precache for offline access.
        }
      })
    );
  }
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

function isNavigationRequest(request) {
  return (
    request.mode === "navigate" ||
    request.headers.get("accept")?.includes("text/html") ||
    request.headers.get("RSC") === "1" ||
    request.headers.get("Next-Router-Prefetch") === "1" ||
    request.headers.get("Next-Router-State-Tree")
  );
}

function isStaticAsset(pathname) {
  return pathname.startsWith("/_next/static/") || pathname === "/icon.svg" || pathname === "/apple-icon.svg";
}

function isOfflineData(pathname) {
  return pathname === "/hymns.json" || pathname === "/precache-urls.json";
}

function shouldCacheRequest(request, response) {
  if (!response.ok) {
    return false;
  }

  if (isNavigationRequest(request)) {
    return true;
  }

  const pathname = new URL(request.url).pathname;
  return pathname.startsWith("/himno/") || pathname.startsWith("/coleccion/") || pathname.startsWith("/buscar");
}

function pathnameRequest(url) {
  return new Request(`${url.origin}${url.pathname}`, { method: "GET" });
}

async function matchCachedDocument(cache, request) {
  const exact = await cache.match(request);
  if (exact) {
    return exact;
  }

  const ignoreSearch = await cache.match(request, { ignoreSearch: true });
  if (ignoreSearch) {
    return ignoreSearch;
  }

  const url = new URL(request.url);
  const pathnameOnly = await cache.match(pathnameRequest(url));
  if (pathnameOnly) {
    return pathnameOnly;
  }

  return null;
}

async function offlineDocumentFallback(request) {
  const cache = await caches.open(CACHE_NAME);

  if (request) {
    const matched = await matchCachedDocument(cache, request);
    if (matched) {
      return matched;
    }
  }

  const cachedHome = await cache.match("/");
  if (cachedHome) {
    return cachedHome;
  }

  const offlinePage = await cache.match("/offline.html");
  if (offlinePage) {
    return offlinePage;
  }

  return new Response("Sin conexión", {
    status: 503,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);

    if (shouldCacheRequest(request, response)) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    const cached = await matchCachedDocument(cache, request);
    if (cached) {
      return cached;
    }

    if (isNavigationRequest(request)) {
      return offlineDocumentFallback(request);
    }

    throw new Error("Network unavailable");
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    void networkPromise;
    return cached;
  }

  const response = await networkPromise;
  if (response) {
    return response;
  }

  throw new Error("Network unavailable");
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (isNavigationRequest(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (isOfflineData(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
