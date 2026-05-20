/**
 * sw.js · Service Worker · SADM/56º BPM · PWA · Onda 38
 * v38.3 · network-first para HTML/JS · cache-first para assets estáticos
 *
 * Por que network-first em HTML: HTML é dinâmico (versão muda). Cachear
 * agressivamente HTML faz o operador ver versão antiga após cada deploy.
 * Solução: sempre tenta rede, cache só serve como fallback offline.
 *
 * DA-072
 */

const VERSION = '38.3';
const CACHE_NAME = 'sadm-painel-v' + VERSION;

// Apenas assets verdadeiramente estáticos no precache
const PRECACHE_STATIC = [
  './icon-192.svg',
  './icon-512.svg',
  './manifest.webmanifest',
  './tokens.css'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(PRECACHE_STATIC).catch(e => console.warn('precache', e)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/**
 * Estratégia por tipo:
 *  - Apps Script (script.google.com/googleusercontent): SEMPRE network (sem cache)
 *  - HTML (.html ou /): NETWORK-FIRST · cache como fallback offline
 *  - Assets estáticos (.css, .svg, .js local, .webmanifest): STALE-WHILE-REVALIDATE
 */
self.addEventListener('fetch', evt => {
  const url = new URL(evt.request.url);

  // 1. Apps Script · nunca cachear
  if (url.hostname.indexOf('script.google.com') !== -1 ||
      url.hostname.indexOf('googleusercontent.com') !== -1 ||
      url.hostname.indexOf('googleapis.com') !== -1) {
    return; // fetch padrão
  }

  // 2. Apenas GET same-origin
  if (evt.request.method !== 'GET') return;
  if (url.origin !== location.origin) return;

  const isHTML = url.pathname.endsWith('/') ||
                 url.pathname.endsWith('.html');

  if (isHTML) {
    // NETWORK-FIRST · cache fallback (offline)
    evt.respondWith(
      fetch(evt.request).then(resp => {
        if (resp && resp.status === 200) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(evt.request, copy));
        }
        return resp;
      }).catch(() => caches.match(evt.request).then(r => r || new Response(
        '<h1>Offline</h1><p>Reconecte para acessar.</p>',
        { headers: { 'Content-Type': 'text/html' } }
      )))
    );
    return;
  }

  // STALE-WHILE-REVALIDATE para CSS/SVG/JS locais
  evt.respondWith(
    caches.match(evt.request).then(cached => {
      const fresh = fetch(evt.request).then(resp => {
        if (resp && resp.status === 200) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(evt.request, copy));
        }
        return resp;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});

// Mensagem do client para forçar reload
self.addEventListener('message', evt => {
  if (evt.data === 'skipWaiting') self.skipWaiting();
});
