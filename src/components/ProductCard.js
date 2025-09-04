// src/components/ProductCard.jsx
import Image from 'next/image';
import Link from 'next/link';
import { BeakerIcon } from '@heroicons/react/24/outline';
import { getDiscountedPrice } from '@/utils/priceHelpers';

export default function ProductCard({ product }) {
  if (!product.active) return null;

  const outOfStock = product.stock === 0;
  const prices = Object.keys(product.qtyDiscount || {})
    .map(q => getDiscountedPrice(product.price, product.qtyDiscount, +q));
  const lowestPrice = prices.length ? Math.min(...prices, product.price) : product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="relative block border border-gray-200 rounded-lg p-3 bg-white hover:shadow-lg transition-shadow"
    >
      {outOfStock && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none z-10">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded text-center">
            Contact us to get notified when item restocked
          </span>
        </div>
      )}

      <Image
        src={`${product.images[0]}?v=2`}
        alt={product.name}
        width={200}
        height={200}
        priority
        className={`w-auto h-auto object-cover rounded ${outOfStock ? 'filter grayscale brightness-75' : ''}`}
      />
      {product.brand && (
        <h3 className="underline decoration-2 decoration-red-300 mt-2 text-[10px] -ml-1">{product.brand}'s</h3>
      )}
      <h3 className=" text-sm font-semibold truncate">{product.name}</h3>
      <span>
        {product.ActiveSalt && (
          <h4 className="text-xs mr-2 rounded flex items-center gap-1">
            <BeakerIcon className="w-4 h-4" />
            <span className="underline shadow decoration-blue-300">
              {product.ActiveSalt}
            </span>
          </h4>
        )}
      </span>
      <p className="text-xs">
        Rs: {product.price}</p>
      <p className="text-xs">As low as <span className="shadow text-blue-800 font-semibold">
        Rs {lowestPrice.toLocaleString()}</span>
      </p>
    </Link>
  );
}