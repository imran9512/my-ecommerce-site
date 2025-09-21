// src/components/Menu.jsx
import { useState } from 'react';
import Link from 'next/link';
import { WHATSAPP_NUMBER } from '@/data/constants';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

export default function Menu({ categories, helpLinks, onClose }) {
    const [openCategory, setOpenCategory] = useState(null);
    /* ---- NEW: level-3 toggle per item ---- */
    const [openChild, setOpenChild] = useState({}); // { "mainIdx-subIdx": boolean }

    /* ---- tiny helpers ---- */
    const toggleChild = (key) =>
        setOpenChild((p) => ({ ...p, [key]: !p[key] }));
    const [openUseful, setOpenUseful] = useState(false);

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm z-40"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="fixed top-20 left-2 w-60 rounded-xl shadow-2xl bg-white/50 backdrop-blur-md p-4 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ==========  CATEGORIES  ========== */}
                <nav className="space-y-4">
                    {categories.map((cat, idx) => (
                        <div key={cat.name}>
                            {/* level-1 header */}
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => setOpenCategory(openCategory === idx ? null : idx)}
                            >
                                <Link
                                    href={`/category/${cat.name.toLowerCase()}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                    className="bg-white/40 px-3 py-1.5 rounded shadow hover:bg-slate-50 transition"
                                >
                                    {cat.name}
                                </Link>
                                {cat.sub && cat.sub.length > 0 && (
                                    <ChevronDownIcon
                                        className={`w-4 h-4 transition-transform ${openCategory === idx ? 'rotate-180' : ''
                                            }`}
                                    />
                                )}
                            </div>

                            {/* level-2 + level-3 */}
                            {openCategory === idx && cat.sub && (
                                <ul className="pl-4 mt-2 space-y-1">
                                    {cat.sub.map((item, subIdx) => {
                                        const childKey = `${idx}-${subIdx}`;
                                        const hasGrand = item.children && item.children.length > 0;
                                        return (
                                            <li key={item.title}>
                                                <div className="flex items-center justify-between">
                                                    {/* level-2 link */}
                                                    <Link
                                                        href={`/category/${item.title.toLowerCase()}`}
                                                        onClick={() => onClose()}
                                                        className="inline-block bg-white/70 px-3 py-1 rounded shadow text-xs hover:bg-slate-200 transition"
                                                    >
                                                        -&nbsp;{item.title}
                                                    </Link>

                                                    {/* ----  NEW : level-3 chevron + toggle  ---- */}
                                                    {hasGrand && (
                                                        <ChevronDownIcon
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleChild(childKey);
                                                            }}
                                                            className={`w-3 h-3 cursor-pointer transition-transform ${openChild[childKey] ? 'rotate-180' : ''
                                                                }`}
                                                        />
                                                    )}
                                                </div>

                                                {/* ----  NEW : dropdown list (pl-4)  ---- */}
                                                {openChild[childKey] && (
                                                    <ul className="pl-4 mt-1 space-y-1">
                                                        {item.children.map((grand) => (
                                                            <li key={grand}>
                                                                <Link
                                                                    href={`/category/${grand.toLowerCase()}`}
                                                                    onClick={() => onClose()}
                                                                    className="inline-block bg-yellow-100/80 px-2 py-0.5 rounded text-xs hover:bg-yellow-200 transition"
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

                {/* ==========  USEFUL LINKS  (click to open)  ========== */}
                <div className="mt-6 pt-4 border-t border-slate-300">
                    <div
                        className="flex items-center justify-between font-semibold cursor-pointer"
                        onClick={() => setOpenUseful((p) => !p)}
                    >
                        <span>Useful Links</span>
                        <ChevronDownIcon
                            className={`w-4 h-4 transition-transform ${openUseful ? 'rotate-180' : ''
                                }`}
                        />
                    </div>

                    {openUseful && (
                        <ul className="pl-4 space-y-1 mt-2">
                            {helpLinks.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        onClick={() => onClose()}
                                        className="block text-sm text-sky-600 hover:text-black"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ==========  WHATSAPP  ========== */}
                <button
                    onClick={() => {
                        onClose();
                        window.open(
                            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                                'Hi! I need help with products or my order.'
                            )}`,
                            '_blank'
                        );
                    }}
                    className="w-full mt-4 h-8 flex items-center justify-center bg-green-500 text-white rounded-full text-xs font-semibold hover:bg-green-600 transition"
                >
                    <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 mr-1.5" />
                    WhatsApp Us
                </button>
            </div>
        </div>
    );
}