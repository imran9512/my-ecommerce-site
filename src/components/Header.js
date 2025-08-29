// src/components/Header.js
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Menu from '@/components/Menu';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useCartStore } from '@/stores/cart';
import products from '@/data/products';
import { categories, WHATSAPP_NUMBER } from '@/data/constants';

export default function Header() {
  const [cursor, setCursor] = useState(-1);
  const searchWrapperRef = useRef(null);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const cartCount = useCartStore((s) => s.items.reduce((a, b) => a + b.quantity, 0));

  
  /* live search logic */
  const [results, setResults] = useState([]);
  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return setResults([]);
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.ActiveSalt || '').toLowerCase().includes(q) ||
        p.categories.some((c) => c.toLowerCase().includes(q))
    );
    setResults(filtered);
  }, [searchTerm]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

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
      {/* ------------- FLOATING PILL ------------- */}
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl bg-white/20 backdrop-blur-md shadow-xl rounded-full px-3 md:px-5 h-14 flex items-center">
        <div className="w-full grid grid-cols-3 items-center">
          {/* Left: Hamburger */}
          <div className="flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="text-gray-700 relative hidden lg:block ml-3"
            >
              {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>

            {/* Desktop search (hidden on very small screens) */}
            <div className="relative hidden lg:block ml-3" ref={searchWrapperRef}>
              <input
                type="text"
                placeholder="Search…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  const visible = results.slice(0, 6);
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setCursor((c) => (c + 1) % visible.length);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setCursor((c) => (c - 1 + visible.length) % visible.length);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (cursor >= 0 && visible[cursor]) {
                      router.push(`/products/${visible[cursor].slug}`);
                      setSearchTerm('');
                      setCursor(-1);
                    } else {
                      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
                      setSearchTerm('');
                    }
                  }
                }}
                className="focus:outline-none bg-gray-100/70 w-40 xl:w-56 border border-gray-300 rounded-full px-4 shadow-inner py-1.5 text-sm"
              />

              {searchTerm && results.length > 0 && (
                <ul
                  ref={(ul) => {
                    if (ul && cursor >= 0) {
                      const li = ul.children[cursor];
                      li?.scrollIntoView({ block: 'nearest' });
                    }
                  }}
                  className="absolute top-full left-0 mt-2 w-full max-h-48 bg-white border rounded-xl shadow-lg overflow-y-auto z-30"
                >
                  {results.slice(0, 6).map((p, idx) => (
                    <li key={p.id}>
                      <Link
                        href={`/products/${p.slug}`}
                        onClick={() => {
                          setSearchTerm('');
                          setCursor(-1);
                        }}
                        className={`block px-3 py-2 text-sm ${
                          idx === cursor ? 'bg-blue-100' : 'hover:bg-gray-100'
                        }`}
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-center">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={90} height={36} className="w-auto h-auto object-contain lg:hidden" />
            </Link>
          </div>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={90} height={36} className="w-auto h-auto object-contain hidden lg:block ml-3" />
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center justify-end space-x-2 md:space-x-3 text-sm text-gray-700">
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/contact">Contact Us📞</Link>
              <span className="text-gray-400">|</span>
            </div>
            <Link href="/faq" className="hidden md:inline">FAQ❓</Link>
            <Link href="/cart" className="flex items-center">
              <ShoppingCartIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="text-xs bg-red-500 text-white rounded-full px-1.5 ml-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* -------------Menu DRAWER ------------- */}
      {menuOpen && (
  <div className="bg-black/10 relative hidden lg:block ml-3">
  
  <Menu
    categories={categories}
    helpLinks={helpLinks}
    onClose={() => setMenuOpen(false)}
  />
  </div>
)}
    </>
  );
}