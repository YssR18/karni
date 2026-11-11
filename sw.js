/* Service worker: دفتر الحسابات
 * - الصفحة وملفات الموقع: تُقدَّم فوراً من التخزين (يفتح التطبيق بلا إنترنت وبلا انتظار)،
 *   وفي الخلفية تُجلب النسخة الأحدث بلا تخزين وسيط، وعند اختلافها تُبلَّغ الصفحة لتُحدَّث
 * - مكتبات Firebase والخطوط: تُقدَّم من التخزين وتُحدَّث في الخلفية
 * - طلبات Firestore و Auth لا تُعترض أبداً (Firebase يدير تخزينها بنفسه)
 * عند تغيير هذا الملف أو الحاجة لتفريغ التخزين، ارفع رقم VERSION.
 */
const VERSION = 'v19';
const CACHE = 'daftar-' + VERSION;

const PRECACHE_PAGES = ['./', './index.html', './tailwind.css', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
const PRECACHE_LIBS = [
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap'
];

// المضيفات الخارجية المسموح بتخزين ملفاتها
const CACHEABLE_HOSTS = [
  'www.gstatic.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdn-icons-png.flaticon.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // الصفحة الأساسية: لا بد منها
    await Promise.all(PRECACHE_PAGES.map(async (u) => { try { const r = await fetch(u, { cache: 'reload' }); if (r && r.ok) await cache.put(u, r); } catch (e) {} }));
    try { const r = await cache.match('./index.html'); if (r) await cache.put('./', r.clone()); } catch (e) {}
    // المكتبات: محاولة جيدة، ولا يفشل التثبيت إن تعذّر أحدها
    await Promise.all(PRECACHE_LIBS.map(async (u) => {
      try { const r = await fetch(u, { mode: 'no-cors' }); await cache.put(u, r); } catch (e) { /* يُخزَّن لاحقاً عند أول طلب */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('daftar-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

function isCacheable(response) {
  return response && (response.ok || response.type === 'opaque');
}

const SHELL = ['./index.html', './tailwind.css', './manifest.webmanifest'];
let lastRefresh = 0, refreshing = null;

function fetchT(req, opts, ms) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), ms || 15000);
  return fetch(req, Object.assign({}, opts || {}, { signal: ctl.signal })).finally(() => clearTimeout(t));
}

async function broadcast(msg) {
  const cl = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  cl.forEach((c) => c.postMessage(msg));
}

// جلب أحدث نسخة من الصفحة والتنسيق دون استخدام التخزين الوسيط للمتصفح، وتخزينها معاً
function refreshShell(force) {
  if (refreshing) return refreshing;
  if (!force && Date.now() - lastRefresh < 20000) return Promise.resolve();
  lastRefresh = Date.now();
  refreshing = (async () => {
    try {
      const cache = await caches.open(CACHE);
      const old = await cache.match('./index.html');
      const oldTxt = old ? await old.clone().text() : null;
      const res = await fetchT('./index.html', { cache: 'no-cache' }, 20000);
      if (!res || !res.ok) return;
      const txt = await res.clone().text();
      if (oldTxt === txt) return;
      const css = await fetchT('./tailwind.css', { cache: 'no-cache' }, 20000).catch(() => null);
      if (css && css.ok) await cache.put('./tailwind.css', css);
      await cache.put('./index.html', res);
      if (oldTxt !== null) broadcast({ type: 'karni-updated' });
    } catch (e) { /* بلا اتصال: نبقى على النسخة المخزنة */ }
    finally { refreshing = null; }
  })();
  return refreshing;
}

async function shellFirst(event, key) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(key, { ignoreSearch: true });
  if (cached) { event.waitUntil(refreshShell(false)); return cached; }
  // لا نسخة مخزنة (أول تشغيل): الشبكة
  const fresh = await fetchT(event.request, {}, 25000);
  if (fresh && fresh.ok) cache.put(key, fresh.clone());
  return fresh;
}

// بقية ملفات الموقع: من التخزين إن وُجدت، وإلا الشبكة بمهلة قصيرة
async function assetFirst(event) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(event.request, { ignoreSearch: true });
  if (cached) return cached;
  const fresh = await fetchT(event.request, {}, 10000);
  if (fresh && fresh.ok) cache.put(event.request, fresh.clone());
  return fresh;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const refresh = fetch(request).then((res) => {
    if (isCacheable(res)) cache.put(request, res.clone());
    return res;
  }).catch(() => null);
  if (cached) {
    refresh.catch(() => {});
    return cached;
  }
  const res = await refresh;
  if (res) return res;
  return Response.error();
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'check') event.waitUntil(refreshShell(true));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate') {
      event.respondWith(shellFirst(event, './index.html').catch(() => caches.match('./index.html').then((r) => r || Response.error())));
    } else if (/\/(tailwind\.css|manifest\.webmanifest)$/.test(url.pathname)) {
      event.respondWith(assetFirst(event).catch(() => Response.error()));
    } else if (/\/sw\.js$/.test(url.pathname)) {
      return;
    } else {
      event.respondWith(assetFirst(event).catch(() => Response.error()));
    }
    return;
  }

  if (CACHEABLE_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(request));
  }
  // غير ذلك (Firestore, Auth, واتساب...) يمر مباشرة إلى الشبكة
});
