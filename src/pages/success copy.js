// src/pages/success.js
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { WHATSAPP_NUMBER } from '@/data/constants';

export default function SuccessPage() {
  const router = useRouter();
  const { order_id, grandTotal, payment_method } = router.query;

  const isBankTransfer = payment_method === 'Online';

  const bankMsg =
    `Hi, I chose *Bank Transfer* for order *${order_id}* (Rs ${grandTotal}). ` +
    `Please share your account details so I can deposit the amount.`;

  const openWhatsApp = () =>
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(bankMsg)}`,
      '_blank'
    );

  return (
    <>
      <Head>
        <title>Order Successful</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="text-center py-20 px-4">
        <h1 className="text-3xl font-bold text-green-600">Thank you!</h1>
        <p className="mt-2 text-xl">Your order has been submitted.</p>

        {order_id && (
          <p className="mt-4 text-lg">
            Order ID: <span className="font-mono text-sky-600">{order_id}</span>
          </p>
        )}
        {grandTotal && (
          <p className="text-lg">
            Total: <span className="font-mono text-sky-600">Rs {grandTotal}</span>
          </p>
        )}

        {isBankTransfer && (
          <div className="mt-6 bg-blue-50 border border-blue-300 rounded-lg p-4 inline-block">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              Bank Transfer Instructions
            </h2>
            <p className="text-blue-600 mb-4">
              Tap below to receive our account details via WhatsApp.
            </p>
            <button
              onClick={openWhatsApp}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              📞 Get Account Details on WhatsApp
            </button>
          </div>
        )}

        <div>
          <Link href="/shop" className="mt-8 inline-block bg-sky-600 text-white px-6 py-2 rounded">
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}