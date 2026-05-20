/**
 * sw.js · Service Worker · SADM/56º BPM · PWA Onda 38
 * Cache offline para os painéis estáticos · network-first para o redator
 * (sempre tenta servidor primeiro · fallback no cache em offline).
 *
 * DA-072 · sufixo `?v=` é cache-bust quando trocarmos versão.
 */

const VERSION = '38.2';
const CACHE_NAME = 'sadm-painel-v' + VERSION;
const PRECACHE = [
  './',
  './index.html',
  './redator-desktop.html',
  './consultor-desktop.html',
  './cockpit-desktop.html',
  './tokens.css',
  './icon-192.svg',
  './icon-512.svg',
  './manifest.webmanifest'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(PRECACHE).catch(e => console.warn('precache', e)))
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
 * Estratégia:
 *  - Apps Script (script.google.com): SEMPRE network (não cachear · sempre fresh)
 *  - HTML/JS/CSS/SVG locais: stale-while-revalidate
 */
self.addEventListener('fetch', evt => {
  const url = new URL(evt.request.url);
  // Nunca cachear chamadas ao Apps Script
  if (url.hostname.indexOf('script.google.com') !== -1 ||
      url.hostname.indexOf('googleusercontent.com') !== -1) {
    return; // deixa o fetch padrão acontecer
  }
  // Apenas cachear GET
  if (evt.request.method !== 'GET') return;
  // Apenas same-origin
  if (url.origin !== location.origin) return;

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
