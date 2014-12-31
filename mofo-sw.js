/**
 * ATHENA DEMO SERVICE WORKER
 * @author Carlos Araya
 * @email carlos.araya@gmail.com
 *
 * Serviceworker for the demonstration athena publication.
 */

// This polyfill provides Cache.add(), Cache.addAll(),
// and CacheStorage.match(), which are not implemented in Chrome 40.
importScripts('js/serviceworker-cache-polyfill.js');

var CACHE_NAME = 'athena-demo';
var CACHE_VERSION = 3;
debugger;
self.oninstall = function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(function(cache) {
      return cache.addAll([
        '/bower_components/',
        '/content/',
        '/css/',
        '/js/',
        '/layouts/',
        'index.html',
        'notes.html',
        'http://chimera.labs.oreilly.com/books/1230000000345/ch12.html',
        'http://chimera.labs.oreilly.com/books/1230000000345/apa.html'
      ]);
    })
  );
};

self.onactivate = function(event) {
  console.log('I am an active serviceworker');
  var currentCacheName = CACHE_NAME + '-v' + CACHE_VERSION;
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        if (cacheName.indexOf(CACHE_NAME) == -1) {
          return;
        }

        if (cacheName != currentCacheName) {
          return caches.delete(cacheName);
        }
      })
    );
  });

};

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
