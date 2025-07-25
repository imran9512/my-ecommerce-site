// src/components/ProductDetail.jsx
import Image from 'next/image';
import { useState } from 'react';
import { PhoneIcon } from '@heroicons/react/24/solid';
import QuantityPrice from './QuantityPrice';
import { SITE_NAME, WHATSAPP_NUMBER } from '@/data/constants';

export default function ProductDetail({ product }) {
  const [qty, setQty] = useState(1);
  const [currentImg, setCurrentImg] = useState(0);

  /* ---------- SEO Schema (JSON-LD) ---------- */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    image: product.images,
    description: product.shortDesc,
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
      reviewCount: 0,
    },
  };

  /* ---------- Stock Pill ---------- */
  const stockText =
    product.stock === 0 ? 'Out of Stock'
    : product.stock < 5 ? 'Low Stock'
    : 'In Stock';
  const stockColor =
    product.stock === 0 ? 'bg-red-500'
    : product.stock < 5 ? 'bg-yellow-500'
    : 'bg-green-500';

  /* ---------- WhatsApp Message ---------- */
  const openWhatsApp = () => {
    const msg = `Hi, I want more information about ${product.name}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Inject schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="grid md:grid-cols-2 gap-8">
        {/* ---------- Image Slider ---------- */}
        <div>
          <Image
            src={product.images[currentImg]}
            alt={product.name}
            width={600}
            height={400}
            className="rounded-lg object-cover"
          />
          {/* Thin bordered thumbnails */}
          <div className="flex mt-2 space-x-1.5">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImg(idx)}
                className={`w-18 h-18 rounded border border-gray-300 hover:border-blue-500
                  ${idx === currentImg ? 'ring-2 ring-blue-500' : ''}`}
              style={{ aspectRatio: '1.5 / 1.5' }}
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

        {/* ---------- Product Details ---------- */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <span
            className={`inline-block px-3 py-1 text-white text-xs rounded-full ${stockColor}`}
          >
            {stockText}
          </span>

          {/* Stars */}
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.182c.969 0 1.371 1.24.588 1.81l-3.386 2.46a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.176 0l-3.386 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.182a1 1 0 00.95-.69L9.049 2.927z" />
              </svg>
            ))}
          </div>

          {/* Price & Qty */}
          <QuantityPrice product={product} qty={qty} setQty={setQty} />

          {/* Buttons Row */}
          <div className="mt-4 flex items-center space-x-3">
            <button
              disabled={product.stock === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
              onClick={() => alert('Added to cart!')}
            >
              Add to Cart
            </button>

            <button
              onClick={openWhatsApp}
              className="flex items-center space-x-1.5 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <PhoneIcon className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Special Note */}
          {product.specialNote && (
            <p className="mt-4 italic font-bold text-blue-800 bg-blue-100 p-2 rounded">
              {product.specialNote}
            </p>
          )}

          {/* Short Description */}
          {product.shortDesc && (
            <p className="mt-4 text-gray-700">{product.shortDesc}</p>
          )}
        </div>
      </div>
    </>
  );
}