// src/pages/shop.js
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { canonical } from '@/utils/seo';
import ProductCard from '@/components/ProductCard';
import products from '@/data/products';         // ← 1.  import helper

export default function ShopPage() {
  const visibleProducts = products.filter(p => p.active);

  return (
    <>
      <Head>
        <title>Shop All | Aap Ki Sehat</title>
        <link rel="canonical" href={canonical('/shop')} />   {/* ← 2.  self-canonical */}
      </Head>

      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Shop All</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </>
  );
}