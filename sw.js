/**
 * ATHENA DEMO SERVICE WORKER
 *
 * @author Carlos Araya
 * @email carlos.araya@gmail.com
 *
 */

importScripts('js/serviceworker-cache-polyfill.js');

var CACHE_NAME = 'athena-demo';
var CACHE_VERSION = 5;

self.oninstall = function(event) {
debugger;
  event.waitUntil(
    caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(function(cache) {

      return cache.addAll([

        '/athena-framework/',
        '/athena-framework/bower_components/',
        '/athena-framework/css/',
        '/athena-framework/js/',
        '/athena-framework/layouts/',

        '/athena-framework/content/',
        '/athena-framework/index.html',
        '/athena-framework/notes.html'
      ]);
    })
  );
};

self.onactivate = function(event) {
debugger;
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
debugger;
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
            cache.put(request, responseToCache)
            console.log('put file on cache: ' + request);
            .catch(function(err) {
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
