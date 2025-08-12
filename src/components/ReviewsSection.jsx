// components/ReviewsSection.jsx
import { StarIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function ReviewsSection({ product }) {
  const [open, setOpen] = useState(false);
  const reviews = product?.reviews || [];

  // sirf 3 reviews preview
  const preview = reviews.slice(0, 3);

  return (
    <div className="py-4">
      {/* preview */}
      {preview.map((r, i) => (
        <div key={i} className="mb-4 p-3 border rounded">
          <p className="font-semibold">{r.name} – {r.date}</p>
          <div className="flex">
            {[...Array(5)].map((_, j) => (
              <StarIcon key={j} className={`w-4 h-4 ${j < r.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <p className="text-sm mt-1">{r.comment}</p>
        </div>
      ))}

      {reviews.length > 3 && (
        <button
          onClick={() => setOpen(true)}
          className="w-full text-center py-2 bg-gray-100 rounded"
        >
          ...
        </button>
      )}

      {/* full drawer */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">All Reviews</h3>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            {reviews.map((r, i) => (
              <div key={i} className="mb-4 border-b pb-2">
                <p className="font-semibold">{r.name} – {r.date}</p>
                <div className="flex">
                  {[...Array(5)].map((_, j) => (
                    <StarIcon key={j} className={`w-4 h-4 ${j < r.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-sm mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}