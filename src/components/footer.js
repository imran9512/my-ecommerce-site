// components/Footer.js
import { useState } from 'react';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  TagIcon,
  QuestionMarkCircleIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'; // ✅ v2 path
import Link from 'next/link';

const sheets = {
  shop:   { title: 'Categories',   content: <p className="p-4">Categories here…</p> },
  help:   { title: 'Contact',      content: <p className="p-4">Email: contact@example.com</p> },
  cart:   { title: 'Your Cart',    content: <p className="p-4">Products + Checkout button</p> },
  search: { title: 'Search',       content: <p className="p-4">Search field here…</p> }
};

export default function Footer() {
  const [isOpen, setIsOpen] = useState(null);
  const [active, setActive]   = useState(null);

  const navItems = [
    { key: 'home',   label: 'Home',   icon: HomeIcon,                href: '/' },
    { key: 'shop',   label: 'Shop',   icon: TagIcon,                 action: () => setIsOpen('shop') },
    { key: 'search', label: 'Search', icon: MagnifyingGlassIcon,     action: () => setIsOpen('search') },
    { key: 'help',   label: 'Help',   icon: QuestionMarkCircleIcon,  action: () => setIsOpen('help') },
    { key: 'cart',   label: 'Cart',   icon: ShoppingCartIcon,        action: () => setIsOpen('cart') }
  ];

  return (
    <>
      {/* 5-icon sticky bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 flex justify-around items-center lg:hidden">
        {navItems.map(({ key, label, icon: Icon, href, action }) =>
          href ? (
            <Link
              key={key}
              href={href}
              onClick={() => setActive(key)}
              className={`flex flex-col items-center ${active === key ? 'text-sky-600' : 'text-gray-500'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ) : (
            <button
              key={key}
              onClick={() => { action(); setActive(key); }}
              className={`flex flex-col items-center ${active === key ? 'text-sky-600' : 'text-gray-500'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </button>
          )
        )}
      </nav>

      {/* Slide-up sheet */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(null)}>
          <div className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl max-h-[50vh] overflow-auto shadow-lg">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <h2 className="font-semibold">{sheets[isOpen].title}</h2>
              <button onClick={() => setIsOpen(null)} className="text-xl">&times;</button>
            </div>
            {sheets[isOpen].content}
          </div>
        </div>
      )}
    </>
  );
}