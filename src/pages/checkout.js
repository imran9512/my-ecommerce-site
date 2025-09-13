// src/pages/checkout.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCartStore } from '@/stores/cart';
import { getDiscountedPrice, normalizeDiscount } from '@/utils/priceHelpers';
import {
  GOOGLE_FORM_URL,
  GOOGLE_FORM_FIELDS,
  COURIER_OPTIONS,
  ONLINE_DISCOUNT_PERCENT,
  STRIP_DELIVERY_CHARGE,
} from '@/data/constants';
import { cartContainsOnlyStrips } from '@/utils/cartHelpers';
import { generateOrderId } from '@/components/orderId';


/* --------------  NEW  -------------- */
const STORAGE_KEY = 'offline_order';   // localStorage key

function buildBody(orderId, form, items, subtotal, discount, courierCharge, finalTotal, isOffline = false) {
  const productLine = items
    .map(it => {
      const unit = it.id.endsWith('-strip')
        ? Math.round(it.price)
        : getDiscountedPrice(it.price, it.qtyDiscount, it.quantity);

      const suffix = it.id.endsWith('-strip') ? '-strip' : '';
      return `${it.sku}${suffix} x ${it.quantity}`;
    })
    .join(', ');

  const body = new URLSearchParams();
  body.append(GOOGLE_FORM_FIELDS.order_id, orderId);
  body.append(GOOGLE_FORM_FIELDS.name, isOffline ? `Offline-${form.name}` : form.name);
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
  return body;
}

