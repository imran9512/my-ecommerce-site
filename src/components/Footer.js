// src/components/Footer.js
import { useState } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  QuestionMarkCircleIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/solid';
import { useCartStore } from '@/stores/cart';
import { WHATSAPP_NUMBER } from '@/data/constants';

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(null);
  const cartCount = useCartStore(s => s.items.reduce((a, b) => a + b.quantity, 0));

  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms-and-conditions' },
    { label: 'Contact', href: '/contact' },
  ];

  const openWhatsApp = () =>
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'Hi! I need help with products or my order.'
      )}`,
      '_blank'
    );

  return (
    <>
      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 flex justify-around items-center lg:hidden">
        {[
          { key: 'home', label: 'Home', icon: HomeIcon, href: '/' },
          { key: 'shop', label: 'Shop', icon: BuildingStorefrontIcon, href: '/shop' },
          { key: 'search', label: 'Search', icon: MagnifyingGlassIcon, href: '/search' },
          { key: 'help', label: 'Help', icon: QuestionMarkCircleIcon, action: () => setIsOpen(true) },
          { key: 'cart', label: 'Cart', icon: ShoppingCartIcon, href: '/cart' },
        ].map(({ key, label, icon: Icon, href, action }) =>
          href ? (
            <Link
              key={key}
              href={href}
              onClick={() => setActive(key)}
              className={`flex flex-col items-center ${active === key ? 'text-green-500' : 'text-sky-500'}`}
            >
              <Icon className="w-6 h-6" />
              {key === 'cart' && cartCount > 0 && (
                <span className="absolute -top-1 right-8 bg-red-500 text-white text-[10px] rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ) : (
            <button
              key={key}
              onClick={action}
              className={`flex flex-col items-center ${active === key ? 'text-green-500' : 'text-sky-500'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </button>
          )
        )}
      </nav>

      {/* Glassy drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute bottom-16 left-0 right-0 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl max-h-[60vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-sky-600">Quick Links</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xl text-gray-500"
              >
                &times;
              </button>
            </div>

            {/* 2×2 grid */}
            <div className="grid grid-cols-2 gap-4 p-4">
              {quickLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-center bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-xl p-4 text-sm font-semibold transition"
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* WhatsApp button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  window.open(
                    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      'Hi! I need help with products or my order.'
                    )}`,
                    '_blank'
                  );
                  setIsOpen(false);
                }}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition"
              >
                📲 Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}