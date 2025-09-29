// src/pages/api/sendOrder.js
import { generateOrderId } from '../../components/orderId';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log('① body:', req.body);
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
        console.log('② destructured', { orderId, stripDelivery });

        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        if (!webhookUrl) {
            return res.status(500).json({ message: 'Webhook not configured' });
        }

        // Pakistani time
        const pkrTime = new Date().toLocaleString('en-PK', {
            timeZone: 'Asia/Karachi',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            //second: '2-digit',
            hour12: true,
        });

        // Products line
        const products = items
            .map(it => {
                const suffix = it.id.endsWith('-strip') ? '-strip' : '';
                return `${it.sku}${suffix}×${it.quantity}`;
            })
            .join(', ');

        // Combine courier + strip charges with comma
        const safeCourierCharge = Number(courierCharge || 0);
        const safeStripDelivery = Number(stripDelivery || 0);
        const deliveryCharges = [safeCourierCharge, safeStripDelivery]
            .map(v => ` ${Math.round(v)}`)
            .join(', ');

        // Complete Discord message
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

        console.log('③ webhook:', process.env.DISCORD_WEBHOOK?.slice(-8));
        console.log('④ fetch start');

        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message }),
        });
        console.log('⑤ fetch done');

        res.status(200).json({ message: 'Order sent' });
    } catch (err) {
        console.log('🩸 sendOrder crash:', err.message, err.stack);
        res.status(500).json({ message: err.message });
        console.log('⑦ after res.json');
    }
}