async function postOrder(body) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 7000);
  await fetch(GOOGLE_FORM_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: controller.signal,
  });
  clearTimeout(t);
}
/* --------------  END NEW  -------------- */

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [online, setOnline] = useState(true);
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    instructions: '',
    payment_method: 'COD',
    courier_option: 'Regular',
  });

  const [currentPhone, setCurrentPhone] = useState('');
  const [phoneList, setPhoneList] = useState([]);

  useEffect(() => {
    const all = [...phoneList];
    if (currentPhone.trim()) all.push(currentPhone.trim());
    setForm(f => ({ ...f, phone: all.join(', ') }));
  }, [currentPhone, phoneList]);

  /* ----------  cart load  ---------- */
  useEffect(() => {
    useCartStore.getState().load();
    setItems(useCartStore.getState().items);
  }, []);

  /* ----------  network status  ---------- */
  useEffect(() => {
    const onStatus = () => setOnline(navigator.onLine);
    window.addEventListener('online', onStatus);
    window.addEventListener('offline', onStatus);
    setOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', onStatus);
      window.removeEventListener('offline', onStatus);
    };
  }, []);

  /* ----------  totals  ---------- */
  const subtotal = items.reduce((sum, it) => {
    const unit = it.id.endsWith('-strip')
      ? Math.round(it.price)               // strip → no qtyDiscount
      : getDiscountedPrice(it.price, it.qtyDiscount, it.quantity);
    return sum + unit * it.quantity;
  }, 0);

  const discount =
    form.payment_method === 'Online' ? (subtotal * ONLINE_DISCOUNT_PERCENT) / 100 : 0;
  const grandTotal = subtotal - discount;
  const stripOnly = cartContainsOnlyStrips(items);
  const courierChargeS = stripOnly ? STRIP_DELIVERY_CHARGE : 0;
  const courierCharge =
    COURIER_OPTIONS.find(c => c.name === form.courier_option)?.charge || 0;
  const finalTotal = grandTotal + courierCharge + courierChargeS;



  /* ----------  submit  ---------- */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!online) return;                // should never fire, just guard
    const orderId = generateOrderId();
    const body = buildBody(orderId, form, items, subtotal, discount, courierCharge, finalTotal, false);
    try {
      await postOrder(body);
      useCartStore.getState().clearCart();
      router.push(
        `/success?order_id=${orderId}&grandTotal=${finalTotal}&payment_method=${form.payment_method}`
      );
    } catch {
      const orderId = generateOrderId();
      localStorage.setItem('offline_order', JSON.stringify({
        orderId, form, items, subtotal, discount, courierCharge, finalTotal,
      }));
      // --- NEW ---
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(reg => reg.sync.register('offline-order'));
      }
      alert('Please check your internet connection to submit the order.');
    }
  };

  /* ----------  UI  ---------- */
  return (
    <div className="mt-8 max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {!online && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-800 text-center font-semibold">
          You are not connected to the internet, please connect to place the order.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/*  LEFT FORM  */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            required
            className="w-full px-3 py-2 bg-sky-100 rounded-md shadow-lg focus:outline-none"
            onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
          />

          <div className="flex space-x-4">
            <div className="relative w-1/2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Phone"
                maxLength={11}
                value={currentPhone}
                onChange={e => {
                  if (/^\d*$/.test(e.target.value)) setCurrentPhone(e.target.value);
                }}
                className="w-full px-3 py-2 bg-sky-100 rounded-md shadow-lg focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => {
                  const val = currentPhone.trim();
                  if (val && phoneList.length < 3 && !phoneList.includes(val)) {
                    setPhoneList(prev => [...prev, val]);
                    setCurrentPhone('');
                  }
                }}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-lg font-bold text-sky-700 hover:text-sky-900"
              >
                +
              </button>
            </div>

            <input
              name="city"
              placeholder="City"
              required
              className="w-1/2 px-3 py-2 bg-sky-100 rounded-md shadow-lg focus:outline-none"
              onChange={e => setForm({ ...form, city: e.target.value })}
            />
          </div>

          {phoneList.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm mt-1">
              {phoneList.map((p, i) => (
                <span key={i} className="bg-sky-200 px-2 py-1 rounded">
                  {p}
                  <button
                    type="button"
                    className="ml-2 text-red-600"
                    onClick={() => setPhoneList(prev => prev.filter((_, idx) => idx !== i))}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <textarea
            name="address"
            placeholder="Address"
            required
            rows={3}
            className="w-full px-3 py-2 bg-sky-100 rounded-md shadow-lg focus:outline-none"
            onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
          />
          <textarea
            name="instructions"
            placeholder="Delivery Instructions (optional)"
            rows={2}
            className="w-full px-3 py-2 bg-sky-100 rounded-md shadow-lg focus:outline-none"
            onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
          />

          <div>
            <label className="font-semibold">Method (Get {ONLINE_DISCOUNT_PERCENT}% discount on Online Payment)</label>
            <select
              name="payment_method"
              className="w-full px-3 py-2 bg-sky-100 rounded-md shadow-lg focus:outline-none"
              value={form.payment_method}
              onChange={e => setForm({ ...form, payment_method: e.target.value })}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Online">
                Online/Bank Transfer – {ONLINE_DISCOUNT_PERCENT}% discount
              </option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Courier Option</label>
            <select
              name="courier_option"
              className="w-full px-3 py-2 bg-sky-100 rounded-md shadow-lg focus:outline-none"
              value={form.courier_option}
              onChange={e => setForm({ ...form, courier_option: e.target.value })}
            >
              {COURIER_OPTIONS.map(c => (
                <option key={c.name} value={c.name}>
                  {c.name} {c.charge === 0 ? '(Free)' : `+ Rs ${c.charge}`}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t pt-4 text-sm">
            <p>Subtotal: Rs {subtotal.toFixed(2)}</p>
            {discount > 0 && (
              <p className="text-green-600">
                Discount ({ONLINE_DISCOUNT_PERCENT}%): - Rs {discount.toFixed(2)}
              </p>
            )}
            <p>Courier: + Rs {courierCharge.toFixed(2)}</p>
            {courierChargeS > 0 && (
              <p>Strip delivery charges: Rs {courierChargeS}</p>
            )}
            <p className="text-xl font-bold">Grand Total: Rs {finalTotal.toFixed(2)}</p>
          </div>

          <button
            type="submit"
            disabled={!online}              // NEW
            className={`w-full py-2 rounded-md text-white ${online ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Submit Order
          </button>
        </form>

        {/*  Order SUMMARY  */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {items.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            items.map(it => {
              const unit = it.id.endsWith('-strip')
                ? Math.round(it.price)                               // fixed strip price
                : getDiscountedPrice(it.price, normalizeDiscount(it), it.quantity);

              const line = unit * it.quantity;

              return (
                <div key={it.id} className="flex items-center space-x-3 bg-sky-100 p-3 rounded mb-2">
                  <img src={it.images[0]} alt={it.name} className="w-14 h-14 rounded object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{it.name}</p>
                    <p className="text-xs">{it.quantity} × Rs {unit.toLocaleString()}</p>
                  </div>
                  <p className="text-sm font-bold">Rs {line.toLocaleString()}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}