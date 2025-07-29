// src/pages/checkout.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useCartStore } from '@/stores/cart';

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const router = useRouter();

  // cart load
  useEffect(() => {
    useCartStore.getState().load();
    setItems(useCartStore.getState().items);
  }, []);

  // totals
  const grandTotal = items.reduce((sum, it) => it.totalPrice * it.quantity + sum, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // send to google form / api
    alert('Order placed successfully!');
    useCartStore.getState().clearCart();
    router.push('/success');
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* MOBILE/TAB: Summary on top */}
        <div className="lg:col-span-2 lg:order-last">
          {/* Desktop heading */}
          <h2 className="text-xl font-semibold mb-4 hidden lg:block">
            Order Summary
          </h2>

          {/* Summary card */}
          <div className="bg-white border rounded-xl p-4 shadow">
            {items.length === 0 ? (
              <p className="text-center">Cart is empty</p>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 mb-3"
                  >
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

                <div className="border-t mt-4 pt-2 text-right">
                  <p className="text-lg font-bold">
                    Grand Total: Rs {grandTotal.toFixed(2)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* DESKTOP: Form on left / MOBILE: below summary */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4 lg:hidden">
            Shipping Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              required
              className="w-full border rounded px-3 py-2"
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full border rounded px-3 py-2"
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
            />
            <input
              name="phone"
              placeholder="Phone"
              required
              className="w-full border rounded px-3 py-2"
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
            />
            <textarea
              name="address"
              placeholder="Address"
              required
              rows={3}
              className="w-full border rounded px-3 py-2"
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
            />

            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700"
            >
              Submit Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}