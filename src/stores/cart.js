import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper function to calculate price based on quantity
function calculatePrice(product, quantity) {
  const { qtyDiscount, price } = product;
  if (!qtyDiscount) return price;

  const raw = qtyDiscount;
  const tiers = Object.keys(raw).map(Number).sort((a, b) => a - b);

  // Helper: price for Q ≥ 1
  const priceForQty = (q) => {
    // 1) exact tier
    if (raw[q]) return raw[q];
    // 2) last tier ≤ q
    const last = tiers.filter(t => t <= q).pop();
    return last ? raw[last] : price;
  };

  return priceForQty(quantity);
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      // Initialize items array in state
      items: [],
      // Function to add an item to the cart or update quantity
      addItem: (product, qty = 1) =>
        set((state) => {
          const idx = state.items.findIndex((i) => i.id === product.id);
          const newItems = [...state.items];
          if (idx > -1) {
            newItems[idx].quantity += qty;
            newItems[idx].totalPrice = calculatePrice(product, newItems[idx].quantity);
          } else {
            const totalPrice = calculatePrice(product, qty);
            newItems.push({ ...product, quantity: qty, totalPrice });
          }
          // Return new state with updated items
          return { items: newItems };
        }),
      // Function to update the quantity of a specific item
      updateQuantity: (id, newQty) =>
        set((state) => {
          const items = state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: newQty,
                  totalPrice: calculatePrice(item, newQty),
                }
              : item
          );
          return { items };
        }),
      // Function to remove an item from the cart
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      // Function to clear all items from the cart
      clearCart: () => set({ items: [] }),
      // Getter function to calculate the total price of all items in the cart
      get total() {
        return get().items.reduce((sum, i) => sum + i.totalPrice * i.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // The key used in localStorage to store the cart state
    }
  )
);