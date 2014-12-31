/**
 * ATHENA DEMO SERVICE WORKER
 * @author Carlos Araya
 * @email carlos.araya@gmail.com
 *
 * Serviceworker for the demonstration athena publication.
 *
 * Based (and liberally stolen from Jake Archibald's Trainer to thrill)
 *
 * */

importScripts('js/serviceworker-cache-polyfill.js');

var CACHE_NAME = 'athena-demo';
var CACHE_VERSION = 1;

self.oninstall = function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(function(cache) {
      return cache.addAll([
        '/athena-framework/',
        '/athena-framework/css/',
        '/athena-framework/js/',
        '/athena-framework/bower_components/',
        '/athena-framework/content/',
        '/athena-framework/notes.html',
        '/athena-framework/index.html'
      ]);
    })
  );
};


var expectedCaches = [
  'athena-demo',
  'athena-content'
];

self.onactivate = function(event) {
  // remove caches beginning "trains-" that aren't in
  // expectedCaches
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCaches.indexOf(cacheName) == -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
};

self.onfetch = function(event) {
  var request = event.request;
  var requestURL = new URL(event.request.url);

  // If I'm understanding this correctly we'll respond with either
  // a cache match or the network response. W
  event.respondWith(caches.match(event.request) || fetch(requestURL));

//  if (requestURL.hostname == 'api.flickr.com') {
//    event.respondWith(flickrAPIResponse(event.request));
//  }
//  else if (/\.staticflickr\.com$/.test(requestURL.hostname)) {
//    event.respondWith(flickrImageResponse(event.request));
//  }
//  else {
//    event.respondWith(
//      caches.match(event.request, {
//        ignoreVary: true
//      })
//    );
//  }

};

function flickrAPIResponse(request) {
  if (request.headers.get('Accept') == 'x-cache/only') {
    return caches.match(request);
  }
  else {
    return fetch(request.clone()).then(function(response) {
      return caches.open('trains-data').then(function(cache) {
        // clean up the image cache
        Promise.all([
          response.clone().json(),
          caches.open('trains-imgs')
        ]).then(function(results) {
          var data = results[0];
          var imgCache = results[1];

          var imgURLs = data.photos.photo.map(function(photo) {
            return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_c.jpg';
          });

          // if an item in the cache *isn't* in imgURLs, delete it
          imgCache.keys().then(function(requests) {
            requests.forEach(function(request) {
              if (imgURLs.indexOf(request.url) == -1) {
                imgCache.delete(request);
              }
            });
          });
        });

        cache.put(request, response.clone()).then(function() {
          console.log("Yey cache");
        }, function() {
          console.log("Nay cache");
        });

        return response;
      });
    });
  }
}

function flickrImageResponse(request) {
  return caches.match(request).then(function(response) {
    if (response) {
      return response;
    }

    return fetch(request.clone()).then(function(response) {
      caches.open('trains-imgs').then(function(cache) {
        cache.put(request, response).then(function() {
          console.log('yey img cache');
        }, function() {
          console.log('nay img cache');
        });
      });

      return response.clone();
    });
  });
}
