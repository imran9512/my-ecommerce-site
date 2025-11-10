// src/pages/contact.js
import Head from 'next/head';
import { canonical } from '@/utils/seo';
import { WhatsAppIcon } from '@/components/icons';
import { WHATSAPP_NUMBER } from '@/data/constants';

export default function ContactPage() {
  const message = encodeURIComponent(
    'Hi! I need somne help Please assist.'
  );

  const openWhatsApp = () =>
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      '_blank'
    );

  return (
    <>
      <Head>
        <title>Contact AAPKISEHAT | Aap Ki Sehat</title>
        <link rel="canonical" href={canonical('/contact')} />
      </Head>

      <div className="max-w-2xl mx-auto px-4 mt-20 mb-4 text-center">
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
          className="flex items-center m-auto space-x-1.5 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <WhatsAppIcon />&nbsp; WhatsApp Us
        </button>
      </div>
    </>
  );
}