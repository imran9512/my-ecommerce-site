// components/Header.js
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../public/logo.png';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, addItem, removeItem, total } = useCart();
  
  // dummy categories
  const categories = ['Electronics', 'Fashion', 'Groceries', 'Books', 'Toys'];

  return (
    <>
      {/* Top bar */}
      <header className="w-full bg-white shadow-md h-20 flex items-center justify-between px-6">
        {/* Left: Hamburger (desktop only) */}
        <button
          className="hidden md:block text-gray-700 hover:text-sky-600"
          onClick={() => setMenuOpen(true)}
        >
          <Bars3Icon className="w-7 h-7" />
        </button>

        {/* Logo */}
        <Link href="/">
          <Image src={logo} alt="Logo" width={120} height={48} className="object-contain" />
        </Link>

        {/* Right: Cart */}
        <Link href="/checkout" className="flex items-center gap-2 text-sky-600">
          <ShoppingCartIcon className="w-7 h-7" />
          <span className="text-sm font-semibold">Cart</span>
        </Link>
      </header>

      {/* Side menu (desktop only) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:block hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="mb-4 text-gray-700 hover:text-red-500"
              onClick={() => setMenuOpen(false)}
            >
              <XMarkIcon className="w-7 h-7" />
            </button>

            <h2 className="text-lg font-semibold mb-4">Categories</h2>

            <nav className="space-y-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className="block px-3 py-2 rounded hover:bg-sky-100"
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}