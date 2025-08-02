// src/pages/shop.js
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import products from '@/data/products';   // default export

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Shop All</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}