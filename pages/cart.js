// pages/cart.js
import { useCart } from '../contexts/CartContext';

export default function CartPage() {
  const { items, removeItem, total } = useCart();
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map(p => (
            <div key={p.id} className="flex justify-between border-b py-4">
              <span>{p.title}</span>
              <span>${p.price} × {p.qty}</span>
              <button onClick={() => removeItem(p.id)} className="text-red-500">×</button>
            </div>
          ))}
          <p className="text-xl font-bold mt-4">Total: ${total}</p>
          <Link href="/checkout" className="mt-6 inline-block bg-sky-600 text-white px-6 py-2 rounded">
            Checkout
          </Link>
        </>
      )}
    </main>
  );
}