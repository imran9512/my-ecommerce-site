// src/components/Header.js
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { useCartStore } from '@/stores/cart';
//import useTheme from '@/styles/darkmode'; // ← new path

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((a, b) => a + b.quantity, 0));
  //const { theme, toggleTheme } = useTheme();
  const categories = [
    { name: 'Fitness', sub: ['Treadmills'] },
    { name: 'Health', sub: ['Medicine'] },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 px-3 md:px-6 h-16 flex items-center">
        <div className="w-full max-w-screen-xl mx-auto grid grid-cols-3 items-center">
          {/* Left: Hamburger + Search */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="text-gray-700"
            >
              {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
            <input
              type="text"
              placeholder="Search..."
              className="hidden bg-gray-100 md:block w-48 lg:w-60 border border-gray-400 rounded-full px-4 py-1 text-sm"
            />
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center">
            <Link href="/" className="mx-auto">
              <Image src="/logo.png" alt="Logo" width={110} height={44} className="object-contain" />
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center justify-end space-x-3 text-sm text-gray-700">
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/contact">Contact Us</Link>
              <span className="text-gray-400">|</span>
            </div>
            <div className=" items-center space-x-4">
              <Link href="/faq">FAQ </Link>
            </div>

            {/* Cart – desktop only */}
            
            <Link href="/cart" className="hidden md:flex items-center space-x-1">
             <span className="text-gray-400">| </span>
              <ShoppingCartIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="text-xs bg-red-500 text-white rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>
            
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed top-16 inset-x-0 h-[calc(100vh-4rem)] bg-black/40 z-40" onClick={() => setMenuOpen(false)}>
          <div
            className="fixed top-16 left-0 w-72 h-full bg-white shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-2">
              {categories.map(cat => (
                <div key={cat.name}>
                  <Link
                    href={`/category/${cat.name.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className="block font-semibold text-gray-800"
                  >
                    {cat.name}
                  </Link>
                  {cat.sub?.map(sub => (
                    <Link
                      key={sub}
                      href={`/category/${cat.name.toLowerCase()}/${sub.toLowerCase()}`}
                      onClick={() => setMenuOpen(false)}
                      className="block pl-4 text-sm text-gray-600"
                    >
                      – {sub}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}