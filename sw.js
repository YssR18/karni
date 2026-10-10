/* Service worker: دفتر الحسابات
 * - الصفحة نفسها: الشبكة أولاً، وعند انقطاع الإنترنت تُقدَّم النسخة المخزنة
 * - ملفات الموقع (tailwind.css والأيقونات): الشبكة أولاً ثم النسخة المخزنة
 * - مكتبات Firebase والخطوط: تُقدَّم من التخزين وتُحدَّث في الخلفية
 * - طلبات Firestore و Auth لا تُعترض أبداً (Firebase يدير تخزينها بنفسه)
 * عند تغيير هذا الملف أو الحاجة لتفريغ التخزين، ارفع رقم VERSION.
 */
const VERSION = 'v2';
const CACHE = 'daftar-' + VERSION;

const PRECACHE_PAGES = ['./', './index.html', './tailwind.css', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
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
    await Promise.all(PRECACHE_PAGES.map((u) => cache.add(u).catch(() => {})));
    // المكتبات: محاولة جيدة، ولا يفشل التثبيت إن تعذّر أحدها
    await Promise.all(PRECACHE_LIBS.map(async (u) => {
      try { await cache.add(new Request(u, { mode: 'no-cors' })); } catch (e) { /* يُخزَّن لاحقاً عند أول طلب */ }
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

async function networkFirstPage(request) {
  const cache = await caches.open(CACHE);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) cache.put('./index.html', fresh.clone());
    return fresh;
  } catch (err) {
    const cached = (await cache.match(request, { ignoreSearch: true })) ||
                   (await cache.match('./index.html')) ||
                   (await cache.match('./'));
    if (cached) return cached;
    throw err;
  }
}

// ملفات الموقع نفسه (CSS, أيقونات...): الشبكة أولاً حتى لا يبقى تنسيق قديم مع صفحة جديدة
async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
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

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate') {
      event.respondWith(networkFirstPage(request));
    } else {
      event.respondWith(networkFirst(request));
    }
    return;
  }

  if (CACHEABLE_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(request));
  }
  // غير ذلك (Firestore, Auth, واتساب...) يمر مباشرة إلى الشبكة
});
