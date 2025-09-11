// src/components/ProductDetail.jsx
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import QuantityPrice from './QuantityPrice';
import { WHATSAPP_NUMBER } from '@/data/constants';
import { useCartStore } from '@/stores/cart';
import Link from 'next/link'

export default function ProductDetail({ product }) {
  const [qty, setQty] = useState(1);
  const [currentImg, setCurrentImg] = useState(0);
  const [adding, setAdding] = useState(false);
  const images = Array.isArray(product?.images) && product.images.length
    ? product.images
    : ['/placeholder.jpg'];
  if (!images.length) return <p className="p-4 text-center">Product images missing</p>;

  /* --- Cart --- */
  const handleAddToCart = () => {
    setAdding(true);
    useCartStore.getState().addItem(product, qty);
    setTimeout(() => setAdding(false), 1200);
  };

  /* --- Reset on product change --- */
  useEffect(() => {
    setQty(1);
    setCurrentImg(0);
  }, [product.id]);

  /* --- WhatsApp --- */
  const openWhatsApp = () => {
    const msg = `Hi, I want more information about ${product.name}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  /* --- Stock pill --- */
  const stockText =
    product.stock === 0 ? '😞 Out of Stock' : product.stock < 5 ? '😲 Low Stock' : '😃 In Stock';
  const stockColor =
    product.stock === 0 ? 'bg-red-500' : product.stock < 5 ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <>
      <div className="grid mt-8 md:grid-cols-2 gap-4 md:gap-8 p-0 md:p-2 max-w-none md:max-w-6xl mx-auto">
        {/* ----------- IMAGE GALLERY ----------- */}
        <div className="relative w-full">
          {/* scrollable images */}
          <div
            id="gallery-scroll"
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth
               scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-500
               scrollbar-track-transparent"
          >
            {images.map((img, idx) => (
              <div key={idx} id={`slide-${idx}`} className="w-full shrink-0 snap-center">
                <Image
                  src={`${img}?v=2`}
                  alt={
                    product.images[idx]?.split('/')?.pop()?.replace(/\.(jpg|jpeg|png|webp)$/i, '') ||
                    product.name
                  }
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover cursor-pointer"
                  //onClick={() => window.open(`${img}?v=2`, '_blank')}
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>

          {/* thumbnails */}
          <div className="flex justify-center gap-2 mt-3 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentImg(idx);
                  document.getElementById(`slide-${idx}`).scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start',
                  });
                }}
                className={`w-16 h-16 shrink-0 border-2 rounded-2xl overflow-hidden transition
          ${idx === currentImg ? 'border-blue-200' : 'border-transparent'}`}
              >
                <Image
                  src={`${img}?v=2`}
                  alt={`thumb-${idx}`}
                  width={72}
                  height={72}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Details ---------- */}
        <div className="w-full">
          {product.brand && (
            <h3 className="flex items-center w-full">
              By:{' '}
              <Link
                href={`/search?q=${encodeURIComponent(product.brand)}`}
                className="shadow-lg font-semibold underline underline-offset-2 decoration-2 decoration-red-300"
              >
                {product.brand}
              </Link>
              <span
                className={`ml-auto h-6 px-2 py-1 text-white text-xs rounded-full ${stockColor}`}
              >
                {stockText}
              </span>
            </h3>


          )}

          <h1 className="text-3xl mt-4 font-bold">{product.name}</h1>

          <div className="flex mt-2 items-center">
            {/* ActiveSalt */}
            <span>
              {product.ActiveSalt && (
                <h2 className="text-xs mr-2 rounded flex items-center gap-1">
                  <BeakerIcon className="w-4 h-4" />
                  <span className="text-sm bg-yellow-100 shadow-lg font-semibold">
                    {product.ActiveSalt}
                  </span>
                </h2>
              )}
            </span>

            {/* reviews + stars */}
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

          {(product.tabsMg || product.origin || product.quality) && (
            <div className="mt-1 text-sm">
              {product.tabsMg && <>📦 <span className="underline shadow-lg text-xs italic">{product.tabsMg}</span> &nbsp;</>}
              {product.origin && <>🌍 <span className="underline shadow-lg text-xs italic">{product.origin}</span> &nbsp;</>}
              {product.quality && <>🔖 <span className="underline shadow-lg text-xs italic">{product.quality}</span></>}
            </div>
          )}

          <QuantityPrice product={product} qty={qty} setQty={setQty} />
          <h3 className="flex mt-2 items-center w-full">
            {product.stock === 0 && (
              <span className="relative inline-flex items-center text-red-600 bg-yellow-100 px-2 py-1 text-xs font-semibold rounded animate-pulse">
                Contact Us to Get Notified when Restocked
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
              </span>
            )}
            {product.stock < 5 && product.stock > 0 && (
              <span className="relative inline-flex items-center text-blue-700 bg-yellow-100 px-2 py-1 text-xs font-semibold rounded animate-pulse">
                Grab this item before stock ends again
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
              </span>
            )}
          </h3>


          <div className="mt-2 flex items-center space-x-3">
            <button
              disabled={product.stock === 0 || adding}
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
            <p className="mt-2  p-2 rounded">
              {product.shortDesc}
            </p>
          )}
        </div>
      </div>
    </>
  );
}