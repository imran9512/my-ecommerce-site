// src/utils/priceHelpers.js

export const getDiscountedPrice = (price = 0, qtyDiscount = {}, quantity = 1) => {
    if (!price || !qtyDiscount || typeof qtyDiscount !== 'object') return Math.round(price);
    const tiers = Object.keys(qtyDiscount).map(Number).sort((a, b) => a - b);
    const tier = tiers.filter(t => t <= quantity).pop();
    const percent = qtyDiscount[tier] || 0;
    return Math.round(price - price * (percent / 100));
};