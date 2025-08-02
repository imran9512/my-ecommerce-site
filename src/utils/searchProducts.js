// src/utils/searchProducts.js
import products from '@/data/products'; // default export

export function searchProducts(query) {
  if (!query) return products;

  const q = query.trim().toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.slug.toLowerCase().includes(q) ||
    p.ActiveSalt.toLowerCase().includes(q) ||
    p.categories.some(c => c.toLowerCase().includes(q))
  );
}