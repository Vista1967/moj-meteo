const cacheName = "weather-app-cache-v1";
const assets = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/manifest.json",
    "/icon-180x180.png",  // Ikona 180x180
    "/icon-192.png",
    "/icon-512.png"
];

// Instalacija Service Workera i keširanje osnovnih fajlova
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(assets);
        })
    );
});

// Aktivacija Service Workera i čišćenje starog keša
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== cacheName)
                    .map((key) => caches.delete(key))
            );
        })
    );
    return self.clients.claim(); // Omogućava novom SW da odmah kontroliše klijente
});

// Dohvatanje resursa sa keširanjem
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Vraća resurs iz keša ili ga preuzima sa mreže
            return (
                response ||
                fetch(event.request).then((networkResponse) => {
                    // Keširanje novih resursa u slučaju da nisu u kešu
                    return caches.open(cacheName).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
            );
        }).catch(() => {
            // Ako je mreža nedostupna, možemo vratiti unapred definisanu stranicu za offline rad
            return caches.match("/offline.html");
        })
    );
});
