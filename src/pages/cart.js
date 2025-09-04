// src/pages/cart.js
import Head from 'next/head';
import Image from 'next/link';   // agar Image nahi chahiye to Link hi rakho
import Link from 'next/link';
import { useEffect } from 'react';
import { useCartStore } from '@/stores/cart';
import { getDiscountedPrice } from '@/utils/priceHelpers';

export default function CartPage() {
  useEffect(() => { useCartStore.getState().load(); }, []);

  const items = useCartStore(s => s.items);
  const update = useCartStore(s => s.updateQuantity);
  const remove = useCartStore(s => s.removeItem);

  const grandTotal = items.reduce((sum, it) => getDiscountedPrice(it.price, it.qtyDiscount, it.quantity) * it.quantity + sum, 0);
  const regularTotal = items.reduce((sum, it) => Math.round(it.price) * it.quantity + sum, 0);
  const totalSaved = Math.round(regularTotal - grandTotal);

  return (
    <>
      <Head><title>Cart | Aap Ki Sehat</title></Head>
      <div className="max-w-3xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-bold">Your cart is empty</p>
            <Link href="/shop" className="mt-4 text-sky-600 underline">Continue shopping</Link>
          </div>
        ) : (
          <>
            {items.map(item => {
              const unit = getDiscountedPrice(item.price, item.qtyDiscount, item.quantity);
              const line = unit * item.quantity;
              const saved = Math.round((item.price - unit) * item.quantity);

              return (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-sky-100 p-4 mb-4 rounded-lg shadow">
                  <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                    <Link href={`/products/${item.slug}`}>
                      <img src={item.images[0]} alt={item.name} className="w-20 h-20 rounded object-cover" />
                    </Link>
                    <div>
                      <Link href={`/products/${item.slug}`}>
                        <span className="font-semibold text-lg text-sky-600">{item.name}</span>
                      </Link>
                      <p className="text-sm text-gray-500">
                        Rs {unit.toLocaleString()} × {item.quantity} =
                        <span className="text-lg font-semibold ml-1">{line.toLocaleString()}</span>
                      </p>
                      {saved > 0 && (
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold mt-1">
                          Saved Rs {saved.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button onClick={() => update(item.id, Math.max(1, item.quantity - 1))} className="bg-gray-200 hover:bg-gray-300 rounded-full w-7 h-7">−</button>
                    <span className="font-bold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => update(item.id, item.quantity + 1)} className="bg-gray-200 hover:bg-gray-300 rounded-full w-7 h-7">+</button>
                    <button onClick={() => remove(item.id)} className="ml-2 text-red-600 text-sm">Remove</button>
                  </div>
                </div>
              );
            })}

            <div className="mt-6 text-right border-t pt-4 space-y-2">
              {totalSaved > 0 && (
                <>
                  <p className="text-lg"><span className="text-gray-600">Regular Total:</span> <span className="text-red-500 line-through">Rs {regularTotal.toLocaleString()}</span></p>
                  <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full">You Saved: Rs {totalSaved.toLocaleString()}</span>
                </>
              )}
              <p className="text-xl font-bold"><span className="text-gray-600">Grand Total:</span> Rs {grandTotal.toLocaleString()}</p>
              <Link href="/checkout" className="inline-block bg-sky-600 text-white px-6 py-2 mt-4 rounded hover:bg-sky-700">Checkout</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}