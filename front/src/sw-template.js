if ('function' === typeof importScripts) {
    importScripts(
        'https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js'
    );
    /* global workbox */
    if (workbox) {
        console.log('Workbox is loaded');

        workbox.core.setCacheNameDetails({ prefix: "monclub" });

        /* injection point for manifest files.  */
        workbox.precaching.precacheAndRoute([]);

        /* custom cache rules*/
        workbox.routing.registerNavigationRoute('/index.html', {
            blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
        });

        // workbox.routing.registerRoute(
        //     /\/api\//,
        //     new workbox.strategies.NetworkFirst({
        //         cacheName: "monclub-api",
        //         plugins: [
        //             new workbox.cacheableResponse.Plugin({
        //                 statuses: [0, 200]
        //             })
        //         ]
        //     }), 'GET');

        workbox.routing.registerRoute(
            /\/api\/param/,
            new workbox.strategies.CacheFirst({
                cacheName: "monclub-api-param",
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [0, 200]
                    })
                ]
            }), 'GET');

        workbox.routing.registerRoute(
            /.(?:png|jpg|jpeg|svg)/,
            new workbox.strategies.CacheFirst({
                cacheName: "monclub-images",
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [0, 200]
                    })
                ]
            }), 'GET');

    } else {
        console.log('Workbox could not be loaded. No Offline support');
    }
}
