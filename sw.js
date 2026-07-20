const CACHE_NAME = "ubieranko-v6";

// Small and fast — safe to cache atomically at install time.
const SHELL_URLS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/styles.css",
  "js/catalog.js",
  "js/songpacks.js",
  "js/storage.js",
  "js/icons.js",
  "js/app.js",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "assets/icons/majtki.svg",
  "assets/icons/podkoszulka.svg",
  "assets/icons/koszulka.svg",
  "assets/icons/spodnie.svg",
  "assets/icons/skarpetki.svg",
  "assets/icons/bluza.svg",
];

// ~13MB across 34 files — fetched individually in the background after activation so one
// flaky download (common on mobile data) can't fail the whole precache like cache.addAll would.
const AUDIO_URLS = [
  "assets/audio/majtki.mp3",
  "assets/audio/podkoszulka.mp3",
  "assets/audio/koszulka.mp3",
  "assets/audio/spodnie.mp3",
  "assets/audio/skarpetki.mp3",
  "assets/audio/bluza.mp3",
  "assets/audio/menu_theme.mp3",
  "assets/audio/country_majtki.mp3",
  "assets/audio/country_podkoszulka.mp3",
  "assets/audio/country_koszulka.mp3",
  "assets/audio/country_spodnie.mp3",
  "assets/audio/country_skarpetki.mp3",
  "assets/audio/country_bluza.mp3",
  "assets/audio/country_menu.mp3",
  "assets/audio/disco_majtki.mp3",
  "assets/audio/disco_podkoszulka.mp3",
  "assets/audio/disco_koszulka.mp3",
  "assets/audio/disco_spodnie.mp3",
  "assets/audio/disco_skarpetki.mp3",
  "assets/audio/disco_bluza.mp3",
  "assets/audio/disco_menu.mp3",
  "assets/audio/kids_rock_majtki.mp3",
  "assets/audio/kids_rock_podkoszulka.mp3",
  "assets/audio/kids_rock_koszulka.mp3",
  "assets/audio/kids_rock_spodnie.mp3",
  "assets/audio/kids_rock_skarpetki.mp3",
  "assets/audio/kids_rock_bluza.mp3",
  "assets/audio/kids_rock_menu.mp3",
  "assets/audio/opera_majtki.mp3",
  "assets/audio/opera_podkoszulka.mp3",
  "assets/audio/opera_koszulka.mp3",
  "assets/audio/opera_spodnie.mp3",
  "assets/audio/opera_skarpetki.mp3",
  "assets/audio/opera_bluza.mp3",
  "assets/audio/opera_menu.mp3",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => cacheAudioInBackground())
  );
});

function cacheAudioInBackground() {
  return caches.open(CACHE_NAME).then((cache) =>
    Promise.allSettled(
      AUDIO_URLS.map((url) =>
        cache.match(url).then((existing) => {
          if (existing) return;
          return fetch(url).then((response) => {
            if (response.ok) return cache.put(url, response);
          });
        })
      )
    )
  );
}

self.addEventListener("message", (event) => {
  if (event.data === "cache-audio") {
    event.waitUntil(cacheAudioInBackground());
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
