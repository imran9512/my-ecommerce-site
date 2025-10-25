// src/components/Footer.js
import { useState } from 'react';
import Link from 'next/link';
import {
    HomeIcon,
    MagnifyingGlassIcon,
    BuildingStorefrontIcon,
    Bars3Icon,
    ShoppingCartIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/solid';
import { useCartStore } from '@/stores/cart';
import { WHATSAPP_NUMBER, categories } from '@/data/constants';

export default function Footer() {
    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState(null);
    const cartCount = useCartStore(s => s.items.reduce((a, b) => a + b.quantity, 0));

    const quickLinks = [
        { label: 'About Us', href: '/about' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms-and-conditions' },
        { label: 'Contact', href: '/contact' },
        { label: 'Return Policy', href: '/return-policy' },
    ];

    /* INLINE: Menu States & Logic from Menu.jsx (Mobile/Medium Variant) */
    const [openCategory, setOpenCategory] = useState(null);
    const [openChild, setOpenChild] = useState({});
    const [openUseful, setOpenUseful] = useState(false);

    const toggleChild = (key) =>
        setOpenChild((p) => ({ ...p, [key]: !p[key] }));

    const openWhatsApp = () => {
        setIsOpen(false);
        window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hi! I need help with products or my order.'
            )}`,
            '_blank'
        );
    };

    const closeMenu = () => setIsOpen(false);

    // NEW: Basic Swipe-Left to Close (Native Touch Events - No Lib Needed)
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        window.startX = touch.clientX;
    };

    const handleTouchMove = (e) => {
        if (!window.startX) return;
        const touch = e.touches[0];
        const deltaX = touch.clientX - window.startX;
        if (deltaX < -50) { // Swipe left >50px
            closeMenu();
            window.startX = null;
        }
    };

    const handleTouchEnd = () => {
        window.startX = null;
    };

    return (
        <>
            {/* Bottom nav - lg:hidden (mobile + medium) */}
            <nav
                role="navigation"
                aria-label="Main navigation"
                className="fixed -mb-0.5 bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md border-t border-gray-200 z-30 grid grid-cols-5 items-center lg:hidden"
            >
                {[
                    { key: 'home', label: 'Home', icon: HomeIcon, href: '/' },
                    { key: 'shop', label: 'Shop', icon: BuildingStorefrontIcon, href: '/shop' },
                    { key: 'search', label: 'Search', icon: MagnifyingGlassIcon, href: '/search' },
                    { key: 'help', label: 'Menu', icon: Bars3Icon, action: () => setIsOpen(true) },
                    { key: 'cart', label: 'Cart', icon: ShoppingCartIcon, href: '/cart' },
                ].map(({ key, label, icon: Icon, href, action }) =>
                    href ? (
                        <Link
                            key={key}
                            href={href}
                            onClick={() => setActive(key)}
                            className={`flex flex-col items-center transition-transform active:scale-95 ${active === key ? 'scale-105' : ''
                                }`}
                            aria-label={label}
                        >
                            <div className="relative">
                                <Icon
                                    className={`w-7 h-7 ${active === key ? 'text-green-500' : 'text-blue-400'
                                        }`}
                                />
                                {key === 'cart' && cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1 min-w-[18px] h-[18px] flex items-center justify-center animate-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`text-xs mt-1 font-semibold ${active === key ? 'text-green-500' : 'text-blue-700'
                                    }`}
                            >
                                {label}
                            </span>
                        </Link>
                    ) : (
                        <button
                            key={key}
                            onClick={action}
                            className={`flex mb-1 mt-0.5 flex-col items-center transition-transform active:scale-95 ${active === key ? 'scale-105' : ''
                                }`}
                            aria-label={label}
                        >
                            <Icon
                                className={`w-7 h-7 ${active === key ? 'text-green-500' : 'text-blue-400'
                                    }`}
                            />
                            <span
                                className={`text-xs mt-1 font-semibold ${active === key ? 'text-green-500' : 'text-blue-700'
                                    }`}
                            >
                                {label}
                            </span>
                        </button>
                    )
                )}
            </nav>

            {/* ------------- INLINE MOBILE/MEDIUM MENU DRAWER (Compact Bottom-Right) ------------- */}
            {isOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm z-40"
                    onClick={closeMenu}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="fixed bottom-20 right-2 w-60 rounded-t-xl shadow-2xl bg-white/50 backdrop-blur-md p-4 overflow-y-auto max-h-96"
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
                                            className="bg-white/40 px-4 py-3 rounded shadow hover:bg-slate-50 transition active:scale-95"
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
                                                                className="inline-block bg-white/70 px-4 py-3 rounded shadow text-xs hover:bg-slate-200 transition active:scale-95" // FIXED: px-3 py-1 -> px-4 py-3 + scale
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
                                                                            className="inline-block bg-yellow-100/80 px-4 py-3 rounded text-xs hover:bg-yellow-200 transition active:scale-95" // FIXED: px-2 py-0.5 -> px-4 py-3 + scale
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

                        {/* ========== USEFUL LINKS + DARK MODE TOGGLE ========== */}
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
                                    {quickLinks.map(({ label, href }) => (
                                        <li key={label}>
                                            <Link
                                                href={href}
                                                onClick={closeMenu}
                                                className="block px-4 py-3 text-sm text-sky-600 hover:text-black transition active:scale-95"
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
                            className="w-full mt-4 h-8 flex items-center justify-center bg-green-500 text-white rounded-full text-xs font-semibold hover:bg-green-600 transition active:scale-95" // NEW: Scale effect
                        >
                            <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 mr-1.5" />
                            WhatsApp Us
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}