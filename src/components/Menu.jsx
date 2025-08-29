// src/components/Menu.jsx
import { useState } from 'react';
import Link from 'next/link';
import { WHATSAPP_NUMBER } from '@/data/constants';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

export default function Menu({ categories, helpLinks, onClose }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [openUseful, setOpenUseful] = useState(false);

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm z-40"
      onClick={(e) => {
        // close on backdrop click
        if (e.target === e.currentTarget) onClose(); {
          // caller must close itself
        }
      }}
    >
      <div
        className="fixed top-20 left-2 w-60 rounded-xl shadow-2xl bg-white/50 backdrop-blur-md p-4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="space-y-4">
          {categories.map(({ name, sub }, idx) => (
            <div key={name}>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setOpenCategory(openCategory === idx ? null : idx)}
              >
                <Link
                  href={`/category/${name.toLowerCase()}`}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white/40 px-3 py-1.5 rounded shadow hover:bg-slate-50 transition"
                >
                  {name}
                </Link>
                {sub && sub.length > 0 && (
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${
                      openCategory === idx ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </div>
              {openCategory === idx && sub && sub.length > 0 && (
                <ul className="pl-4 mt-2 space-y-1">
                  {sub.map((s) => (
                    <li key={s}>
                      <Link
                        href={`/category/${s.toLowerCase()}`}
                        className="inline-block bg-white/70 px-3 py-1 rounded shadow text-xs hover:bg-slate-200 transition"
                      >
                        -&nbsp;{s}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {/* Useful Links */}
        <div className="mt-6 pt-4 border-t border-slate-300">
          <div
            className="flex items-center justify-between font-semibold cursor-pointer"
            onClick={() => setOpenUseful(!openUseful)}
          >
            Useful Links
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                openUseful ? 'rotate-180' : ''
              }`}
            />
          </div>
          {openUseful && (
            <ul className="pl-4 space-y-1 mt-2">
              {helpLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="block text-sm text-sky-600 hover:text-black"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => {
            window.open(
              `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hi! I need help with products or my order.'
              )}`,
              '_blank'
            );
            // caller must close itself
          }}
          className="w-full mt-4 h-8 flex items-center justify-center bg-green-500 text-white rounded-full text-xs font-semibold hover:bg-green-600 transition"
        >
          <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 mr-1.5" />
          WhatsApp Us
        </button>
      </div>
    </div>
  );
}