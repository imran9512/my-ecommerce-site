// src/components/TabsSection.jsx
import { useState } from 'react';

export default function TabsSection({ product }) {
  const [active, setActive] = useState('desc');

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
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}