// src/pages/checkout.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useCartStore } from '@/stores/cart';
import {
  GOOGLE_FORM_URL,
  GOOGLE_FORM_FIELDS,
  COURIER_OPTIONS,
  ONLINE_DISCOUNT_PERCENT,
  generateOrderId,
} from '@/data/constants';

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

  // load cart
  useEffect(() => {
    useCartStore.getState().load();
    setItems(useCartStore.getState().items);
  }, []);

  // totals
  const subtotal = items.reduce((s, it) => it.totalPrice * it.quantity + s, 0);
  const discount =
    form.payment_method === 'Online'
      ? (subtotal * ONLINE_DISCOUNT_PERCENT) / 100
      : 0;
  const grandTotal = subtotal - discount;

  // courier charge
  const courierCharge =
    COURIER_OPTIONS.find((c) => c.name === form.courier_option)?.charge || 0;
  const finalTotal = grandTotal + courierCharge;

  // order id
  const orderId = generateOrderId(); // daily counter can be added later

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const body = new URLSearchParams();
    body.append(GOOGLE_FORM_FIELDS.order_id, orderId);
    body.append(GOOGLE_FORM_FIELDS.name, form.name);
    body.append(GOOGLE_FORM_FIELDS.phone, form.phone);
    body.append(GOOGLE_FORM_FIELDS.city, form.city);
    body.append(GOOGLE_FORM_FIELDS.address, form.address);
    body.append(GOOGLE_FORM_FIELDS.instructions, form.instructions);
    body.append(GOOGLE_FORM_FIELDS.payment_method, form.payment_method);
    body.append(GOOGLE_FORM_FIELDS.courier_option, form.courier_option);
    body.append(
      GOOGLE_FORM_FIELDS.products_json,
      JSON.stringify(
        items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          rate: i.totalPrice,
        }))
      )
    );
    body.append(GOOGLE_FORM_FIELDS.subtotal, subtotal.toFixed(2));
    body.append(GOOGLE_FORM_FIELDS.discount, discount.toFixed(2));
    body.append(GOOGLE_FORM_FIELDS.grand_total, finalTotal.toFixed(2));

    fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    useCartStore.getState().clearCart();
    router.push(`/success?order_id=${orderId}`);
  };

  // UI
  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {/* responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* left form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              required
              className="w-full border rounded px-3 py-2"
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            />
            <input
              name="phone"
              placeholder="Phone"
              required
              className="w-full border rounded px-3 py-2"
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            />
            <input
              name="city"
              placeholder="City"
              required
              className="w-full border rounded px-3 py-2"
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            />
            <textarea
              name="address"
              placeholder="Address"
              required
              rows={3}
              className="w-full border rounded px-3 py-2"
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            />
            <textarea
              name="instructions"
              placeholder="Delivery Instructions (optional)"
              rows={2}
              className="w-full border rounded px-3 py-2"
              onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
            />

            {/* payment method */}
            <div>
              <label className="font-semibold">Payment Method</label>
              <select
                name="payment_method"
                className="w-full border rounded px-3 py-2 mt-1"
                value={form.payment_method}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              >
                <option value="COD">Cash on Delivery</option>
                <option value="Online">
                  Online (Bank Transfer) – Get {ONLINE_DISCOUNT_PERCENT}% discount
                </option>
              </select>
            </div>

            {/* courier option */}
            <div>
              <label className="font-semibold">Courier Option</label>
              <select
                name="courier_option"
                className="w-full border rounded px-3 py-2 mt-1"
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
            <div className="border-t pt-4 space-y-1 text-sm">
              <p>Subtotal: Rs {subtotal.toFixed(2)}</p>
              {discount > 0 && (
                <p className="text-green-600">
                  Discount ({ONLINE_DISCOUNT_PERCENT}%): - Rs {discount.toFixed(2)}
                </p>
              )}
              <p>Courier: + Rs {courierCharge.toFixed(2)}</p>
              <p className="text-xl font-bold">
                Grand Total: Rs {finalTotal.toFixed(2)}
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700"
            >
              Submit Order
            </button>
          </form>
        </div>

        {/* right summary */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {items.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × Rs {item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-bold">
                    Rs {(item.totalPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}