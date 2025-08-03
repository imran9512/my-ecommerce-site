// src/pages/terms-and-conditions.js
import { SITE_NAME } from '@/data/constants';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-sky-600 mb-6">Terms & Conditions 🌐</h1>

      <p className="mb-4">
        Welcome to <strong>{SITE_NAME}</strong>! 🛍️ By using our site or placing an order, you agree to the following guidelines designed to keep your shopping smooth and secure.
      </p>

      <h2 className="text-xl font-semibold text-sky-500 mt-6 mb-2">Authenticity Promise ✅</h2>
      <p className="mb-4">
        Every product on <strong>{SITE_NAME}</strong> is imported and 100 % original, sourced only from trusted suppliers so you can buy with total confidence.
      </p>

      <h2 className="text-xl font-semibold text-sky-500 mt-6 mb-2">Safe Usage Reminder ⚠️</h2>
      <p className="mb-4">
        Always consult your doctor or do your own research before use. <strong>{SITE_NAME}</strong> is not liable for misuse, side-effects, or allergies—your health comes first! 🩺
      </p>

      <h2 className="text-xl font-semibold text-sky-500 mt-6 mb-2">No Returns 🚫</h2>
      <p className="mb-4">
        Because of strict temperature & storage rules, we cannot accept returns. Please double-check quantity and product before checkout. 📦
      </p>

      <h2 className="text-xl font-semibold text-sky-500 mt-6 mb-2">Packaging Variations 📦</h2>
      <p className="mb-4">
        Box or strip design may differ from photos due to regional regulations, yet the contents remain identical in quality & formula. 🌍
      </p>

      <h2 className="text-xl font-semibold text-sky-500 mt-6 mb-2">Partial Packs 💊</h2>
      <p className="mb-4">
        Need less than a full box? Message us on WhatsApp for custom quantities. 💬
      </p>

      <h2 className="text-xl font-semibold text-sky-500 mt-6 mb-2">Contact 📱</h2>
      <p className="mb-4">
        We reply only via WhatsApp-registered numbers for the fastest support. 🗨️
      </p>

      <h2 className="text-xl font-semibold text-sky-500 mt-6 mb-2">Cancellation Policy ❌</h2>
      <p className="mb-4">
        We may cancel any order without notice to maintain service quality. 🔄
      </p>

      <p className="mt-6 text-lg font-medium">
        Thank you for choosing <strong>{SITE_NAME}</strong>! 💖
        <br />
        Your well-being is our mission—reach out anytime for questions.
      </p>
    </div>
  );
}