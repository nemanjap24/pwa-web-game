const CACHE_NAME = 'ball-game-v1';
const urlsToCache = [
    '/~xsith/gyro-test/',
    '/~xsith/gyro-test/index.html',
    '/~xsith/gyro-test/style.css',
    '/~xsith/gyro-test/sketch.js',
    '/~xsith/gyro-test/GameObjects/Ball.js',
    '/~xsith/gyro-test/GameObjects/Coin.js',
    '/~xsith/gyro-test/GameObjects/Wall.js',
    '/~xsith/gyro-test/GameObjects/Obstacle.js',
    '/~xsith/gyro-test/GameObjects/Finish.js',
    '/~xsith/gyro-test/CollisionDetector.js',
    '/~xsith/gyro-test/levels.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});