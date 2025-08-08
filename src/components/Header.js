// src/components/Header.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useCartStore } from '@/stores/cart';
import products from '@/data/products';
import { WHATSAPP_NUMBER } from '@/data/constants';

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const cartCount = useCartStore((s) => s.items.reduce((a, b) => a + b.quantity, 0));

  const categories = [
    { name: 'Fitness', sub: ['Treadmills'] },
    { name: 'Health', sub: ['Medicine'] },
    { name: 'home-gym', sub: ['cat3', 'cat4'] },
  ];
  const [openCategory, setOpenCategory] = useState(null);

  /* live search logic */
  const [results, setResults] = useState([]);
  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return setResults([]);
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.ActiveSalt.toLowerCase().includes(q) ||
        p.categories.some((c) => c.toLowerCase().includes(q))
    );
    setResults(filtered);
  }, [searchTerm]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const navLinks = categories.reduce((acc, { name, sub }) => {
    acc.push({ label: name, href: `/category/${name.toLowerCase()}` });
    sub.forEach((s) => acc.push({ label: s, href: `/category/${s.toLowerCase()}` }));
    return acc;
  }, []);

  /* Help drawer links */
  const helpLinks = [
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
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 px-3 md:px-6 h-16 flex items-center">
        <div className="w-full max-w-screen-xl mx-auto grid grid-cols-3 items-center">
          {/* Left: Hamburger + Desktop Search */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="text-gray-700"
            >
              {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>

            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="focus:outline-none bg-gray-100 w-48 lg:w-60 border border-gray-300 rounded-full px-4 shadow-lg py-1 text-sm"
              />
              {searchTerm && results.length > 0 && (
                <ul className="absolute top-full left-0 mt-1 w-full max-h-48 bg-white border rounded shadow-lg overflow-y-auto z-30">
                  {results.slice(0, 6).map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/products/${p.slug}`}
                        onClick={() => {
                          setSearchTerm('');
                          setMenuOpen(false);
                        }}
                        className="block px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
              <Link href="/contact">Contact Us📞</Link>
              <span className="text-gray-400">|</span>
            </div>
            <Link href="/faq">FAQ❓</Link>
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

      {/* ------------- MOBILE DRAWER --------------- */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="fixed top-16 left-0 w-72 h-full bg-white shadow-xl p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-1">
              {categories.map(({ name, sub }, idx) => (
                <div key={name}>
                  <div
                    className="flex items-center justify-between font-semibold text-gray-800 py-1.5 cursor-pointer"
                    onClick={() => setOpenCategory(openCategory === idx ? null : idx)}
                  >
                    <Link
                      href={`/category/${name.toLowerCase()}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                      }}
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
                    <ul className="pl-4 space-y-0.5">
                      {sub.map((s) => (
                        <li key={s}>
                          <Link
                            href={`/category/${s.toLowerCase()}`}
                            onClick={() => setMenuOpen(false)}
                            className="block text-sm text-gray-600 hover:text-black"
                          >
                            – {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Help section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="px-2 mb-2 font-semibold text-gray-700">Help</p>
                {helpLinks.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-2 py-1 text-sm text-sky-600 hover:bg-sky-100 rounded"
                  >
                    {label}
                  </Link>
                ))}

                {/* WhatsApp */}
                <button
                  onClick={() => {
                    openWhatsApp();
                    setMenuOpen(false);
                  }}
                  className="w-full mt-2 bg-green-500 text-white py-2 rounded-md text-sm font-semibold hover:bg-green-600 transition"
                >
                  📲 WhatsApp Us
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}