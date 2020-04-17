importScripts('/cache-polyfill.js');


self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('trivia').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/style.css',
       '/js/index.js',
       '/img/icons/1.png',
       '/img/icons/2.png',
       '/img/icons/3.png',
       '/img/icons/4.png',
       '/img/icons/5.png',
       '/img/icons/6.png',
       '/img/icons/7.png',
       '/img/icons/8.png'
     ]);
   })
 );
});


self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
 
  event.respondWith(
    caches.open('trivia').then(function(cache){
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    })
   
  );
 });