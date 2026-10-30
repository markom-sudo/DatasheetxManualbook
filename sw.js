// Service worker Tender Helper: cangkang aplikasi tetap terbuka saat offline.
// Data (Apps Script) tidak pernah di-cache, jadi isi manual/Bank selalu terbaru.
const V = 'th-v2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'assets/Icon192.svg', 'assets/Icon512.svg', 'assets/icon-192.png', 'assets/icon-512.png', 'assets/icon-maskable-512.png', 'assets/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.allSettled(SHELL.map(u => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;   // permintaan ke Apps Script dibiarkan
  e.respondWith(
    fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match('index.html')))
  );
});
