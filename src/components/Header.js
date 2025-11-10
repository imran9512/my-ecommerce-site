// src/components/Header.js
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
    Bars3Icon, XMarkIcon, WhatsAppIcon,
    ShoppingCartIconOutline, ChevronDownIcon,
} from '@/components/icons';
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
    const flatText = (v) =>
        (Array.isArray(v) ? v.join(' ') : String(v || '')).toLowerCase();

    useEffect(() => {
        const q = searchTerm.trim().toLowerCase();
        if (q.length < 2) return setResults([]);

        const filtered = products.filter((p) =>
            flatText(p.name).includes(q) ||
            flatText(p.slug).includes(q) ||
            flatText(p.brand).includes(q) ||
            flatText(p.ActiveSalt).includes(q) ||
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

    /* Help drawer links */
    const helpLinks = [
        { label: 'About Us', href: '/about' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms-and-conditions' },
        { label: 'Contact', href: '/contact' },
        { label: 'Return Policy', href: '/return-policy' },
    ];

    /* INLINE: Menu States & Logic (Desktop Variant - Thumb Tweaks Applied) */
    const [openCategory, setOpenCategory] = useState(null);
    const [openChild, setOpenChild] = useState({});
    const [openUseful, setOpenUseful] = useState(false);

    const toggleChild = (key) =>
        setOpenChild((p) => ({ ...p, [key]: !p[key] }));

    const openWhatsApp = () => {
        setMenuOpen(false);
        window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hi! I need help with products or my order.'
            )}`,
            '_blank'
        );
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            {/* ------------- FLOATING PILL - Thumb Tweaks: Bigger Padding, Scale Effects ------------- */}
            <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl bg-white/20 backdrop-blur-md shadow-xl rounded-full px-4 md:px-6 h-16 flex items-center" role="banner"> {/* FIXED: h-14 -> h-16 for bigger touch, px-3 -> px-4 */}
                <div className="w-full grid grid-cols-3 items-center">
                    {/* Left: Hamburger + Search (Desktop Only) */}
                    <div className="flex items-center justify-start space-x-3"> {/* FIXED: space-x-2 -> space-x-3 */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                            className="text-gray-700 relative hidden lg:block transition-transform active:scale-95" // NEW: Scale effect
                        >
                            {menuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />} {/* NEW: w-6 -> w-7 */}
                        </button>

                        {/* Search: lg+ only (mobile pe bottom icon se) */}
                        <div className="relative hidden lg:block" ref={searchWrapperRef}>
                            <input
                                type="text"
                                placeholder="Search…"
                                value={searchTerm}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSearchTerm(val);
                                    if (val.trim().length < 2) {
                                        setResults([]);
                                        setCursor(-1);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    const visible = results;
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
                                        } else if (searchTerm.trim().length >= 2) {
                                            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
                                            setSearchTerm('');
                                        }
                                    }
                                }}
                                className="focus:outline-none bg-gray-100/70 w-40 lg:w-56 border border-gray-300 rounded-full px-4 py-3 shadow-inner text-sm transition active:scale-95" // FIXED: py-1.5 -> py-3, w-32 -> w-40, scale
                            />

                            {searchTerm && results.length > 0 && (
                                <ul className="absolute top-full left-0 mt-2 w-full bg-white border rounded-xl shadow-lg z-30">
                                    {results.map((p, idx) => (
                                        <li key={p.id}>
                                            <Link
                                                href={`/products/${p.slug}`}
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setCursor(-1);
                                                }}
                                                className={`block px-4 py-3 text-sm transition active:scale-95 ${idx === cursor ? 'bg-blue-100' : 'hover:bg-gray-100'}`} // NEW: py-2 -> py-3, scale
                                            >
                                                {p.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Center: Logo - md+ */}
                    <div className="flex justify-center">
                        <Link href="/" className="transition active:scale-95" aria-label="Home">
                            <Image src="/logo.png" alt="Logo" width={90} height={36} className="w-auto h-auto object-contain hidden md:block" />
                        </Link>
                    </div>

                    {/* Right: Links & Cart */}
                    <div className="flex items-center justify-end space-x-3 text-sm text-gray-700">
                        <div className="hidden md:flex items-center space-x-2">
                            <Link href="/contact" className="px-4 py-3 transition active:scale-95">Contact Us📞</Link>
                            <span className="text-gray-400">|</span>
                        </div>
                        <Link href="/faq" className="hidden md:inline px-4 py-3 transition active:scale-95">FAQ❓</Link>
                        <Link href="/cart" aria-label="Cart" className="flex items-center relative transition-transform active:scale-95">
                            <ShoppingCartIconOutline className="w-8 h-8" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 right-0 bg-red-500 text-white text-[10px] rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Logo: Left, absolute for clean left align */}
                    <Link href="/" className="absolute left-4 md:hidden transition active:scale-95"> {/* NEW: Scale */}
                        <Image src="/logo.png" alt="Logo" width={90} height={36} className="w-auto h-auto object-contain" />
                    </Link>
                </div>
            </header>

            {/* ------------- INLINE DESKTOP MENU DRAWER (Thumb Tweaks) ------------- */}
            {menuOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm z-40"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeMenu();
                    }}
                >
                    <div
                        className="fixed top-20 left-2 w-60 rounded-xl shadow-2xl bg-white/50 backdrop-blur-md p-4 overflow-y-auto max-h-[80vh]"
                        onClick={(e) => e.stopPropagation()}
                        role="menu"
                        aria-label="Main menu"
                    >
                        {/* ========== CATEGORIES ========== */}
                        <nav className="space-y-4" role="navigation">
                            {categories.map((cat, idx) => (
                                <div key={cat.name}>
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => setOpenCategory(openCategory === idx ? null : idx)}
                                    >
                                        <Link
                                            href={`/category/${cat.name.toLowerCase()}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                closeMenu();
                                            }}
                                            className="bg-white/40 px-4 py-3 rounded shadow hover:bg-slate-50 transition active:scale-95" // FIXED: py-1.5 -> py-3, scale
                                        >
                                            {cat.name}
                                        </Link>
                                        {cat.sub && cat.sub.length > 0 && (
                                            <ChevronDownIcon
                                                className={`w-4 h-4 transition-transform ${openCategory === idx ? 'rotate-180' : ''}`}
                                            />
                                        )}
                                    </div>

                                    {openCategory === idx && cat.sub && (
                                        <ul className="pl-4 mt-2 space-y-1">
                                            {cat.sub.map((item, subIdx) => {
                                                const childKey = `${idx}-${subIdx}`;
                                                const hasGrand = item.children && item.children.length > 0;
                                                return (
                                                    <li key={item.title}>
                                                        <div className="flex items-center justify-between">
                                                            <Link
                                                                href={`/category/${item.title.toLowerCase()}`}
                                                                onClick={closeMenu}
                                                                className="inline-block bg-white/70 px-4 py-3 rounded shadow text-sm hover:bg-slate-200 transition active:scale-95" // FIXED: text-xs, py-1 -> py-3, scale
                                                            >
                                                                -&nbsp;{item.title}
                                                            </Link>
                                                            {hasGrand && (
                                                                <ChevronDownIcon
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleChild(childKey);
                                                                    }}
                                                                    className={`w-3 h-3 cursor-pointer transition-transform ${openChild[childKey] ? 'rotate-180' : ''}`}
                                                                />
                                                            )}
                                                        </div>

                                                        {openChild[childKey] && (
                                                            <ul className="pl-4 mt-1 space-y-1">
                                                                {item.children.map((grand) => (
                                                                    <li key={grand}>
                                                                        <Link
                                                                            href={`/category/${grand.toLowerCase()}`}
                                                                            onClick={closeMenu}
                                                                            className="inline-block bg-yellow-100/80 px-4 py-3 rounded text-sm hover:bg-yellow-200 transition active:scale-95" // FIXED: text-xs, py-0.5 -> py-3, scale
                                                                        >
                                                                            --&nbsp;{grand}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* ========== USEFUL LINKS ========== */}
                        <div className="mt-6 pt-4 border-t border-slate-300">
                            <div
                                className="flex items-center justify-between font-semibold cursor-pointer"
                                onClick={() => setOpenUseful((p) => !p)}
                            >
                                <span>Useful Links</span>
                                <ChevronDownIcon
                                    className={`w-4 h-4 transition-transform ${openUseful ? 'rotate-180' : ''}`}
                                />
                            </div>

                            {openUseful && (
                                <ul className="pl-4 space-y-1 mt-2">
                                    {helpLinks.map(({ label, href }) => (
                                        <li key={label}>
                                            <Link
                                                href={href}
                                                onClick={closeMenu}
                                                className="block px-4 py-3 text-sm text-sky-600 hover:text-black transition active:scale-95" // NEW: Padding + scale
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* ========== WHATSAPP ========== */}
                        <button
                            onClick={openWhatsApp}
                            className="w-full mt-4 h-10 flex items-center justify-center bg-green-500 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition active:scale-95" // FIXED: h-8 -> h-10, text-xs -> text-sm, scale
                        >
                            <WhatsAppIcon />&nbsp; WhatsApp Us
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}