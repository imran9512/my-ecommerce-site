// components/ProductCard.js
import Link from 'next/link';
export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow">
      <img src={product.image} alt={product.title} className="w-full h-40 object-cover" />
      <div className="p-3">
        <h2 className="font-semibold">{product.title}</h2>
        <p className="text-lg font-bold">${product.price}</p>
        <Link href={`/product/${product.id}`} className="text-sky-600 text-sm">
          View Details →
        </Link>
      </div>
    </div>
  );
}