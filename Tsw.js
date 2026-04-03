/* Service Worker for Success Zone - TEC Prep
   Offline functionality with Cache
*/

const CACHE_NAME = 'sz-tec-v1'; 
const assets = [
    './',
    './index.html',
    './Tstyle.css',
    './Tapp.js',
    './Tmanifest.json',
    './Tentrepreneurship.js',
    './Teconomy.js',
    './Topportunity.js',
    './Tplanning.js',
    './Tmarketing.js',
    './Taccounting.js',
    './Tlegal.js',
    './Tfinance.js',
    './Tsoftskills.js',
    './Tdigital.js',
    './Tfinal.js',
   '1775237502348.png'
];

// इंस्टॉल इवेंट: सभी फाइलों को ऑफलाइन सेव करना
self.addEventListener('install', event => {
   self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching assets for offline use...');
            return cache.addAll(assets);
        })
    );
});

// एक्टिवेट इवेंट: पुराने कैश को साफ करना
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// फेच इवेंट: इंटरनेट न होने पर कैश से फाइल देना
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
