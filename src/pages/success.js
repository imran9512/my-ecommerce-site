// src/pages/success.js
import Link from 'next/link';   // ⬅ add this line
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const router = useRouter();
  const { order_id } = router.query;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-3xl font-bold text-green-600">Thank you!</h1>
      <p className="mt-2 text-xl">Your order has been submitted.</p>
      {order_id && (
        <p className="mt-4 text-lg">
          Order ID: <span className="font-mono text-sky-600">{order_id}</span>
        </p>
      )}
      <Link href="/" className="mt-6 inline-block bg-sky-600 text-white px-6 py-2 rounded">
        Continue Shopping
      </Link>
    </div>
  );
}