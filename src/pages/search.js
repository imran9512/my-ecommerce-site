// src/pages/search.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductCard from '@/components/ProductCard';
import { searchProducts } from '@/utils/searchProducts';

export default function SearchPage() {
  const router = useRouter();
  const urlQuery = (router.query.q || '').toString();

  // local input state
  const [query, setQuery] = useState(urlQuery);
  const [hasTyped, setHasTyped] = useState(false);

  // live filter
  const results = searchProducts(hasTyped ? query : '');

  // keep input & URL in sync
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Search Products</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          if (!hasTyped) setHasTyped(true);
          router.replace(`/search?q=${encodeURIComponent(val)}`, undefined, { shallow: true });
        }}
        placeholder="Type name, slug, salt or category…"
        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
        autoFocus
      />

      {hasTyped && results.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : hasTyped ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <p className="text-center text-gray-500">Type something to search…</p>
      )}
    </div>
  );
}