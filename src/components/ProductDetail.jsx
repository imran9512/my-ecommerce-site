// src/components/ProductDetail.jsx
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/solid';
import { useSwipeable } from 'react-swipeable';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import QuantityPrice from './QuantityPrice';
import { WHATSAPP_NUMBER } from '@/data/constants';
import { useCartStore } from '@/stores/cart';
import Link from 'next/link'

export default function ProductDetail({ product }) {
  const [current, setCurrent] = useState(0);
  const [qty, setQty] = useState(1);
  const [currentImg, setCurrentImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
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

  /* --- Swipe & arrows --- */
  const nextImg = useCallback(() => {
    setCurrentImg((c) => (c + 1) % images.length);
  }, [images.length]);

  const prevImg = useCallback(() => {
    setCurrentImg((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft : nextImg,
    onSwipedRight: prevImg,
    trackMouse   : true,
  });

  /* --- WhatsApp --- */
  const openWhatsApp = () => {
    const msg = `Hi, I want more information about ${product.name}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  /* --- Stock pill --- */
  const stockText =
    product.stock === 0 ? 'Out of Stock' : product.stock < 5 ? 'Low Stock' : 'In Stock';
  const stockColor =
    product.stock === 0 ? 'bg-red-500' : product.stock < 5 ? 'bg-yellow-500' : 'bg-green-500';

  /* --- SEO Schema (unchanged) --- */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.metaTitle,
    sku: product.sku,
    image: images,
    description: product.metaDescription,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      price: product.price - product.offerPrice,
      priceCurrency: 'PKR',
      availability:
        product.stock === 0
          ? 'https://schema.org/OutOfStock'
          : product.stock < 5
          ? 'https://schema.org/LimitedAvailability'
          : 'https://schema.org/InStock',
      priceValidUntil: '2035-12-31',
    },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount ?? 0,
    },
      shippingDetails: {
        "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: 150,
        currency: "PKR"
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "PK"
      }
    },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail"
     }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="grid md:grid-cols-2 gap-8 p-4 max-w-4xl mx-auto">
        {/* ----------- IMAGE GALLERY ----------- */}
        <div {...swipeHandlers} className="relative">
          <Image
            src={`${images[currentImg]}?v=2`}
            alt={product.name}
            width={600}
            height={400}
            className="rounded w-full h-auto object-cover"
            onClick={() => setLightboxOpen(true)}
            priority
          />

          {/* Heroicons arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImg(); }}
                className="absolute left-2 top-2/3 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImg(); }}
                className="absolute right-2 top-2/3 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-800" />
              </button>
            </>
          )}

          {/* Thumbnails */}
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImg(idx)}
                className={`w-18 h-18 shrink-0 border-2 rounded overflow-hidden
                  ${idx === currentImg ? 'border-blue-500' : 'border-transparent'}`}
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
          {/* Lightbox */}
      <Lightbox
  open={lightboxOpen}
  close={() => setLightboxOpen(false)}
  slides={images.map((img) => ({ src: `${img}?v=2` }))}
  index={current}
  plugins={[Zoom]}                     // ← enable zoom plugin
  zoom={{ maxZoomPixelRatio: 3 }}      // zoom settings
  carousel={{ finite: true }}          // slider off
  render={{ buttonPrev: () => null, buttonNext: () => null }}
/>
          
        </div>
        
                {/* ---------- Details ---------- */}
               <div>
                {product.brand && (
                 <h2 className="rounded">
                   By:{' '}
                   <Link
                    href={`/search?q=${encodeURIComponent(product.brand)}`}
                    className="shadow-lg font-semibold hover:underline"
                    >
                    {product.brand}
                   </Link>
                 </h2>
                 )}
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
        
                  {(product.tabsMg || product.origin || product.quality) && (
                    <div className="mt-1 text-xs">
                      {product.tabsMg && <>Pack: <span className="underline shadow-lg font-semibold italic">{product.tabsMg}</span> &nbsp;</>}
                      {product.origin && <>Origin: <span className="underline shadow-lg font-semibold italic">{product.origin}</span> &nbsp;</>}
                      {product.quality && <>Type: <span className="underline shadow-lg font-semibold italic">{product.quality}</span></>}
                    </div>
                  )}
                  {product.ActiveSalt && (
                    <h2 className="mt-2 rounded">
                    Formula: <span className="bg-yellow-100 shadow-lg font-semibold">{product.ActiveSalt}</span>
                    </h2>
                  )}

        
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
                      <img src="/whatsapp.png" alt="WhatsApp" className="w-6 h-6 mr-1.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
        
                  {product.specialNote && (
                    <p className="inline-block mt-4 bg-pink-100 p-2 rounded italic shadow-lg font-semibold text-red-800">
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