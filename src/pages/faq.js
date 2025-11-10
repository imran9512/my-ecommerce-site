// src/pages/faq.js
import Head from 'next/head';
import { canonical } from '@/utils/seo';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@/components/icons';

const faqData = [
  {
    q: 'How do I place an order? 🛒',
    a: 'Simply browse our site, add desired items to your cart, proceed to checkout, fill in your details, choose your payment method, and hit “Submit Order”. You’ll receive an order confirmation instantly.',
  },
  {
    q: 'What payment methods do you accept? 💳',
    a: 'We offer two convenient options: 1) Cash on Delivery (COD) – pay when you receive your parcel. 2) Online Bank Transfer – pay via bank app/ATM and get an extra discount on your total bill.',
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <>
      <Head>
        <title>FAQs | Aap Ki Sehat</title>
        <link rel="canonical" href={canonical('/faq')} />
      </Head>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-sky-600 mb-8 text-center">
          Frequently Asked Questions ❓
        </h1>

        <div className="space-y-4">
          {faqData.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggle(idx)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700 hover:bg-gray-50"
              >
                <span>{item.q}</span>
                {openIdx === idx ? (
                  <ChevronUpIcon className="w-5 h-5 text-sky-600" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {openIdx === idx && (
                <div className="p-4 border-t border-gray-100 text-gray-600 bg-sky-50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}