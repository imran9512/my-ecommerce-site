import Image from 'next/image';
import Link from 'next/link';

export default function RelatedProducts({ products }) {
  if (!products?.length) return null;

  return (
    <section className="mt-12 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Related Products</h2>

      {/* Horizontal scroll container */}
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-400">
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="flex-shrink-0 w-[150px] md:w-[150px] lg:w-[150px] group"
          >
            <div className="border border-gray-200 rounded-lg p-2 bg-white hover:shadow-lg transition-shadow">
              <Image
                src={p.images[0]}
                alt={p.name}
                width={150}
                height={150}
                className="w-full h-[150px] object-cover rounded"
              />

              <div className="mt-2 space-y-1 text-center">
                <p className="text-sm font-semibold truncate">{p.name}</p>
                <p className="text-xs">
                  Formula: <span className="text-blue-600">{p.ActiveSalt}</span>
                </p>
                <p className="text-xs">
                  As Low As: <span className="text-blue-600">Rs {p.offerPrice}</span>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Responsive grid fallback (optional) */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .scrollbar-thin { display: flex; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .scrollbar-thin { display: grid; grid-template-columns: repeat(4, 1fr); }
        }
        @media (min-width: 1025px) {
          .scrollbar-thin { display: grid; grid-template-columns: repeat(6, 1fr); }
        }
      `}</style>
    </section>
  );
}