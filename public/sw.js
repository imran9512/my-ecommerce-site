// public/sw.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
workbox.setConfig({ debug: false });

// ---------  CACHE  ---------
workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({ cacheName: 'images' })
);

// ==========  BACKGROUND SYNC  ==========
const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('offlineOrders', {
    maxRetentionTime: 24 * 60, // minutes
    onSync: async ({ queue }) => {
        console.log('[SW] onSync fired, queue:', queue);
        let entry;
        while ((entry = await queue.shiftRequest())) {
            console.log('[SW] retrying', entry);
            try {
                await fetch(entry.request.clone());
                console.log('[SW] retry success');
            } catch (err) {
                console.error('[SW] retry failed', err);
                await queue.unshiftRequest(entry);
                break;
            }
        }
    }
});

workbox.routing.registerRoute(
    '/api/sendOrder',
    new workbox.strategies.NetworkOnly({ plugins: [bgSyncPlugin] }),
    'POST'
);