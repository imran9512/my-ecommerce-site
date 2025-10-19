// src/pages/reviews.js
import { StarIcon } from '@heroicons/react/24/solid';
import { reviews } from '@/data/reviews';
import products from '@/data/products';
import Head from 'next/head';
import { canonical } from '@/utils/seo';

export default function ReviewsPage() {
  const getProductName = (pid) => products.find((p) => p.id === pid)?.name || 'Unknown';

  return (
    <>
      <Head>
        <title>Reviews | Aap Ki Sehat</title>
        <link rel="canonical" href={canonical('/reviews')} />   {/* ← 2.  self-canonical */}
      </Head>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl text-center font-bold mb-6">All Reviews</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => {
            const productName = getProductName(r.productId);
            return (
              <div key={r.id} className="border border-gray-200 rounded-xl p-4 shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p><span className="font-semibold text-sm">{r.name}</span> -
                      <span className="text-xs text-gray-500"> {r.date}</span></p>
                    <p className="text-xs">
                      Purchased: <span className="text-xs text-blue-600 mt-0.5">{productName}</span>
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-xs">{r.rating}&nbsp;</p>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-800 mt-2">{r.comment}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}