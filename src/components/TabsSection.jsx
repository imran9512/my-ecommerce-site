// src/components/TabsSection.jsx
import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

export default function TabsSection({ product }) {
  const [active, setActive] = useState('desc');

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 === 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <div className="flex items-center space-x-2">
        {Array.from({ length: fullStars }).map((_, i) => (
          <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
        ))}
        {halfStars > 0 && (
          <StarIcon className="w-5 h-5 text-yellow-300" />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <StarIcon key={i + fullStars + halfStars} className="w-5 h-5 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-10">
      <div className="flex border-b">
        {['desc', 'reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 font-semibold ${
              active === tab
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            {tab === 'desc' ? 'Description' : 'Reviews'}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {active === 'desc' && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product.longDesc }}
          />
        )}

        {active === 'reviews' && (
          <div>
            <ul className="list-disc space-y-4">
              {product.reviews.map((review, index) => (
                <li key={index} className="flex flex-col items-start space-x-1 mb-4 border border border-gray-300 rounded p-4">
                  <div className="flex items-center space-x-2">
                      <span className="font-semibold mr-2">{review.name}</span> &emsp; <span className="italic text-green-500">(Verified Buyer)</span>&emsp; &emsp;
                      {renderStars(review.rating)}
                  </div>
                  <p className="mt-2">{review.date}</p>
                  <p className="mt-2">{review.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}