// src/pages/checkout.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GOOGLE_FORM_URL, GOOGLE_FORM_FIELDS } from '@/data/constants';

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const router = useRouter();

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = new URLSearchParams();
    body.append(GOOGLE_FORM_FIELDS.name, form.name);
    body.append(GOOGLE_FORM_FIELDS.email, form.email);
    body.append(GOOGLE_FORM_FIELDS.phone, form.phone);
    body.append(GOOGLE_FORM_FIELDS.address, form.address);
    body.append(
      GOOGLE_FORM_FIELDS.items,
      items.map((i) => `${i.name} x${i.quantity}`).join(', ')
    );
    body.append(GOOGLE_FORM_FIELDS.total, (total / 100).toString());

    await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    localStorage.removeItem('cart');
    router.push('/success');
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Full name" required className="w-full border rounded px-3 py-2" onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} />
        <input name="email" type="email" placeholder="Email" required className="w-full border rounded px-3 py-2" onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} />
        <input name="phone" placeholder="Phone" required className="w-full border rounded px-3 py-2" onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} />
        <input name="address" placeholder="Address" required className="w-full border rounded px-3 py-2" onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} />

        <div className="pt-4">
          <p className="text-lg font-bold mb-2">Order summary</p>
          <ul className="text-sm space-y-1">
            {items.map((i) => (
              <li key={i.id}>{i.name} x{i.quantity} – ${i.price / 100}</li>
            ))}
          </ul>
          <p className="font-bold mt-2">Total: ${total / 100}</p>
        </div>

        <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded">
          Submit Order
        </button>
      </form>
    </div>
  );
}