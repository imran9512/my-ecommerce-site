// src/pages/category/[slug].js
import Head from 'next/head';
import ProductCard from '@/components/ProductCard';
import products from '@/data/products';

export default function CategoryPage({ products, slug }) {
  return (
    <>
      <Head>
        <title>{slug.replace('-', ' ').toUpperCase()} – MyShop</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {slug.replace('-', ' ')}
        </h1>

        {products.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found in this category.</p>
        )}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  // collect all unique category slugs
  const allCats = new Set();
  products.forEach((p) => p.categories?.forEach((c) => allCats.add(c)));
  const paths = Array.from(allCats).map((slug) => ({ params: { slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filtered = products.filter((p) =>
    p.categories?.includes(params.slug)
  );
  return { props: { products: filtered, slug: params.slug } };
}