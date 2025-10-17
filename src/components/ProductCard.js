// src/components/ProductCard.jsx
import Image from 'next/image';
import Link from 'next/link';
import { BeakerIcon } from '@heroicons/react/24/outline';
import { getDiscountedPrice } from '@/utils/priceHelpers';

export default function ProductCard({ product }) {
  if (!product.active) return null;

  const outOfStock = product.stock === 0;

  /* ---------- 1.  discount table exist ? ---------- */
  const hasDiscount = Array.isArray(product.qtyDiscount)
    ? product.qtyDiscount.length > 0
    : Object.keys(product.qtyDiscount || {}).length > 0;

  /* ---------- 2.  lowest discounted price ---------- */
  let lowestPrice = product.price;
  if (hasDiscount && product.price) {
    let maxDiscountPct;
    if (Array.isArray(product.qtyDiscount)) {
      maxDiscountPct = Math.max(
        ...product.qtyDiscount.map(seg => Math.max(seg.start, seg.end))
      );
    } else {
      maxDiscountPct = Math.max(...Object.values(product.qtyDiscount || {}));
    }
    lowestPrice = Math.round(product.price * (1 - maxDiscountPct / 100));
  }

  /*let lowestPrice = product.price;
  if (hasDiscount && product.price) {
    const tiers = Array.isArray(product.qtyDiscount)
      ? product.qtyDiscount.flatMap((seg) => {
        const step = (seg.end - seg.start) / (seg.to - seg.from);
        const arr = [];
        for (let q = seg.from; q <= seg.to; q++) {
          arr.push(seg.start + (q - seg.from) * step);
        }
        return arr;
      })
      : Object.values(product.qtyDiscount);

    const discountedPrices = tiers.map((p) =>
      Math.round(product.price - product.price * (p / 100))
    );
    lowestPrice = Math.min(...discountedPrices, product.price);
  }*/


  /* ---------- 3.  price row renderer ---------- */
  const PriceRow = () => {
    if (!product.price)
      return (
        <p className="motion-safe:animate-bounce text-sm text-center mx-auto mt-2 w-max px-3 py-1 rounded-full bg-yellow-300 font-semibold text-gray-800">
          Contact Us to buy
        </p>
      );

    return (
      <>
        <p className="text-xs">Rs: {product.price.toLocaleString()}</p>
        {hasDiscount && (
          <p className="text-xs">
            As low as{' '}
            <span className="shadow text-blue-800 font-semibold">
              Rs {lowestPrice.toLocaleString()}
            </span>
          </p>
        )}
      </>
    );
  };

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
        src={`${product.images[0]}`}
        alt={product.name}
        width={200}
        height={200}
        priority
        className={`w-auto h-auto object-cover rounded ${outOfStock ? 'filter grayscale brightness-75' : ''}`}
      />

      {/* brand + strip badge row */}
      <div className="flex items-center justify-between mt-1">
        {product.brand && (
          <h3 className="-ml-1 underline decoration-2 decoration-red-300 text-[10px]">
            {product.brand}&apos;s
          </h3>
        )}
        {product.stripStock && (
          <span className="bg-yellow-200 text-[10px] rounded">
            <span className='mr-0.5 ml-0.5'>✔ Strip</span>
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold truncate">{product.name}</h3>

      {product.ActiveSalt && (
        <h4 className="text-[10px] mr-2 rounded flex items-center gap-1">
          <BeakerIcon className="w-3 h-3" />
          <span className="underline decoration-blue-300">
            {product.ActiveSalt}
          </span>
        </h4>
      )}

      {/* price row */}
      <PriceRow />
    </Link>
  );
}