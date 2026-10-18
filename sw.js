const CACHE = 'tdiv-v21';
const SHELL = ['./', './index.html', './workout.html', './run.html', './active.html', './menu.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

const clean = res => res.redirected ? res.blob().then(b => new Response(b, {status:res.status, statusText:res.statusText, headers:res.headers})) : Promise.resolve(res);
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u =>
    fetch(u).then(r => r.ok ? clean(r).then(cr => c.put(u, cr)) : null).catch(() => null)
  ))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);

  if(req.mode === 'navigate'){

    e.respondWith(fetch(req).then(res => { if(res.ok){ const cp = res.clone(); clean(cp).then(cr => caches.open(CACHE).then(c => c.put(req, cr))); } return res; })
      .catch(() => {

        const u = new URL(req.url), alt = u.pathname.endsWith('.html') ? u.pathname.slice(0, -5) : u.pathname.replace(/\/$/, '') + '.html';
        return caches.match(req, {ignoreSearch:true}).then(hit => hit || caches.match(alt)).then(hit => hit || caches.match('./index.html')).then(hit => hit || caches.match('./'));
      }));
    return;
  }

  if(url.origin === location.origin || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => {
      const net = fetch(req).then(res => { if(res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
  }
});
