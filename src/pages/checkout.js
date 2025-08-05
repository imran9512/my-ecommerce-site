// src/pages/checkout.js
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCartStore } from '@/stores/cart';
import {
  GOOGLE_FORM_URL,
  GOOGLE_FORM_FIELDS,
  COURIER_OPTIONS,
  ONLINE_DISCOUNT_PERCENT,
} from '@/data/constants';
import { generateOrderId } from '@/components/orderId';

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    instructions: '',
    payment_method: 'COD',
    courier_option: 'Regular',
  });

  const router = useRouter();

  /* ---------- load cart ---------- */
  useEffect(() => {
    useCartStore.getState().load();
    setItems(useCartStore.getState().items);
  }, []);

  /* ---------- totals ---------- */
  const subtotal = items.reduce((s, it) => it.totalPrice * it.quantity + s, 0);
  const discount =
    form.payment_method === 'Online'
      ? (subtotal * ONLINE_DISCOUNT_PERCENT) / 100
      : 0;
  const grandTotal = subtotal - discount;

  const courierCharge =
    COURIER_OPTIONS.find((c) => c.name === form.courier_option)?.charge || 0;
  const finalTotal = grandTotal + courierCharge;

  /* ---------- daily counter ---------- */
  const orderId = generateOrderId();

  /* ---------- handle submit ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    /* short product line */
    const productLine = items
      .map((it) => `${it.name} x ${it.quantity} rate: ${it.totalPrice}`)
      .join(', ');

    const body = new URLSearchParams();
    body.append(GOOGLE_FORM_FIELDS.order_id, orderId);
    body.append(GOOGLE_FORM_FIELDS.name, form.name);
    body.append(GOOGLE_FORM_FIELDS.phone, form.phone);
    body.append(GOOGLE_FORM_FIELDS.city, form.city);
    body.append(GOOGLE_FORM_FIELDS.address, form.address);
    body.append(GOOGLE_FORM_FIELDS.instructions, form.instructions);
    body.append(GOOGLE_FORM_FIELDS.payment_method, form.payment_method);
    body.append(GOOGLE_FORM_FIELDS.courier_option, form.courier_option);
    body.append(GOOGLE_FORM_FIELDS.products_json, productLine);
    body.append(GOOGLE_FORM_FIELDS.subtotal, subtotal.toFixed(2));
    body.append(GOOGLE_FORM_FIELDS.discount, discount.toFixed(2));
    body.append(GOOGLE_FORM_FIELDS.delivery_charges, courierCharge.toFixed(2));
    body.append(GOOGLE_FORM_FIELDS.grand_total, finalTotal.toFixed(2));

    fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    useCartStore.getState().clearCart();
    router.push(
      `/success?order_id=${orderId}&grandTotal=${finalTotal}&payment_method=${form.payment_method}`
    );
  };

  /* ---------- UI ---------- */
  
  
  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* left form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            required
            className="w-full px-3 py-2 bg-sky-100 shadow-lg focus:outline-none"
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
          />
          <div className="flex space-x-4">
            <input
              name="phone"
              placeholder="Phone"
              required
              className="w-1/2 px-3 py-2 bg-sky-100 shadow-lg focus:outline-none"
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            />
            <input
              name="city"
              placeholder="City"
              required
              className="w-1/2 px-3 py-2 bg-sky-100 shadow-lg focus:outline-none"
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            />
          </div>
          <textarea
            name="address"
            placeholder="Address"
            required
            rows={3}
            className="w-full px-3 py-2 bg-sky-100 shadow-lg focus:outline-none"
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
          />
          <textarea
            name="instructions"
            placeholder="Delivery Instructions (optional)"
            rows={2}
            className="w-full px-3 py-2 bg-sky-100 shadow-lg focus:outline-none"
            onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
          />

          {/* payment */}
          <div>
            <label className="font-semibold">Payment Method</label>
            <select
              name="payment_method"
              className="w-full px-3 py-2 bg-sky-100 shadow-lg focus:outline-none"
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Online">
                Online (Bank Transfer) – {ONLINE_DISCOUNT_PERCENT}% discount
              </option>
            </select>
          </div>

          {/* courier */}
          <div>
            <label className="font-semibold">Courier Option</label>
            <select
              name="courier_option"
              className="w-full px-3 py-2 bg-sky-100 shadow-lg focus:outline-none"
              value={form.courier_option}
              onChange={(e) => setForm({ ...form, courier_option: e.target.value })}
            >
              {COURIER_OPTIONS.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} {c.charge === 0 ? '(Free)' : `+ Rs ${c.charge}`}
                </option>
              ))}
            </select>
          </div>

          {/* totals */}
          <div className="border-t pt-4 text-sm">
            <p>Subtotal: Rs {subtotal.toFixed(2)}</p>
            {discount > 0 && (
              <p className="text-green-600">
                Discount ({ONLINE_DISCOUNT_PERCENT}%): - Rs {discount.toFixed(2)}
              </p>
            )}
            <p>Courier: + Rs {courierCharge.toFixed(2)}</p>
            <p className="text-xl font-bold">Grand Total: Rs {finalTotal.toFixed(2)}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700"
          >
            Submit Order
          </button>
        </form>

        {/* right summary */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {items.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            items.map((it) => (
              <div
                key={it.id}
                className="flex items-center space-x-3 bg-sky-100 p-3 rounded mb-2"
              >
                <img
                  src={it.images[0]}
                  alt={it.name}
                  className="w-14 h-14 rounded object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">{it.name}</p>
                  <p className="text-xs">
                    {it.quantity} × Rs {it.totalPrice.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm font-bold">
                  Rs {(it.totalPrice * it.quantity).toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}