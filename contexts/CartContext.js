// contexts/CartContext.js
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // load from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(saved);
  }, []);

  // write to localStorage on change
  useEffect(() => {
    if (items.length || localStorage.getItem('cart')) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (product) => {
    setItems(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.map(p => p.id === product.id ? { ...p, qty: (p.qty || 1) + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (id) => setItems(prev => prev.filter(p => p.id !== id));

  const total = items.reduce((sum, p) => sum + p.price * (p.qty || 1), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);