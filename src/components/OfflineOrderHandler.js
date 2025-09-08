// src/components.OfflineOrderHandler.js
import { useEffect } from 'react';
import { buildBody, postOrder } from '@/utils/offlineOrder';

const STORAGE_KEY = 'offline_order';

export function OfflineOrderHandler() {
    useEffect(() => {
        console.log('🚀 OfflineOrderHandler MOUNTED');
        const onOnline = async () => {
            console.log('🔥 ONLINE event fired');
            const raw = localStorage.getItem(STORAGE_KEY);
            console.log('📦 raw from LS:', raw);
            if (!raw) return;
            try {
                const { orderId, form, items, subtotal, discount, courierCharge, finalTotal } =
                    JSON.parse(raw);
                const body = buildBody(orderId, form, items, subtotal, discount, courierCharge, finalTotal, true);
                await postOrder(body);
                console.log('✅ Google Form POST finished');
                localStorage.removeItem(STORAGE_KEY);
            } catch { }
        };
        window.addEventListener('online', onOnline);
        return () => window.removeEventListener('online', onOnline);
    }, []);
    return null;
}