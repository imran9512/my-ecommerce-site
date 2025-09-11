// src/components/OfflineOrderHandler.js
import { useEffect } from 'react';

export function OfflineOrderHandler() {
    useEffect(() => {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker
                .register('/sw.js')
                .then(reg => {
                    // retry immediately after page loads (in case user came back online)
                    reg.sync.getTags().then(tags => {
                        if (tags.includes('offline-order')) reg.sync.register('offline-order');
                    });
                })
                .catch(() => { });
        }

        // legacy fallback: online event (kept for old browsers)
        const onOnline = () => {
            const raw = localStorage.getItem('offline_order');
            if (!raw) return;
            navigator.serviceWorker.ready.then(reg => reg.sync.register('offline-order'));
        };
        window.addEventListener('online', onOnline);
        return () => window.removeEventListener('online', onOnline);
    }, []);
    return null;
}