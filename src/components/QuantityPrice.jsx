// src/components/QuantityPrice.jsx
import { useState, useEffect, useRef } from 'react';

export default function QuantityPrice({ product, qty, setQty }) {
  /* ---------- 1. Build full price map ---------- */
  const raw = product.qtyDiscount || {};
  const tiers = Object.keys(raw).map(Number).sort((a, b) => a - b);

  // helper: price for Q ≥ 1
  const priceForQty = (q) => {
    // 1) exact tier
    if (raw[q]) return raw[q];
    // 2) last tier ≤ q
    const last = tiers.filter(t => t <= q).pop();
    return last ? raw[last] : product.price;
  };

  const lowestPrice = Math.min(...Object.values(product.qtyDiscount || { 1: product.price }));
  const unitPrice = priceForQty(qty);
  const totalPrice = unitPrice * qty;
  const saved = (product.price - unitPrice) * qty;

  /* ---------- 2. Dropdown data (only tiers that exist) ---------- */
  const entries = Object.entries(raw).sort(([a], [b]) => +a - +b);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  /* click-outside to close */
  useEffect(() => {
    const outside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  return (
    <div className="mt-2 space-y-3">
      {/* Price badge */}
      <div className="flex items-end space-x-2">
        <span className="text-2xl font-bold">
           {qty === 1
            ? `Rs ${product.price.toLocaleString()} – Rs ${lowestPrice.toLocaleString()}`
            : `Rs ${unitPrice.toLocaleString()}`}
        </span>
        {product.price !== unitPrice && (
          <>
            <span className="line-through text-gray-500">Rs {product.price.toLocaleString()}</span>
            <span className="text-green-600 text-sm">Saved Rs {saved}</span>
          </>
        )}
        
      </div>

      {/* Lowest price note */}
      <p style={{ display: qty === 1 ? 'none' : 'inline-block' }}
         className="inline-block shadow-lg font-semibold text-red-800">
        As low as Rs {lowestPrice.toLocaleString()}
      </p>
      
      {/* ---------- Quantity Control ---------- */}
<div className="mt-4 flex items-left space-x-3">
  {/* minus */}
  <button
    onClick={() => setQty(Math.max(1, qty - 1))}
    className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full shadow transition"
  >
    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  </button>

  {/* editable number */}
  <input
    type="number"
    value={qty}
    onChange={(e) => setQty(Math.max(1, +e.target.value))}
    className="w-16 h-10 text-center text-xl font-semibold border border-gray-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
    min="1"
  />

  {/* plus */}
  <button
    onClick={() => setQty(qty + 1)}
    className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full shadow transition"
  >
    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  </button>

  <span className="ml-4 mt-2 text-xl font-bold text-gray-800">Total: {totalPrice.toLocaleString()}</span>
</div>

      {/* Dropdown for existing discount tiers only */}
      {entries.length > 1 && (
        <div className="relative w-90 max-w-md"ref={wrapperRef}>
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Get Discount on Quantity
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>

          {open && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="grid grid-cols-4 gap-2 px-3 py-1 bg-gray-100 text-xs font-semibold">
                <span>Qty</span><span>Per Unit</span><span>Total</span><span>Saved</span>
              </div>
              {entries.map(([q, p]) => (
                <div
                  key={q}
                  className="grid grid-cols-4 gap-2 px-3 py-2 text-xs cursor-pointer hover:bg-blue-50"
                  onClick={() => { setQty(+q); setOpen(false); }}
                >
                  <span>{q}</span>
                  <span>Rs {p}</span>
                  <span>Rs {p * +q}</span>
                  <span className="text-green-600">Rs {(product.price - p) * +q}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}