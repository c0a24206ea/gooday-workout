// TIVS - offline support
// 更新したら CACHE の番号を上げると、利用者の端末で新しい版に切り替わります
const CACHE = 'tdiv-v16';
const SHELL = ['./', './index.html', './workout.html', './run.html', './active.html', './menu.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

// Cloudflare などは /workout.html → /workout に転送するので、転送後のレスポンスは
// そのまま保存すると表示に使えない。中身だけ取り出した「転送なし」のレスポンスにして保存する
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
  // ページ本体: ネット優先（最新版を取得）、圏外ならキャッシュ
  if(req.mode === 'navigate'){
    // ページごとに保存（ホーム / workout.html / run.html）。圏外ならそのページ → だめならホーム
    e.respondWith(fetch(req).then(res => { if(res.ok){ const cp = res.clone(); clean(cp).then(cr => caches.open(CACHE).then(c => c.put(req, cr))); } return res; })
      .catch(() => {
        // 圏外: そのURL → 「.html あり/なし」の別名 → ホーム の順に探す
        const u = new URL(req.url), alt = u.pathname.endsWith('.html') ? u.pathname.slice(0, -5) : u.pathname.replace(/\/$/, '') + '.html';
        return caches.match(req, {ignoreSearch:true}).then(hit => hit || caches.match(alt)).then(hit => hit || caches.match('./index.html')).then(hit => hit || caches.match('./'));
      }));
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
