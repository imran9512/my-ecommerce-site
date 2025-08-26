// src/components/ProductCard.jsx
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  if (!product.active) return null;

  const outOfStock = product.stock === 0;
  const lowestPrice = Math.min(...Object.values(product.qtyDiscount || { 1: product.price }));

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
      <p className="text-xs">
        Formula: <span className="text-blue-600 shadow">{product.ActiveSalt}</span>
      </p>
      <p className="text-xs">
        Rs: {product.price}</p><p className="text-xs">As Low As: <span className="shadow text-blue-700 font-semibold">Rs {lowestPrice.toLocaleString()}</span>
      </p>
    </Link>
  );
}