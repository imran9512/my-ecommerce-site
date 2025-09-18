// src/components/Footer.js
import { useState } from 'react';
import Link from 'next/link';
import {
    HomeIcon,
    MagnifyingGlassIcon,
    BuildingStorefrontIcon,
    Bars3Icon,
    ShoppingCartIcon,
} from '@heroicons/react/24/solid';
import Menu from '@/components/Menu';
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
            {/* Bottom nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md border-t border-gray-200 z-30 grid grid-cols-5 items-center lg:hidden">
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
                            className={`flex flex-col items-center ${active === key ? 'text-green-500' : 'text-sky-500'}`}
                        >
                            <Icon className="w-6 h-6" />
                            {key === 'cart' && cartCount > 0 && (
                                <span className="absolute -top-1 right-8 bg-red-500 text-white text-[10px] rounded-full px-1.5">
                                    {cartCount}
                                </span>
                            )}
                            <span className="text-xs mt-1">{label}</span>
                        </Link>
                    ) : (
                        <button
                            key={key}
                            onClick={action}
                            className={`flex flex-col items-center ${active === key ? 'text-green-500' : 'text-sky-500'}`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs mt-1">{label}</span>
                        </button>
                    )
                )}
            </nav>

            {/* Glassy drawer */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 flex items-end
     justify-center sm:items-start sm:justify-end
     bg-white/20 backdrop-blur-xs"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="fixed bottom-0 right-0 w-full 
      max-w-xs sm:w-80 h-2/3 sm:h-full 
       backdrop-blur-xs rounded-t-2xl 
       sm:rounded-t-none sm:rounded-l-2xl 
       overflow-y-auto p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Menu categories={categories} helpLinks={quickLinks} onClose={() => setIsOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
}