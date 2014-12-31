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

self.oninstall = function(event) {
  console.log('I installed successfully');
  event.waitUntil(
    caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(function(cache) {

      return cache.addAll([
        // This is where you add the files to cache
        // web components
        '/bower_components/',
        // HTML content and component wrappers
        '/content/',
        // CSS
        '/css/',
        // Javasacript
        '/js/',
        // Layout component
        '/layouts/',
        // Content Pages
        'index.html',
        'notes.html',
        // Testing whether I can add external content to the serviceworker
        // to use
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

self.onfetch = function(event) {
  var request = event.request;
  var requestURL = new URL(event.request.url);

  event.respondWith(

    // Check the cache for a hit.
    caches.match(request).then(function(response) {

      // If we have a response return it.
      if (response)
        return response;

      // Otherwise fetch it, store and respond.
      return fetch(request).then(function(response) {

        var responseToCache = response.clone();

        caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(
          function(cache) {
            cache.put(request, responseToCache).catch(function(err) {
              // Likely we got an opaque response which the polyfill
              // can't deal with, so log out a warning.
              console.warn(requestURL + ': ' + err.message);
            });
          });

        return response;
      });

    })
  );
};
