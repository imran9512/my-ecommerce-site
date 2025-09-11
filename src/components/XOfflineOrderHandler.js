// src/components.OfflineOrderHandler.js
import { useEffect } from 'react';
import { buildBody, postOrder } from '@/utils/offlineOrder';

const STORAGE_KEY = 'offline_order';

export function OfflineOrderHandler() {
    useEffect(() => {
        const onOnline = async () => {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            try {
                const { orderId, form, items, subtotal, discount, courierCharge, finalTotal } =
                    JSON.parse(raw);
                const body = buildBody(orderId, form, items, subtotal, discount, courierCharge, finalTotal, true);
                await postOrder(body);
                localStorage.removeItem(STORAGE_KEY);
            } catch { }
        };
        window.addEventListener('online', onOnline);
        return () => window.removeEventListener('online', onOnline);
    }, []);
    return null;
}