// pages/checkout.js
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [address, setAddress] = useState({ name: '', street: '', city: '', zip: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order placed!\n\nTotal: $${total}\nAddress: ${address.name}, ${address.street}, ${address.city}, ${address.zip}`);
    // clear cart
    localStorage.setItem('cart', '[]');
    window.location.href = '/';
  };

  if (!items.length) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p>Your cart is empty.</p>
        <Link href="/shop" className="text-sky-600 underline">Go to shop →</Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Order summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        {items.map(p => (
          <div key={p.id} className="flex justify-between border-b py-2">
            <span>{p.title} (×{p.qty})</span>
            <span>${(p.price * p.qty).toFixed(2)}</span>
          </div>
        ))}
        <p className="text-xl font-bold mt-2">Total: ${total.toFixed(2)}</p>
      </div>

      {/* Address form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Full Name"
          value={address.name}
          onChange={e => setAddress({ ...address, name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          required
          placeholder="Street"
          value={address.street}
          onChange={e => setAddress({ ...address, street: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          required
          placeholder="City"
          value={address.city}
          onChange={e => setAddress({ ...address, city: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          required
          placeholder="ZIP"
          value={address.zip}
          onChange={e => setAddress({ ...address, zip: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-sky-600 text-white px-6 py-2 rounded">
          Place Order
        </button>
      </form>

      <Link href="/cart" className="mt-4 inline-block text-gray-600 underline">
        ← Back to Cart
      </Link>
    </main>
  );
}