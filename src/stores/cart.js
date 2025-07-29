// src/stores/cart.js
import { create } from 'zustand';

const toNum = (v) => Number(v) || 0;

export const useCartStore = create((set, get) => ({
  items: [],

  load() {
    if (typeof window === 'undefined') return;
    try {
      const saved = JSON.parse(localStorage.getItem('my-cart') || '[]');
      const items = saved.map((it) => ({
        ...it,
        price: toNum(it.price),
        totalPrice: toNum(it.totalPrice),
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
      } else {
        items.push({
          ...product,
          price: toNum(product.price),
          totalPrice: toNum(product.totalPrice || product.price),
          quantity: qty,
        });
      }
      get().save(items);
      return { items };
    });
  },

  updateQuantity(id, newQty) {
    set((state) => {
      const items = state.items.map((it) =>
        it.id === id ? { ...it, quantity: newQty } : it
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

  // yahan getter add kiya
  get total() {
    return get().items.reduce((sum, it) => toNum(it.totalPrice) * it.quantity, 0);
  },

  get totalQuantity() {
    return get().items.reduce((sum, it) => it.quantity, 0);
  },
}));