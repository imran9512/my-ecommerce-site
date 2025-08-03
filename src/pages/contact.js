// src/pages/contact.js
import Head from 'next/head';
import { WHATSAPP_NUMBER } from '@/data/constants';

export default function ContactPage() {
  const message = encodeURIComponent(
    'Hi! I need help with:\n• Product information\n• Placing an order\n• Tracking my order\n• Payment methods\nPlease assist.'
  );

  const openWhatsApp = () =>
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      '_blank'
    );

  return (
    <>
      <Head>
        <title>Contact Us – WhatsApp</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-sky-600 mb-6">Contact Us 📱</h1>

        <p className="text-lg text-gray-700 mb-8">
          Reach out to us on WhatsApp for:
        </p>

        <ul className="text-left list-disc list-inside text-gray-600 mb-8 space-y-2">
          <li>Product information</li>
          <li>Placing a new order</li>
          <li>Tracking your existing order</li>
          <li>Payment method details</li>
        </ul>

        <button
          onClick={openWhatsApp}
          className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition"
        >
          📲 Chat on WhatsApp
        </button>
      </div>
    </>
  );
}