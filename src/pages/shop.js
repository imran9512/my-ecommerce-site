// src/pages/shop.js
import Image from 'next/image';
import Link from 'next/link';
import products from '@/data/products';   // default export

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Shop All</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className=" rounded-lg p-2 shadow-md transition-shadow"
          >
            <Image
              src={p.images[0]}
              alt={p.name}
              width={300}
              height={300}
              className="w-full h-auto object-cover rounded"
            />
            <h3 className="text-center text-sm font-semibold mt-2 truncate">
              {p.name}
            </h3>
            <p className="text-center text-xs">
                  Formula: <span className="text-blue-600">{p.ActiveSalt}</span>
                </p>
            <p className="text-center text-xs text-blue-600">
              As Low As Rs: {p.offerPrice}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}