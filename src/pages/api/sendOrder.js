// src/pages/api/sendOrder.js  –  Edge Function
import { DISCORD_HEADER } from '../../data/constants';

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || 'https://discord.com/api/webhooks/1420176049899175958/TMPlXOEAImMwabGGfuN4LxpH82Orkl5sGmMvchS4S-je5HojGNPJvakZhhdvCH52LXtK';

export const config = { runtime: 'edge' };

/* --------------  NEW  –  slim format  -------------- */
function buildTabLine(orderId, form, items, subtotal, discount, courierCharge, finalTotal, offline = false) {
    const products = items
        .map(it => {
            const suffix = it.id.endsWith('-strip') ? '-strip' : '';
            return `${it.sku}${suffix}×${it.quantity}`;
        })
        .join(', ');

    // single-space values | order: timestamp, id, name, number, city, address, instructions, items, sub, discount, delivery, grand, pay-method, courier, offline-flag
    const ts = new Date().toLocaleString('en-PK'); // Pakistan time
    return [
        ts,
        orderId,
        form.name,
        form.phone,
        form.city,
        form.address,
        form.instructions,
        products,
        subtotal.toFixed(2),
        discount.toFixed(2),
        courierCharge.toFixed(2),
        finalTotal.toFixed(2),
        form.payment_method,
        form.courier_option,
        offline ? 'Offline' : '',
    ].join(' ');
}

export default async function handler(req) {
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const body = await req.json();
    const { orderId, form, items, subtotal, discount, courierCharge, finalTotal, offline } = body;

    // =====  LOCAL: skip Discord (Edge blocks external fetch) =====
    if (process.env.NODE_ENV === 'development' || offline) {
        return new Response(JSON.stringify({ ok: true, queued: offline }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // =====  PRODUCTION: Discord post =====
    const discordPayload = {
        content: `\`\`\`${DISCORD_HEADER}\n${buildTabLine(
            orderId,
            form,
            items,
            subtotal,
            discount,
            courierCharge,
            finalTotal,
            offline
        )}\`\`\``,
    };

    try {
        const discordRes = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload),
        });
        if (!discordRes.ok) throw new Error('Discord error');
    } catch (e) {
        console.error('[sendOrder] Discord fail', e);
        return new Response('Discord error', { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
}