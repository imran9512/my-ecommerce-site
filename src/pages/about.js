// src/pages/about.js
import { SITE_NAME } from '@/data/constants';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-sky-600 mb-6">About Us 🌟</h1>

      <h2 className="text-2xl font-semibold text-sky-500 mt-6 mb-2">Our Mission 🚀</h2>
      <p className="mb-4">
        At <strong>{SITE_NAME}</strong>, our mission is simple: to enhance your health and well-being by providing access to authentic, high-quality medicines. Navigating healthcare can be tough—so we make it easy.
      </p>

      <h2 className="text-2xl font-semibold text-sky-500 mt-6 mb-2">Quality Assurance ✅</h2>
      <p className="mb-2">
        Quality is non-negotiable! Every medicine we import is carefully selected and meets international standards.
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li><strong>Storage Conditions:</strong> Optimal storage to maintain potency 🏥</li>
        <li><strong>Temperature Control:</strong> Sensitive products kept at perfect temps 🌡️</li>
      </ul>

      <h2 className="text-2xl font-semibold text-sky-500 mt-6 mb-2">A Customer-Centric Approach 💖</h2>
      <p className="mb-2">
        Our shoppers are family! Here’s why they keep coming back:
      </p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Fast & reliable doorstep delivery 📦</li>
        <li>User-friendly, mobile-first site 📱</li>
        <li>Support team ready on WhatsApp 7 days a week 🤝</li>
      </ul>

      <h2 className="text-2xl font-semibold text-sky-500 mt-6 mb-2">Online-Only Convenience 💻</h2>
      <p className="mb-2">No physical store, just pure focus on you:</p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Shop 24 / 7 from anywhere 🌐</li>
        <li>Wider range than local pharmacies 🛒</li>
        <li>Exclusive online discounts & promos 🎁</li>
      </ul>

      <h2 className="text-2xl font-semibold text-sky-500 mt-6 mb-2">Our Values 🌈</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li><strong>Integrity:</strong> Ethical standards in every transaction ✅</li>
        <li><strong>Customer Focus:</strong> Your satisfaction is our KPI 💯</li>
        <li><strong>Innovation:</strong> Always improving UX & product lineup ⚡</li>
      </ul>

      <h2 className="text-2xl font-semibold text-sky-500 mt-6 mb-2">Join Our Community 🤝</h2>
      <p className="mb-4">
        Follow us on socials for health tips, flash sales & member perks. Become part of the <strong>{SITE_NAME}</strong> family today!
      </p>

      <h2 className="text-2xl font-semibold text-sky-500 mt-6 mb-2">Conclusion 🎉</h2>
      <p className="text-lg font-medium">
        Thank you for choosing <strong>{SITE_NAME}</strong>! Explore our site now and feel the difference—your health, our priority. 💖
      </p>
    </div>
  );
}