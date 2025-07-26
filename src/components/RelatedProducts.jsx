// src/components/RelatedProducts.jsx
import Image from 'next/image';
import Link from 'next/link';

export default function RelatedProducts({ products }) {
  if (!products?.length) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`}>
            <a className="border rounded p-2 hover:shadow">
              <Image
                src={p.images[0]}
                alt={p.name}
                width={200}
                height={150}
                className="object-cover rounded"
              />
              <p className="text-sm font-semibold mt-2">{p.name}</p>
              <p className="text-sm text-blue-600">Rs {p.price.toLocaleString()}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}