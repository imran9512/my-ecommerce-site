// src/utils/offlineOrder.js
import { GOOGLE_FORM_URL } from '@/data/constants';
const GOOGLE_FORM_FIELDS = { /* same as before */ };

function getDiscountedPrice(price, qtyDiscount, quantity) {
    if (!price || !qtyDiscount || typeof qtyDiscount !== 'object') return Math.round(price);
    const tiers = Object.keys(qtyDiscount).map(Number).sort((a, b) => a - b);
    const tier = tiers.filter(t => t <= quantity).pop();
    const percent = qtyDiscount[tier] || 0;
    return Math.round(price - price * (percent / 100));
}

function buildBody(orderId, form, items, subtotal, discount, courierCharge, finalTotal, isOffline = false) {
    const productLine = items
        .map(it => {
            const p = getDiscountedPrice(it.price, it.qtyDiscount, it.quantity);
            return `${it.name} x ${it.quantity} rate: ${p}`;
        })
        .join(', ');

    const body = new URLSearchParams();
    body.append(GOOGLE_FORM_FIELDS.order_id, orderId);
    body.append(GOOGLE_FORM_FIELDS.name, isOffline ? `Offline-${form.name}` : form.name);
    body.append(GOOGLE_FORM_FIELDS.phone, form.phone);
    body.append(GOOGLE_FORM_FIELDS.city, form.city);
    body.append(GOOGLE_FORM_FIELDS.address, form.address);
    body.append(GOOGLE_FORM_FIELDS.instructions, form.instructions);
    body.append(GOOGLE_FORM_FIELDS.payment_method, form.payment_method);
    body.append(GOOGLE_FORM_FIELDS.courier_option, form.courier_option);
    body.append(GOOGLE_FORM_FIELDS.products_json, productLine);
    body.append(GOOGLE_FORM_FIELDS.subtotal, subtotal.toFixed(2));
    body.append(GOOGLE_FORM_FIELDS.discount, discount.toFixed(2));
    body.append(GOOGLE_FORM_FIELDS.delivery_charges, courierCharge.toFixed(2));
    body.append(GOOGLE_FORM_FIELDS.grand_total, finalTotal.toFixed(2));
    return body;
}

async function postOrder(body) {
    console.log('📡 POSTing to Google Form...');          // ✅ NEW
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 7000);
    await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: controller.signal,
    });
    clearTimeout(t);
    console.log('📬 fetch completed (no error thrown)');   // ✅ NEW
}

module.exports = { buildBody, postOrder };