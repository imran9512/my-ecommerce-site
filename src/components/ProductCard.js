// src/utils/getProduct.js
import products from '@/data/products';

export const getProductBySlug = (slug) =>
  products.find((p) => p.slug === slug);

export const getProductsByIds = (ids) =>
  products.filter((p) => ids?.includes(p.id));