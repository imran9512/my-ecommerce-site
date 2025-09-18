// src/pages/privacy.js
import Head from 'next/head';
import { canonical } from '@/utils/seo';
import { SITE_NAME } from '@/data/constants';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Aap Ki Sehat</title>
        <link rel="canonical" href={canonical('/privacy')} />
      </Head>
      <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 leading-relaxed">
        <h1 className="text-3xl font-bold text-sky-600 mb-6">
          Privacy Policy 🔒
        </h1>
        <p className="mb-4">
          Effective Date: <strong>31-December-2030</strong>
        </p>

        <p className="mb-4">
          Welcome to <strong>{SITE_NAME}</strong>! Your privacy is our priority, and we’re committed to keeping your data safe while you shop with peace of mind. 🌐
        </p>

        <h2 className="text-xl font-semibold text-sky-500 mt-6 mb-2">
          What We Collect 📋
        </h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>
            <strong>Personal Info</strong> – name, email, phone, shipping & payment details during checkout. We delete this data after delivery. 🛍️
          </li>
          <li>
            <strong>Non-Personal Info</strong> – we <strong>do NOT</strong> track devices, IP addresses, locations, or any other metrics. 🚫
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-sky-500 mt-6 mb-2">
          How We Use Your Info 📊
        </h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Process and ship your orders 📦</li>
          <li>Provide customer support 🤝</li>
          <li>We <strong>never</strong> send marketing emails or ads 🚫</li>
        </ul>

        <h2 className="text-xl font-semibold text-sky-500 mt-6 mb-2">
          Sharing Your Info 🔍
        </h2>
        <p className="mb-4">
          We do <strong>not</strong> sell, rent, or share your data. Built on our own secure, database-free platform, your information is erased within 2–3 days. ⏳
        </p>

        <p className="mt-6 text-lg font-medium">
          Thank you for trusting <strong>{SITE_NAME}</strong>! 🛡️
        </p>
      </div>
    </>
  );
}