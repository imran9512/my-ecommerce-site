// src/pages/cart.js
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const updateQty = (id, qty) => {
    const updated = items
      .map((i) => (i.id === id ? { ...i, quantity: qty } : i))
      .filter((i) => i.quantity > 0);
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  if (!items.length)
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Cart is empty</h1>
        <Link href="/shop" className="mt-4 text-sky-600 underline">
          Continue shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 border rounded p-4">
            <Image src={item.image} alt={item.name} width={80} height={80} className="rounded" />
            <div className="flex-1">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-600">${item.price / 100}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <span className="text-xl font-bold">Total: ${total / 100}</span>
        <Link href="/checkout" className="bg-sky-600 text-white px-6 py-2 rounded">
          Checkout
        </Link>
      </div>
    </div>
  );
}