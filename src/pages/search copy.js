// src/pages/search.js
import Head from 'next/head';
import { canonical } from '@/utils/seo';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductCard from '@/components/ProductCard';
import { searchProducts } from '@/utils/searchProducts';

export default function SearchPage() {
  const router = useRouter();
  const urlQuery = (router.query.q || '').toString();

  const [query, setQuery] = useState(urlQuery);

  const results = searchProducts(query);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  return (
    <>
      <Head>
        <title>Search | Aap Ki Sehat</title>
        <link rel="canonical" href={canonical('/search')} />
      </Head>
      <div className="max-w-3xl mt-10 mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Search Products</h1>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            router.replace(`/search?q=${encodeURIComponent(val)}`, undefined, { shallow: true });
          }}
          placeholder="Type Name, Salt, Brand or Category…"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          autoFocus
        />

        {results.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          //) : hasTyped ? (
        ) : query ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <p className="text-center text-gray-500">Type something to search…</p>
        )}
      </div>
    </>
  );
}