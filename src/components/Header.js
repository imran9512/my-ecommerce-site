//src/components/Header.js
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Header({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const categories = [{ name: 'Fitness', sub: ['Treadmills'] }, { name: 'Health', sub: ['Medicine'] }];

  return (
    <>
      {/* sticky, shadow-less, WHITE background */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 px-3 md:px-6 h-16 flex items-center">
        <div className="w-full max-w-screen-xl mx-auto grid grid-cols-3 items-center">
          {/* 1. Left: Hamburger + Search (desktop) */}
          <div className="flex items-center space-x-3">
          {/* Hamburger / Close */}
         
<button
  onClick={() => setMenuOpen(!menuOpen)}
  aria-label="Toggle menu"
  className="text-gray-700"
>
  {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
</button>

          {/* Extra space between hamburger & search */}
          <div className="w-6 md:w-8"></div>

          {/* Search bar with large radius */}
          <input
            type="text"
            placeholder="Search..."
            className="hidden bg-gray-100 md:block w-48 lg:w-60 border border-gray-400 rounded-full px-4 py-1 text-sm"
          />
          </div>

          {/* 2. Center: Logo (dead-center) */}
          <div className="flex justify-center">
          {/* Logo */}
          
<Link href="/" className="mx-auto">
  <Image src="/logo.png" alt="Store Logo" width={110} height={44} className="object-contain" />
</Link>
          </div>

          {/* 3. Right: Links + Cart */}
          <div className="flex items-center justify-end space-x-3 text-sm text-gray-700">
          {/* Right links */}
          <div className="flex items-center space-x-4 text-gray-700 text-sm">
            <Link href="/contact" className="hidden md:block">Contact&nbsp;Us</Link>
            <span className="hidden md:block text-gray-400">|</span>
            <Link href="/faq" className="hidden md:block">FAQ</Link>
            
<Link href="/cart" className="flex items-center space-x-1">
  <ShoppingCartIcon className="w-5 h-5" />
  {cartCount > 0 && (
    <span className="text-xs bg-sky-600 text-white rounded-full px-1.5 py-0.5">
      {cartCount}
    </span>
  )}
</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Drawer under header */}
      {menuOpen && (
        <div className="fixed top-16 inset-x-0 h-[calc(100vh-4rem)] bg-black/40 z-40" onClick={() => setMenuOpen(false)}>
          <div className="fixed top-16 left-0 w-72 h-full bg-white shadow-xl p-4" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-2">
              {categories.map(cat => (
                <div key={cat.name}>
                  <Link href={`/category/${cat.name.toLowerCase()}`} className="block font-semibold text-gray-800">
                    {cat.name}
                  </Link>
                  {cat.sub?.map(sub => (
                    <Link key={sub} href={`/category/${cat.name.toLowerCase()}/${sub.toLowerCase()}`}
                          className="block pl-4 text-sm text-gray-600">
                      ‑ {sub}
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