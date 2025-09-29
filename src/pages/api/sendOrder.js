// src/pages/api/sendOrder.js
import { generateOrderId } from '../../components/orderId';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const {
            orderId,
            form,
            items,
            subtotal,
            discount,
            courierCharge,
            finalTotal,
            stripDelivery,
        } = req.body;

        const safeCourierCharge = Number(courierCharge || 0);
        const safeStripDelivery = Number(stripDelivery || 0);
        const deliveryCharges = [safeCourierCharge, safeStripDelivery]
            .map(v => ` ${Math.round(v)}`)
            .join(', ');

        const webhookUrl = process.env.DISCORD_WEBHOOK;
        if (!webhookUrl) throw new Error('Webhook not configured');

        const pkrTime = new Date().toLocaleString('en-PK', {
            timeZone: 'Asia/Karachi',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });

        const products = items
            .map(it => {
                const suffix = it.id.endsWith('-strip') ? '-strip' : '';
                return `${it.sku}${suffix}×${it.quantity}`;
            })
            .join(', ');

        const message =
            `${orderId} - ` +
            `${form.name} - ` +
            `${form.phone} - ` +
            `${form.city} - ` +
            `${form.address} - ` +
            `${form.instructions || 'none'} - ` +
            `${products} - ` +
            `${Math.round(subtotal)} - ` +
            `${Math.round(discount)} - ` +
            `${deliveryCharges} - ` +
            `${Math.round(finalTotal)} - ` +
            `${form.payment_method} - ` +
            `${form.courier_option} - ` +
            `${pkrTime}`;

        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message }),
        });

        res.status(200).json({ message: 'Order sent' });
    } catch (err) {
        console.log('🩸 sendOrder crash:', err.message, err.stack);
        res.status(500).json({ message: err.message });
    }
}