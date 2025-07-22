// components/Footer.js
import React, { useState } from 'react';
import { HomeIcon, ShoppingCartIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/logo.png'; // Ensure the path to your logo is correct

const sheets = {
  shop: { title: 'Categories', content: <p className="p-4">Categories here...</p> },
  help: { title: 'Contact', content: <p className="p-4">Email: contact@example.com</p> },
  cart: { title: 'Your Cart', content: <p className="p-4">Products here... + Checkout button</p> },
};

const Footer = () => {
  const [isOpen, setIsOpen] = useState(null);

  return (
    <>
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 flex justify-around items-center lg:hidden">
        <Link href="/" className="flex flex-col items-center text-gray-600 active:text-sky-600">
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <button
          onClick={() => setIsOpen('shop')}
          className="flex flex-col items-center text-gray-600 active:text-sky-600"
        >
          <ShoppingCartIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Shop</span>
        </button>

        <button
          onClick={() => setIsOpen('help')}
          className="flex flex-col items-center text-gray-600 active:text-sky-600"
        >
          <QuestionMarkCircleIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Help</span>
        </button>

        <button
          onClick={() => setIsOpen('cart')}
          className="flex flex-col items-center text-gray-600 active:text-sky-600"
        >
          <ShoppingCartIcon className="w-6 h-6" />
          <span className="text-xs mt-1">Cart</span>
        </button>
      </nav>

      {/* Slide-up sheet (half-page overlay) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setIsOpen(null)}>
          <div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[50vh] overflow-auto"
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
};

export default Footer;