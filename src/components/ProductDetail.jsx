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
        stockCount === 0 ? 'border-red-400 border-3 font-semibold'
            : stockCount < 5 ? 'border-yellow-400 border-3 font-semibold'
                : 'border-green-400 border-3 font-semibold';

    /* --- Cart --- */
    const handleAddToCart = () => {
        setAdding(true);
        // light object → drop bloat
        const cartItem = {
            id: isStrip ? `${product.id}-strip` : product.id,
            slug: product.slug,
            name: isStrip ? `Strip – ${product.name}` : product.name,
            sku: product.sku,
            images: [product.images?.[0] || '/placeholder.png'],
            price: isStrip ? product.stripPrice : product.price,
            image: isStrip ? product.stripImage : product.images?.[0],
            qtyDiscount: product.qtyDiscount || [],
            stripPrice: product.stripPrice || '',
            quantity: qty,
            totalPrice: isStrip ? product.stripPrice : product.price,
            // ❌ drop: stock, rating, reviewCount, longDesc, meta, tags, fullDesc …
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
            {/* ----------- BREADCRUMB ----------- */}
            <div className="flex items-center justify-between mb-2">
                <nav className="text-xs text-gray-500 flex-1 pr-2" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-0.5">
                        <li>
                            <Link href="/" className="hover:text-blue-600 inline-block px-1">
                                Home
                            </Link>
                        </li>
                        <li className="flex items-center">
                            <span className="mx-0.5">/</span>
                            {product.categories && product.categories.length > 0 ? (
                                <Link
                                    href={`/category/${encodeURIComponent(product.categories[0].toLowerCase().replace(/\s+/g, '-'))}`}
                                    className="hover:text-blue-600 capitalize inline-block px-1"
                                >
                                    {product.categories[0]}
                                </Link>
                            ) : (
                                <span className="capitalize inline-block px-1">Uncategorized</span>
                            )}
                        </li>
                        <li className="flex items-center">
                            <span className="mx-0.5">/</span>
                            <span className="font-medium ml-1 text-gray-900 truncate max-w-[150px] md:max-w-xs" title={product.name}>
                                {product.name}
                            </span>
                        </li>
                    </ol>
                </nav>

                {/* Prescription Label */}
                <div className="flex-shrink-0 ml-2">
                    <div className="text-center">
                        <span className="text-[9px] text-red-600 font-medium block">Prescription<br />required</span>
                    </div>
                </div>
            </div>

            <div className="grid mt-2 md:grid-cols-2 gap-4 md:gap-8 p-0 md:p-2 max-w-none md:max-w-6xl mx-auto">
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

                                {(Array.isArray(product.brand) ? product.brand : [product.brand]).map((b, i) => (
                                    <span key={b}>
                                        <Link
                                            href={`/brand/${encodeURIComponent(
                                                b.trim().toLowerCase().replace(/\s+/g, '-')
                                            )}`}
                                            className="text-sm font-semibold underline underline-offset-2 decoration-2 decoration-red-300 cursor-pointer"
                                        >
                                            {b.trim()}
                                        </Link>
                                        {i < (Array.isArray(product.brand) ? product.brand : [product.brand]).length - 1 && ' '}
                                    </span>
                                ))}
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
                                            className={`absolute p-0.5 inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out ${!isStrip ? 'translate-x-0' : '-translate-x-full'
                                                }`}
                                        >
                                            &nbsp;Buy Strip&nbsp;<span className='text-red-700 animate-pulse text-lg'>⮞</span>
                                        </span>
                                        <span
                                            className={`absolute p-0.5 inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out ${!isStrip ? 'translate-x-full' : 'translate-x-0'
                                                }`}
                                        >
                                            <span className='text-green-700 animate-pulse text-lg'>⮜</span>&nbsp;Buy Pack&nbsp;
                                        </span>

                                    </button>
                                </div>
                            )}

                            {/* ---- 3. stock pill (right) ---- */}
                            <div className="flex-1 flex justify-end">
                                <span className={`h-6 px-2 py-0.5 text-xs rounded-full border-2 ${stockColor}`}>
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
                                    {(Array.isArray(product.ActiveSalt) ? product.ActiveSalt : [product.ActiveSalt]).map((s, i) => (
                                        <span key={s}>
                                            <Link
                                                href={`/active-pharmaceutical-ingredients/${encodeURIComponent(
                                                    s.trim().toLowerCase().replace(/\s+/g, '-')
                                                )}`}
                                                className="text-[10px] bg-yellow-100 shadow-lg font-semibold underline underline-offset-1 cursor-pointer"
                                            >
                                                {s.trim()}
                                            </Link>
                                            {i < (Array.isArray(product.ActiveSalt) ? product.ActiveSalt : [product.ActiveSalt]).length - 1 && ' '}
                                        </span>
                                    ))}
                                </h2>
                            )}
                        </span>

                        <div className="ml-auto flex items-center">
                            <span className="text-[10px] mr-2 text-gray-600">
                                {product.reviewCount ?? 0} reviews
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
                            className={`relative px-6 py-2 rounded text-white font-bold transition-all duration-300 ease-in-out
                                        ${adding ? 'bg-green-500 scale-105' : 'bg-blue-600 hover:bg-blue-700'}
                                        disabled:opacity-60
                                        transition-transform hover:scale-105`}
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
                            className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded
                                       transition-transform active:scale-105 hover:scale-105"
                            aria-label="WhatsApp"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 19 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-9 h-9"
                            >
                                <path
                                    d="M15.255 3.713a8 8 0 0 0-5.684-2.36c-4.433 0-8.043 3.603-8.043 8.036 0 1.394.364 2.771 1.045 3.974l-1.164 4.26 4.354-1.14a8.06 8.06 0 0 0 3.8.957c4.434 0 8.044-3.61 8.044-8.043 0-2.145-.84-4.172-2.352-5.692zM4.283 13.11c-.76-.863-1.18-2.312-1.18-3.72a6.467 6.467 0 0 1 6.46-6.46 6.42 6.42 0 0 1 4.568 1.891 6.42 6.42 0 0 1 1.892 4.568 6.467 6.467 0 0 1-6.46 6.46c-1.258 0-2.596-.404-3.562-1.06l-2.343.609z"
                                    fill="#fff"
                                />
                                <path
                                    d="M11.748 10.434c.182.064 1.148.539 1.346.641.198.103.333.15.38.23.048.08.048.475-.119.934s-.95.879-1.33.934c-.34.048-.768.072-1.242-.079a12 12 0 0 1-1.125-.412c-1.979-.854-3.27-2.842-3.364-2.976-.103-.143-.8-1.069-.8-2.035s.507-1.448.689-1.646a.72.72 0 0 1 .522-.246h.38c.12 0 .285-.047.444.34.166.396.562 1.362.61 1.465a.38.38 0 0 1 .015.349c-.063.134-.095.213-.198.324a8 8 0 0 1-.293.348c-.095.095-.198.206-.087.404.119.198.507.84 1.093 1.362.752.673 1.385.879 1.583.974s.309.079.428-.048c.118-.135.49-.578.625-.776s.261-.166.443-.095z"
                                    fill="#fff"
                                />
                            </svg>
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