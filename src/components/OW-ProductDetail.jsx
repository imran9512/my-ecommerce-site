// src/components/ProductDetail.jsx
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { PhoneIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import QuantityPrice from './QuantityPrice';
import { SITE_NAME, WHATSAPP_NUMBER } from '@/data/constants';
import { useCartStore } from '@/stores/cart';
import { useSwipeable } from 'react-swipeable';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function ProductDetail({ product }) {
  const [qty, setQty] = useState(1);               // reset per product
  const [currentImg, setCurrentImg] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = () => {
    setAdding(true);
     useCartStore.getState().addItem(product, qty);
     setTimeout(() => setAdding(false), 1200); // animation duration
   };

  /* ---------- reset qty when product changes ---------- */
  useEffect(() => {
    setQty(1);
    setCurrentImg(0);
  }, [product.id]);

  /* ---------- swipe handlers ---------- */
  const nextImg = useCallback(() => {
    setCurrentImg((prev) => (prev + 1) % product.images.length);
  }, [product.images.length]);

  const prevImg = useCallback(() => {
    setCurrentImg(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  }, [product.images.length]);

  /* ---------- touch events ---------- */
  const onTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextImg() : prevImg();
    setTouchStart(null);
  };
      

  /* ---------- SEO Schema ---------- */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.metaTitle,
    sku: product.sku,
    image: product.images,
    description: product.metaDescription,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      price: product.qtyDiscount?.[qty] ?? product.price,
      priceCurrency: 'PKR',
      availability:
        product.stock === 0
          ? 'https://schema.org/OutOfStock'
          : product.stock < 5
          ? 'https://schema.org/LimitedAvailability'
          : 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount ?? 0,
    },
  };

  /* ---------- WhatsApp ---------- */
  const openWhatsApp = () => {
    const msg = `Hi, I want more information about ${product.name}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
  };

  /* ---------- Stock pill ---------- */
  const stockText =
    product.stock === 0 ? 'Out of Stock' : product.stock < 5 ? 'Low Stock' : 'In Stock';
  const stockColor =
    product.stock === 0 ? 'bg-red-500' : product.stock < 5 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="grid md:grid-cols-2 gap-8">
        {/* ---------- Image Slider ---------- */}
        <div
         className="relative cursor-pointer select-none w-full max-w-full overflow-hidden"
         onTouchStart={onTouchStart}
         onTouchEnd={onTouchEnd}
         onClick={(e) => {
         const rect = e.currentTarget.getBoundingClientRect();
         e.clientX - rect.left > rect.width / 2 ? nextImg() : prevImg();
        }}
        >
        <Image
         src={product.images[currentImg]}
         alt={product.name}
         layout="responsive"
         width={600}
         height={400}
         className="rounded-lg object-cover w-full"
         />

       {/* subtle left / right chevrons */}
        <button
         onClick={(e) => { e.stopPropagation(); prevImg(); }}
    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/30 text-white rounded-full p-1.5 text-xs transition"
         >
          &larr;
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextImg(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/30 text-white rounded-full p-1.5 text-xs transition"
         >
          &rarr;
        </button>
          {/* Thumbnails */}
          <div className="flex justify-center mt-2 space-x-1.5">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImg(idx)}
                className={`w-18 h-18 rounded border border-gray-300 hover:border-blue-500 ${
                  idx === currentImg ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <Image
                  src={img}
                  alt={`thumb-${idx}`}
                  width={72}
                  height={56}
                  className="object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Details ---------- */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <span
            className={`inline-block px-3 py-1 text-white text-xs rounded-full ${stockColor}`}
          >
            {stockText}
          </span>

          {product.stock === 0 && (
            <span className="mt-1 text-red-600 bg-yellow-200 px-2 py-1 text-xs font-semibold rounded">
              Contact Us to Get Notified when Restocked
            </span>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <span className="mt-1 text-blue-600 bg-yellow-100 px-2 py-1 text-xs font-semibold rounded">
              Grab this item before stock ends again
            </span>
          )}

          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.182c.969 0 1.371 1.24.588 1.81l-3.386 2.46a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.176 0l-3.386 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.182a1 1 0 00.95-.69L9.049 2.927z" />
              </svg>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({product.reviewCount ?? 0} reviews)
            </span>
          </div>

          <div className="mt-1">
            <p className="text-xs">Pack: <span className="underline font-semibold italic">{product.tabsMg}</span> &nbsp; Origin: <span className="underline font-semibold italic">{product.origin}</span>&nbsp; Type: <span className="underline font-semibold italic">{product.quality}</span></p>
          </div>

          <QuantityPrice product={product} qty={qty} setQty={setQty} />

          <div className="mt-4 flex items-center space-x-3">
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
              <PhoneIcon className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>
          </div>

          {product.specialNote && (
            <p className="mt-4 bg-pink-100 p-2 rounded">
              {product.specialNote}
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