import { get, set, del, keys } from 'idb-keyval';

const QUEUE_NAME = 'offline_orders';

// add
export async function enqueueOrder(order) {
    const all = (await get(QUEUE_NAME)) || [];
    all.push({ ...order, ts: Date.now() });
    await set(QUEUE_NAME, all);
}

// get + clear
export async function dequeueOrders() {
    const all = (await get(QUEUE_NAME)) || [];
    await del(QUEUE_NAME);
    return all;
}

// for retry (single delete after success)
export async function removeOrder(ts) {
    const all = (await get(QUEUE_NAME)) || [];
    const filtered = all.filter(o => o.ts !== ts);
    await set(QUEUE_NAME, filtered);
}