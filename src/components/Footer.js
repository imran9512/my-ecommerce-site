// src/components/Footer.js
import { useState } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  QuestionMarkCircleIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/solid';
import { useCartStore } from '@/stores/cart';

/* drawer contents */
const HelpContent = () => <p className="p-4">Email: contact@example.com</p>;

export default function Footer() {
  const [isOpen, setIsOpen] = useState(null);
  const [active, setActive] = useState(null);
  const cartCount = useCartStore(s => s.items.reduce((a, b) => a + b.quantity, 0));

  const navItems = [
    { key: 'home',  label: 'Home',  icon: HomeIcon,               href: '/' },
    { key: 'shop',  label: 'Shop',  icon: BuildingStorefrontIcon, href: '/shop' },
    { key: 'search',label: 'Search',icon: MagnifyingGlassIcon,    href: '/search' },
    { key: 'help',  label: 'Help',  icon: QuestionMarkCircleIcon, action: () => setIsOpen('help') },
    { key: 'cart',  label: 'Cart',  icon: ShoppingCartIcon,       href: '/cart' }
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 flex justify-around items-center lg:hidden">
        {navItems.map(({ key, label, icon: Icon, href, action }) =>
          href ? (
            <Link
              key={key}
              href={href}
              onClick={() => setActive(key)}
              className={`flex flex-col items-center ${active === key ? 'text-green-500' : 'text-sky-500'}`}
            >
              <Icon className="w-6 h-6" />
              {key === 'cart' && cartCount > 0 && (
                <span className="absolute -top-1 right-8 bg-red-500 text-white text-[10px] rounded-full px-1.5 leading-tight">
                  {cartCount}
                </span>
              )}
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ) : (
            <button
              key={key}
              onClick={() => {
                action();
                setActive(key);
              }}
              className={`flex flex-col items-center relative ${active === key ? 'text-green-500' : 'text-sky-500'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </button>
          )
        )}
      </nav>

      {/* Help drawer only */}
      {isOpen === 'help' && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(null)}>
          <div
            className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl max-h-[50vh] overflow-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <h2 className="font-semibold">Contact</h2>
              <button onClick={() => setIsOpen(null)} className="text-xl">&times;</button>
            </div>
            <HelpContent />
          </div>
        </div>
      )}
    </>
  );
}