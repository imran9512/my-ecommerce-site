/* global self, localStorage */
const STORAGE_KEY = 'offline_order';
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScP9cDlIf1Ml38opCMK9amrYXKi9oXqVQDAMtXW9Gf05-GzZg/formResponse';

const GOOGLE_FORM_FIELDS = { /* copy only the keys you need */
    order_id: 'entry.XXXXXXXX',
    name: 'entry.YYYYYYYY',
    phone: 'entry.ZZZZZZZZ',
    city: 'entry.CCCCCCCC',
    address: 'entry.AAAAAAAA',
    instructions: 'entry.IIIIIIII',
    payment_method: 'entry.PPPPPPPP',
    courier_option: 'entry.OOOOOOOO',
    products_json: 'entry.PRODUCTS',
    subtotal: 'entry.SUBTOTAL',
    discount: 'entry.DISCOUNT',
    delivery_charges: 'entry.DELIVERY',
    grand_total: 'entry.TOTAL'
};

/* ---------- rest of the file stays exactly as posted earlier ---------- */
async function doSubmit() {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return;

    const body = new URLSearchParams();
    Object.entries(data.body).forEach(([k, v]) => body.append(GOOGLE_FORM_FIELDS[k], v));

    try {
        await fetch(GOOGLE_FORM_URL, { method: 'POST', mode: 'no-cors', body });
        localStorage.removeItem(STORAGE_KEY);
    } catch { /* Google unreachable → SW will retry next sync */ }
}

self.addEventListener('sync', event => {
    if (event.tag === 'offline-order') event.waitUntil(doSubmit());
});