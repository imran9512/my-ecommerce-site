// src/stores/cart.js
import { create } from 'zustand';

function calculatePrice(product, qty) {
  const disc = product.qtyDiscount || {};
  const tiers = Object.keys(disc).map(Number).sort((a, b) => a - b);
  const last = tiers.filter((t) => t <= qty).pop();
  return last ? Number(disc[last]) : Number(product.price);
}

export const useCartStore = create((set, get) => ({
  items: [],

  load() {
    if (typeof window === 'undefined') return;
    try {
      const saved = JSON.parse(localStorage.getItem('my-cart') || '[]');
      const items = saved.map((it) => ({
        ...it,
        price: Number(it.price),
        totalPrice: calculatePrice(it, it.quantity),
        quantity: Number(it.quantity) || 0,
      }));
      set({ items });
    } catch {
      set({ items: [] });
    }
  },

  save(items) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('my-cart', JSON.stringify(items));
  },

  addItem(product, qty = 1) {
    set((state) => {
      let items = [...state.items];
      const idx = items.findIndex((i) => i.id === product.id);
      if (idx > -1) {
        items[idx].quantity += qty;
        items[idx].totalPrice = calculatePrice(items[idx], items[idx].quantity);
      } else {
        items.push({
          ...product,
          quantity: qty,
          totalPrice: calculatePrice(product, qty),
        });
      }
      get().save(items);
      return { items };
    });
  },

  updateQuantity(id, newQty) {
    set((state) => {
      const items = state.items.map((it) =>
        it.id === id
          ? { ...it, quantity: newQty, totalPrice: calculatePrice(it, newQty) }
          : it
      );
      get().save(items);
      return { items };
    });
  },

  removeItem(id) {
    set((state) => {
      const items = state.items.filter((i) => i.id !== id);
      get().save(items);
      return { items };
    });
  },

  clearCart() {
    set({ items: [] });
    if (typeof window !== 'undefined') localStorage.removeItem('my-cart');
  },

  get total() {
    return get().items.reduce((sum, it) => it.totalPrice * it.quantity, 0);
  },

  get totalQuantity() {
    return get().items.reduce((sum, it) => it.quantity, 0);
  },
}));