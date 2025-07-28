// src/components/Footer.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  QuestionMarkCircleIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/solid';

/* ------------- helpers ------------- */
const readCart = () =>
  (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('cart') || '[]')) || [];

/* ------------- component ------------- */
export default function Footer() {
  const [isOpen, setIsOpen] = useState(null);
  const [active, setActive] = useState(null);
  const [cart, setCart] = useState([]);

  // hydrate cart once on mount + listen to storage events
  useEffect(() => {
    setCart(readCart());
    const handler = () => setCart(readCart());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const cartCount   = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal   = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  /* ------------- drawer contents ------------- */
  const sheets = {
    shop: {
      title: 'Categories',
      content: <p className="p-4">Categories here…</p>
    },
    help: {
      title: 'Contact',
      content: <p className="p-4">Email: contact@example.com</p>
    },
    search: {
      title: 'Search',
      content: <p className="p-4">Search bar here…</p>
    },
    cart: {
      title: 'Your Cart',
      content: (
        <>
          {cart.length === 0 ? (
            <p className="p-4 text-center text-gray-500">Your cart is empty</p>
          ) : (
            <>
              {/* list items */}
              <ul className="divide-y divide-gray-200 max-h-[35vh] overflow-y-auto">
                {cart.map(item => (
                  <li key={item.id} className="flex justify-between items-center px-4 py-3 text-sm">
                    <span>{item.quantity} &times; {item.name}</span>
                    <span className="font-semibold">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* totals + checkout */}
              <div className="border-t p-4 space-y-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(cartTotal / 100).toFixed(2)}</span>
                </div>
                <Link href="/checkout">
                  <a
                    onClick={() => setIsOpen(null)}
                    className="w-full block text-center bg-green-500 text-white py-2 rounded"
                  >
                    Checkout
                  </a>
                </Link>
              </div>
            </>
          )}
        </>
      )
    }
  };

  /* ------------- nav items ------------- */
  const navItems = [
    { key: 'home', label: 'Home', icon: HomeIcon, href: '/' },
    { key: 'shop', label: 'Shop', icon: BuildingStorefrontIcon, action: () => setIsOpen('shop') },
    { key: 'search', label: 'Search', icon: MagnifyingGlassIcon, action: () => setIsOpen('search') },
    { key: 'help', label: 'Help', icon: QuestionMarkCircleIcon, action: () => setIsOpen('help') },
    { key: 'cart', label: 'Cart', icon: ShoppingCartIcon, action: () => setIsOpen('cart') }
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
              className={`flex flex-col items-center ${active === key ? 'text-green-500' : 'text-sky-500'}`}
            >
              <Icon className="w-6 h-6" />
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
              {key === 'cart' && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 leading-tight">
                  {cartCount}
                </span>
              )}
              <span className="text-xs mt-1">{label}</span>
            </button>
          )
        )}
      </nav>

      {/* Slide-up drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(null)}>
          <div
            className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl max-h-[50vh] overflow-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
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