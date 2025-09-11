// src/utils/priceHelpers.js

// ---- 1.  convert segment array → flat map  ----
export const normalizeDiscount = (product) => {
    const raw = product.qtyDiscount || {};
    if (!Array.isArray(raw)) return raw;          // already flat

    const flat = {};
    raw.forEach(seg => {
        const step = (seg.end - seg.start) / (seg.to - seg.from);
        for (let q = seg.from; q <= seg.to; q++) {
            flat[q] = seg.start + (q - seg.from) * step;
        }
    });
    return flat;
};

// ---- 2.  final price calculator  ----
export const getDiscountedPrice = (price = 0, qtyDiscount = {}, quantity = 1) => {
    if (!price || !qtyDiscount || typeof qtyDiscount !== 'object') return Math.round(price);

    // if we got a segment array, flatten it once
    const discountMap = Array.isArray(qtyDiscount) ? normalizeDiscount({ qtyDiscount }) : qtyDiscount;

    const tiers = Object.keys(discountMap).map(Number).sort((a, b) => a - b);
    const tier = tiers.filter(t => t <= quantity).pop();
    const percent = discountMap[tier] || 0;
    return Math.round(price - price * (percent / 100));
};