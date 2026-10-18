// TRAINING DIVISION - offline support
// 更新したら CACHE の番号を上げると、利用者の端末で新しい版に切り替わります
const CACHE = 'tdiv-v11';
const SHELL = ['./', './index.html', './workout.html', './run.html', './menu.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  // ページ本体: ネット優先（最新版を取得）、圏外ならキャッシュ
  if(req.mode === 'navigate'){
    // ページごとに保存（ホーム / workout.html / run.html）。圏外ならそのページ → だめならホーム
    e.respondWith(fetch(req).then(res => { if(res.ok){ const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return res; })
      .catch(() => caches.match(req, {ignoreSearch:true}).then(hit => hit || caches.match('./index.html'))));
    return;
  }
  // 同じサイトのファイルと Google Fonts: キャッシュを使いつつ裏で更新
  if(url.origin === location.origin || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => {
      const net = fetch(req).then(res => { if(res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
  }
});
