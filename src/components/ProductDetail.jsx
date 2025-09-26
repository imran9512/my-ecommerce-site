// src/components/ProductDetail.jsx
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import QuantityPrice from './QuantityPrice';
import ImageGallery from './ImageGallery';
import { WHATSAPP_NUMBER } from '@/data/constants';
import { useCartStore } from '@/stores/cart';
import Link from 'next/link';

export default function ProductDetail({ product }) {
    const [qty, setQty] = useState(1);
    const [currentImg, setCurrentImg] = useState(0);
    const [adding, setAdding] = useState(false);
    const [isStrip, setIsStrip] = useState(false);

    const images = Array.isArray(product?.images) && product.images.length
        ? product.images
        : ['/placeholder.png'];
    if (!images.length) return <p className="p-4 text-center">Product images missing</p>;

    /* --- stock & image basis --- */
    const stockCount = isStrip
        ? (product.stripQty ?? product.stock)
        : product.stock;
    const stockText =
        stockCount === 0 ? 'Out of Stock'
            : stockCount < 5 ? 'Low Stock'
                : 'In Stock';
    const stockColor =
        stockCount === 0 ? 'bg-red-500'
            : stockCount < 5 ? 'bg-yellow-500'
                : 'bg-green-500';

    /* --- Cart --- */
    const handleAddToCart = () => {
        setAdding(true);
        const cartItem = {
            ...product,
            id: isStrip ? `${product.id}-strip` : product.id,
            name: isStrip ? `Strip – ${product.name}` : product.name,
            price: isStrip ? product.stripPrice : product.price,
            image: isStrip ? product.stripImage : product.image,
        };
        useCartStore.getState().addItem(cartItem, qty);
        setTimeout(() => setAdding(false), 1200);
    };

    /* --- Reset on product change --- */
    useEffect(() => {
        setQty(1);
        setCurrentImg(0);
        setIsStrip(false);
    }, [product.id]);

    /* --- WhatsApp --- */
    const openWhatsApp = () => {
        const msg = `Hi, I want more information about ${product.name}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <>
            <div className="grid mt-8 md:grid-cols-2 gap-4 md:gap-8 p-0 md:p-2 max-w-none md:max-w-6xl mx-auto">
                {/* ----------- IMAGE GALLERY ----------- */}
                <div className="relative w-full">
                    <ImageGallery product={product} isStrip={isStrip} />
                </div>

                {/* ---------- Details ---------- */}
                <div className="w-full">
                    {product.brand && (
                        <div className="flex items-center justify-between w-full">
                            {/* ---- 1. brand (left) ---- */}
                            <div className="flex-1">
                                <span className="text-sm text-gray-600">By: </span>
                                <Link
                                    href={`/search?q=${encodeURIComponent(product.brand)}`}
                                    className="text-sm font-semibold underline underline-offset-2 decoration-2 decoration-red-300 cursor-pointer"
                                >
                                    {product.brand}
                                </Link>
                            </div>

                            {/* ---- 2. slide toggle (centre) ---- */}
                            {product.stripPrice && (
                                <div className="flex-1 flex justify-center">
                                    <button
                                        onClick={() => setIsStrip(v => !v)}
                                        className="relative overflow-hidden px-5 py-2.5 rounded-full border border-gray-300 bg-yellow-100 text-sm font-semibold text-gray-700 hover:bg-yellow-200 transition-colors duration-200 w-22 h-5"
                                    >
                                        {/* sliding text container */}
                                        <span
                                            className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out ${!isStrip ? 'translate-x-0' : '-translate-x-full'
                                                }`}
                                        >
                                            Buy Strip&nbsp;<span className='text-red-700 animate-pulse text-xl mb-1'>≫</span>
                                        </span>
                                        <span
                                            className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out ${!isStrip ? 'translate-x-full' : 'translate-x-0'
                                                }`}
                                        >
                                            <span className='text-green-700 animate-pulse text-xl mb-1'>≪</span>&nbsp;Buy Pack
                                        </span>

                                    </button>
                                </div>
                            )}

                            {/* ---- 3. stock pill (right) ---- */}
                            <div className="flex-1 flex justify-end">
                                <span className={`h-6 px-2 py-1 text-white text-xs rounded-full ${stockColor}`}>
                                    {stockText}
                                </span>
                            </div>
                        </div>
                    )}


                    <h1 className="text-3xl mt-4 font-bold">{product.name}</h1>

                    <div className="flex mt-2 items-center">
                        {/* ---- ActiveSalt (clickable search) ---- */}
                        <span>
                            {product.ActiveSalt && (
                                <h2 className="text-xs mr-2 rounded flex items-center gap-1">
                                    <BeakerIcon className="w-4 h-4" />
                                    <Link
                                        href={`/search?q=${encodeURIComponent(product.ActiveSalt)}`}
                                        className="text-sm bg-yellow-100 shadow-lg font-semibold underline underline-offset-1 cursor-pointer"
                                    >
                                        {product.ActiveSalt}
                                    </Link>
                                </h2>
                            )}
                        </span>

                        <div className="ml-auto flex items-center">
                            <span className="text-xs mr-2 text-gray-600">
                                ({product.reviewCount ?? 0} reviews)
                            </span>

                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.182c.969 0 1.371 1.24.588 1.81l-3.386 2.46a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.176 0l-3.386 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.182a1 1 0 00.95-.69L9.049 2.927z" />
                                </svg>
                            ))}
                        </div>
                    </div>

                    {((isStrip ? product.stripTabs : product.tabsMg) || product.origin || product.quality) && (
                        <div className="mt-1 text-sm">
                            {(isStrip ? product.stripTabs : product.tabsMg) && (
                                <>📦 <span className="underline shadow-lg text-xs italic">
                                    {isStrip
                                        ? `${product.stripTabs} Tabs/Strip`
                                        : product.tabsMg}
                                </span> &nbsp;</>
                            )}
                            {product.origin && <>🌍 <span className="underline shadow-lg text-xs italic">{product.origin}</span> &nbsp;</>}
                            {product.quality && <>🔖 <span className="underline shadow-lg text-xs italic">{product.quality}</span></>}
                        </div>
                    )}

                    <QuantityPrice
                        product={product}
                        qty={qty}
                        setQty={setQty}
                        unitPrice={isStrip ? product.stripPrice : product.price}
                    />

                    <h3 className="flex mt-2 items-center w-full">
                        {stockCount === 0 && (
                            <span className="relative inline-flex items-center text-red-600 bg-yellow-100 px-2 py-1 text-xs font-semibold rounded animate-pulse">
                                Contact Us to Get Notified when Restocked
                                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                            </span>
                        )}
                        {stockCount > 0 && stockCount < 5 && (
                            <span className="relative inline-flex items-center text-blue-700 bg-yellow-100 px-2 py-1 text-xs font-semibold rounded animate-pulse">
                                Grab this item before stock ends again
                                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                            </span>
                        )}
                    </h3>

                    <div className="mt-2 flex items-center space-x-3">
                        <button
                            disabled={stockCount === 0 || adding || !product.price}
                            onClick={handleAddToCart}
                            className={`relative px-6 py-2 rounded text-white transition-all duration-300 ease-in-out
                ${adding ? 'bg-green-500 scale-105' : 'bg-blue-600 hover:bg-blue-700'}
                disabled:opacity-60`}
                        >
                            {adding ? (
                                <span className="flex items-center space-x-1">
                                    <CheckIcon className="w-5 h-5 animate-ping" />
                                    Added
                                </span>
                            ) : (
                                'Add to Cart'
                            )}
                        </button>
                        <button
                            onClick={openWhatsApp}
                            className="flex items-center space-x-1.5 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            <img src="/whatsapp.png" alt="WhatsApp" className="w-6 h-6 mr-1.5" />
                            <span>WhatsApp</span>
                        </button>
                    </div>

                    {product.specialNote && (
                        <p className="flex inline-block justify-center text-[10px] mt-4 bg-pink-100 p-2 rounded italic shadow-lg font-semibold text-red-800">
                            ❝ {product.specialNote} ❞
                        </p>
                    )}
                    {product.shortDesc && (
                        <p className="mt-2 p-2 rounded">{product.shortDesc}</p>
                    )}
                </div>
            </div >
        </>
    );
}