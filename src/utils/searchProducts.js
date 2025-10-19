// src/utils/searchProducts.js
import products from '@/data/products';

function toSearchString(val) {
  if (Array.isArray(val)) return val.join(' ').toLowerCase();
  return String(val || '').toLowerCase();
}

export function searchProducts(query = '') {
  const q = query.trim().toLowerCase();
  if (!q) return products;

  return products.filter((p) =>
    toSearchString(p.name).includes(q) ||
    toSearchString(p.slug).includes(q) ||
    toSearchString(p.brand).includes(q) ||
    toSearchString(p.ActiveSalt).includes(q) ||
    p.categories.some((c) => c.toLowerCase().includes(q))
  );
}