// src/components/TabsSection.jsx
import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { reviews } from '@/data/reviews';           
import products from '@/data/products';            

export default function TabsSection({ product }) {
  const [active, setActive] = useState('desc');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // reviews jo is product k hain
  const productReviews = reviews.filter(r => r.productId === product.id);

  // 3 preview
  const preview = productReviews.slice(0, 3);

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));

  const getProductName = (pid) => products.find(p => p.id === pid)?.name || '';

  return (
    <div className="mt-10">
      {/* Tab buttons */}
      <div className="flex border-b">
        {['desc', 'reviews', 'meta'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 font-semibold ${
              active === tab
                ? 'border-b-2 border-blue-500 text-blue-600'
                : tab === 'meta'
                ? 'text-gray-200 hover:text-gray-500'
                : 'text-gray-600'
            }`}
          >
            {tab === 'desc' ? 'Description' : tab === 'reviews' ? 'Reviews' : 'Meta Info'}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {/* DESCRIPTION */}
        {active === 'desc' && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product.longDesc || 'No details' }}
          />
        )}

        {/* REVIEWS */}
            {active === 'reviews' && (
  <>
    {/* swipeable container */}
    <div className="flex overflow-x-auto space-x-4 pb-2">
      {reviews.map((r) => {
        const productName = products.find((p) => p.id === r.productId)?.name || 'Unknown';
        return (
          <div
            key={r.id}
            className="min-w-[300px] w-full md:w-1/3 lg:w-1/3 shrink-0 border border-gray-200 rounded-xl p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p><span className="font-semibold text-sm">{r.name}</span> - 
                 <span className="text-xs text-gray-500"> {r.date}</span></p>
                <p className="text-xs">
                  Purchased: <span className="text-xs text-blue-600 mt-0.5">{productName}</span>
                </p>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-800 mt-2">{r.comment}</p>
          </div>
        );
      })}
    </div>

    {/* button */}
    <button
      onClick={() => window.open('/reviews', '_blank')}
      className="mx-auto mt-2 px-4 py-2 shadow-md text-sm rounded"
    >
      View All Reviews
    </button>
  </>
)}


        {/* META */}
        {active === 'meta' && (
          <div className="text-sm text-gray-400 space-y-2 p-4 bg-gray-50 rounded">
            <p><strong>Title:</strong> {product.metaTitle}</p>
            <p><strong>Description:</strong> {product.metaDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}