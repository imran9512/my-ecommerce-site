// src/components/QuantityPrice.jsx
import { useState, useEffect, useRef } from 'react';
import { getDiscountedPrice } from '@/utils/priceHelpers';

export default function QuantityPrice({ product, qty, setQty, unitPrice }) {
    const base = unitPrice ?? product.price;

    /* ---------- discount table (only for non-strip) ---------- */
    let raw = product.qtyDiscount || {};
    if (Array.isArray(raw)) {                // segment → flat map
        const flat = {};
        raw.forEach(seg => {
            const step = (seg.end - seg.start) / (seg.to - seg.from);
            for (let q = seg.from; q <= seg.to; q++) flat[q] = seg.start + (q - seg.from) * step;
        });
        raw = flat;
    }

    const isStrip = unitPrice !== product.price;
    if (isStrip) raw = {};                   // strip → no discounts

    const priceForQty = (q) => getDiscountedPrice(base, raw, q);
    const lowestPrice = isStrip
        ? Math.round(base)
        : Math.min(...Object.values(raw).map(p => Math.round(base - base * p / 100)), Math.round(base));

    const currentUnit = priceForQty(qty);
    const totalPrice = currentUnit * qty;
    const saved = (Math.round(base) - currentUnit) * qty;

    /* ---------- dropdown state ---------- */
    const entries = Object.entries(raw).sort(([a], [b]) => +a - +b);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const outside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', outside);
        return () => document.removeEventListener('mousedown', outside);
    }, []);

    /* ---------- visible rows for dropdown ---------- */
    const visibleRows = (() => {
        if (entries.length === 0) return [];
        const allQty = entries.map(([q]) => +q);
        const maxQty = allQty[allQty.length - 1];
        if (maxQty <= 10) return entries;

        const set = new Set([2, 3, 4, 5, 6, 7, 8, 9, 10]);
        for (let q = 15; q <= maxQty; q += 5) set.add(q);
        set.add(maxQty);
        return entries.filter(([q]) => set.has(+q));
    })();

    /* ---------- render ---------- */
    return (
        <div className="mt-1 space-y-3">
            {/* price badge */}
            <div className="flex items-end space-x-2">
                <span className="text-xl font-bold">
                    {isStrip
                        ? `Rs ${Math.round(base).toLocaleString()}`
                        : qty === 1
                            ? `Rs ${Math.round(base).toLocaleString()} – ${lowestPrice.toLocaleString()}`
                            : `Rs ${currentUnit.toLocaleString()}`}
                </span>

                {!isStrip && Math.round(base) !== currentUnit && (
                    <>
                        <span className="line-through text-gray-500">Rs {Math.round(base).toLocaleString()}</span>
                        <span className="text-green-600 text-sm">Saved Rs {saved}</span>
                    </>
                )}
            </div>

            {!isStrip && qty !== 1 && (
                <p className="text-sm inline-block shadow-lg font-semibold text-red-800">
                    As low as Rs {lowestPrice.toLocaleString()}
                </p>
            )}

            {/* qty selector */}
            <div className="mt-2 flex items-left space-x-3">
                <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full shadow transition"
                >
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </button>

                <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, +e.target.value))}
                    className="w-16 h-10 text-center text-xl font-semibold border border-gray-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                />

                <button
                    onClick={() => setQty(qty + 1)}
                    className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full shadow transition"
                >
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                </button>

                <span className="ml-4 mt-2 text-lg font-bold text-gray-800">Total: {totalPrice.toLocaleString()}</span>
            </div>

            {/* discount dropdown */}
            {!isStrip && visibleRows.length > 0 && (
                <div className="relative w-auto max-w-md" ref={wrapperRef}>
                    <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-1 text-sm font-semibold bg-red-200 rounded-md">
                        Get Discount on Quantity
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>

                    {open && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                            <div className="grid grid-cols-4 gap-2 px-3 py-1 sticky top-0 bg-gray-100 text-xs font-mono tabular-nums font-semibold">
                                <span>Qty</span><span>Per Unit</span><span>Total</span><span>Saving</span>
                            </div>
                            {visibleRows.map(([q, percent]) => {
                                const discPrice = Math.round(base - base * percent / 100);
                                return (
                                    <div key={q} className="grid grid-cols-4 gap-2 px-3 py-2 text-xs cursor-pointer hover:bg-blue-50" onClick={() => { setQty(+q); setOpen(false); }}>
                                        <span>{q}</span>
                                        <span>Rs {discPrice.toLocaleString()}</span>
                                        <span>Rs {(discPrice * +q).toLocaleString()}</span>
                                        <span className="text-green-600">Rs {((Math.round(base) - discPrice) * +q).toLocaleString()}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}