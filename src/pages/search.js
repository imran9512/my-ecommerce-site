// src/pages/search.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { searchProducts } from '@/utils/searchProducts';
import { useRouter } from 'next/router';

export default function SearchPage() {
  const router = useRouter();
  const query = (router.query.q || '').toString();
  const results = searchProducts(query);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Search Products</h1>

      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Type name, slug, salt or category…"
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
      />

      {results.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {results.map(p => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="rounded-lg p-2 shadow-md transition-shadow"
            >
              <Image
                src={p.images[0]}
                alt={p.name}
                width={150}
                height={150}
                className="w-full h-[150px] object-cover rounded"
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
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    </div>
  );
}