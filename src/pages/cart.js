// src/pages/cart.js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/stores/cart';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    useCartStore.getState().load();
    setMounted(true);
  }, []);

  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (!mounted) return null;

  // actual grand total
  const grandTotal = items.reduce(
    (sum, it) => it.totalPrice * it.quantity + sum,
    0
  );

  // regular price grand total
  const regularTotal = items.reduce(
    (sum, it) => it.price * it.quantity + sum,
    0
  );

  return (
    <>
      <Head>
        <title>Cart | Aap Ki Sehat</title>
      </Head>
      <div className="max-w-3xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-bold">Your cart is empty</p>
            <Link href="/shop" className="mt-4 text-sky-600 underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            {/* product list */}
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-sky-100 shadow-lg p-4 shadow mb-4 rounded-lg"
              >
                <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                  <Link href={`/products/${item.slug}`}>
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded object-cover cursor-pointer"
                    />
                  </Link>
                  <div>
                    <Link href={`/products/${item.slug}`}>
                      <span className="font-semibold text-lg text-sky-600 cursor-pointer">
                        {item.name}
                      </span>
                    </Link>
                    <p className="text-sm text-gray-500">
                      Rs {item.totalPrice.toFixed(2)} × {item.quantity} =
                      <span className="text-lg font-semibold">
                        {(item.totalPrice * item.quantity).toFixed(2)}
                      </span>{' '}
                      
                    </p>
                    <p>
                      <span className="text-xs text-green-500 font-semibold">
                        {((item.price * item.quantity) - (item.totalPrice * item.quantity)) > 0 ? (
                        `*Saved Rs ${((item.price * item.quantity) - (item.totalPrice * item.quantity)).toFixed(2)}`
                         ) : (
                        <span className="text-yellow-500">add more to get discount</span>
                        )}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="bg-gray-200 hover:bg-gray-300 rounded-full w-7 h-7"
                  >
                    −
                  </button>
                  <span className="font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-200 hover:bg-gray-300 rounded-full w-7 h-7"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-2 text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* grand totals */}

            <div className="mt-6 text-right border-t pt-4 space-y-1">
              <p className="text-xl">
                <span className="text-gray-600">Regular Total:</span>{' '}
                <span className="text-red-500 line-through">
                  Rs {regularTotal.toFixed(2)}
                </span>
              </p>
              <p className="text-2xl font-bold">
                <span className="text-gray-600">Grand Total:</span>{' '}
                Rs {grandTotal.toFixed(2)}
              </p>
            </div>

            <div className="mt-4 text-right">
              <Link
                href="/checkout"
                className="inline-block bg-sky-600 text-white px-6 py-2 rounded hover:bg-sky-700"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}