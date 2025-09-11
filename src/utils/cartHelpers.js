// src/utils/cartHelpers.js
export function cartContainsOnlyStrips(items) {
    // true if at least one strip AND zero normal items
    const hasStrip = items.some(it => it.id.endsWith('-strip'));
    const hasNormal = items.some(it => !it.id.endsWith('-strip'));
    return hasStrip && !hasNormal;
}