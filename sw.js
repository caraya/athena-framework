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
// The SW will be shutdown when not in use to save memory,
// be aware that any global state is likely to disappear
console.log("SW startup");

self.addEventListener('install', function(event) {
  console.log("SW installed");
});

self.addEventListener('activate', function(event) {
  console.log("SW activated");
});

self.addEventListener('fetch', function(event) {
  console.log("Caught a fetch!");
  event.respondWith(new Response("Hello world!"));
});
