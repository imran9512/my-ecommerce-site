// src/pages/cart.js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <>
      <Head>
        <title>Cart | Aap Ki Sehat</title>
      </Head>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-bold">Your cart is empty</p>
            <Link href="/shop" className="mt-4 text-sky-600 underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div>
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded"
                  />
                  <div className="ml-4">
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-gray-600">Rs {item.totalPrice}x{item.quantity}=<span className="text-lg font-semibold">{(item.totalPrice * item.quantity).toFixed(2)} </span>
                    <span className="text-sm line-through text-red-500">{(item.price * item.quantity).toFixed(2)}</span></p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                  >
                    <span className="text-gray-700">-</span>
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                  >
                    <span className="text-gray-700">+</span>
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-2 bg-red-500 hover:bg-red-600 rounded-full p-2 text-white"
                  >
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-8 flex justify-between items-center border-t py-4">
              <span className="text-xl font-bold">Total: Rs {total.toFixed(2)}</span>
              <Link href="/checkout" className="bg-sky-600 text-white px-6 py-2 rounded">
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}