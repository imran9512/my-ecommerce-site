// src/components/ProductCard.jsx
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  if (!product.active) return null;

  const outOfStock = product.stock === 0;

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
        src={product.images[0]}
        alt={product.name}
        width={150}
        height={150}
        className={`w-auto h-auto object-cover rounded ${outOfStock ? 'filter grayscale brightness-75' : ''}`}
      />

      <h3 className="mt-2 text-sm font-semibold truncate">{product.name}</h3>
      <p className="text-xs">
        Formula: <span className="text-blue-600">{product.ActiveSalt}</span>
      </p>
      <p className="text-xs">
        Rs: {product.price} As Low As: <span className="text-blue-600 font-semibold">Rs {product.offerPrice}</span>
      </p>
    </Link>
  );
}