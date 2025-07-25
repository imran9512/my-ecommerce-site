// src/components/QuantityPrice.jsx  (error-proof, final)
import { useMemo } from 'react';

export default function QuantityPrice({ product, qty, setQty }) {
  // agar qtyDiscount na ho to fallback
  const prices = product.qtyDiscount || { 1: product.price };

  // pehle exact qty ka price, warna sab se bara qty ka price
  const price = prices[qty] || prices[Math.max(...Object.keys(prices).map(Number))];

  // total discount = (base price - discounted price) × quantity
  const totalSaved = (product.price - price) * qty;

  // sab se sasta price (max qty ka)
  const maxQty = Math.max(...Object.keys(prices).map(Number));
  const lowestPrice = prices[maxQty];

  return (
    <div className="mt-4">
      {/* Price + Discount Badge */}
      <div className="flex items-end space-x-2">
        <span className="text-2xl font-bold">Rs {price.toLocaleString()}</span>

        {/* Original price only if discounted */}
        {product.price !== price && (
          <>
            <span className="line-through text-gray-500">
              Rs {product.price.toLocaleString()}
            </span>

            {/* Total saved amount (quantity × per-unit discount) */}
            <span className="text-green-600 text-sm">
              You saved Rs {totalSaved.toLocaleString()} on {qty} unit(s)
            </span>
          </>
        )}
      </div>

      {/* Lowest possible price note */}
      <p className="text-sm text-gray-600 mt-1">
        As low as Rs {lowestPrice.toLocaleString()} on higher quantity
      </p>

      {/* Quantity selector */}
      <div className="flex items-center mt-2">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="px-2 py-1 border rounded"
        >
          −
        </button>
        <span className="px-4 font-medium">{qty}</span>
        <button
          onClick={() => setQty(qty + 1)}
          className="px-2 py-1 border rounded"
        >
          +
        </button>
      </div>
    </div>
  );
}