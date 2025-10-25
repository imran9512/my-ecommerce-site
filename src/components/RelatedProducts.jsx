// src/components/RelatedProducts.jsx
import ProductCard from '@/components/ProductCard';

export default function RelatedProducts({ products }) {
  if (!products?.length) return null;
  return (
    <section className="mt-2 -mx-1">
      <h2 className="text-xl font-bold mb-2 text-center">Related Products</h2>
      {/* Horizontal slider (ProductCard inside) */}
      <div className="flex overflow-x-auto gap-2">
        {products
          .filter(p => p.active)
          .map(p => (
            <div key={p.id} className="flex-shrink-0 w-[150px] md:w-[150px] lg:w-[150px]">
              <ProductCard product={p} />
            </div>
          ))}
      </div>
    </section>
  );
}