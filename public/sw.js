const staticCacheName = 'static-static-v4';
const dynamicCacheName = 'site-dynamic-v3';
const assets = [
  '/',
  '/index.html',
  '/src/assets/materialize.min.css',
  '/src/assets/styles.css',
  '/materialize.min.js',
  '/app.js',
  '/manifest.json',
  '/src/components/Home.vue',
  '/src/components/Login.vue',
  '/src/components/Class.vue',
  '/src/components/Levels.vue',
  '/src/components/Sidebar.vue',
  '/src/components/Fallback.vue',
  '/src/components/Quiz.vue',
  '/src/components/QuizResult.vue',
  '/src/components/Dashboard.vue',
  '/src/components/ResetPwd.vue',
  'https://fonts.googleapis.com/css2?family=Darumadrop+One&family=Dela+Gothic+One&family=DotGothic16&display=swap',
];

//cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    })
  })
};

//install service worker
self.addEventListener('install', evt => {
  // console.log('service worker has been installed');
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

//activate event
self.addEventListener('activate', evt => {
  // console.log('service worker has been activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      )
    })
  );
});

//fetch event
self.addEventListener('fetch', evt => {
  if (evt.request.mode === 'navigate') {
    evt.respondWith(
      fetch(evt.request).catch(() => {
        return caches.match('/index.html');
      })
    );
  } else {
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            limitCacheSize(dynamicCacheName, 30); // 如果超過 30 項，刪除最舊的一項
            return fetchRes;
          });
        });
      }).catch(() => {
        if (evt.request.url.indexOf('.html') > -1) {
          return caches.match('/pages/fallback.html');
        }
      })
    );
  }
});