// src/components/ProductCard.jsx
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="block border border-gray-200 rounded-lg p-3 bg-white hover:shadow-lg transition-shadow"
    >
      <Image
        src={product.images[0]}
        alt={product.name}
        width={150}
        height={150}
        className="w-full h-[150px] object-cover rounded"
      />
      <h3 className="mt-2 text-sm font-semibold truncate">{product.name}</h3>
      <p className="text-xs">
                  Formula: <span className="text-blue-600">{product.ActiveSalt}</span>
                </p>
      <p className="text-xs">
                  As Low As: <span className="text-blue-600">Rs {product.offerPrice}</span>
                </p>
    </Link>
  );
}