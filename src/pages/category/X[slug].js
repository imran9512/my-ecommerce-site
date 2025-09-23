// src/pages/category/[slug].js
import Head from 'next/head';
import ProductCard from '@/components/ProductCard';
import products from '@/data/products';
import categoryContent from '@/data/categoryContent';
import { SITE_URL } from '@/data/constants';

export default function CategoryPage({ products: categoryProducts, slug }) {
  const content = categoryContent[slug] || {};

  // ---- helper: turn string OR array into one string ----
  const toHtml = (field) =>
    Array.isArray(field) ? field.join('') : (field || '');

  const catSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: content.metaTitle,
    itemListElement: categoryProducts.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/products/${p.slug}`,
      name: p.name,
      image: `${SITE_URL}${p.images[0]}`,
      offers: {
        '@type': 'Offer',
        price: p.price,
        priceCurrency: 'PKR',
      },
    })),
  };

  const canonical = `${SITE_URL}/products/category/${slug}`;

  return (
    <>
      <Head>
        <title>{content.metaTitle}</title>
        <meta name="description" content={content.metaDesc} />
        <link rel="canonical" href={canonical} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(catSchema) }}
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 mt-4 text-center capitalize">
          {slug.replace(/-/g, ' ')}
        </h1>

        {/* --------  INTRO  -------- */}
        {content.intro && (
          <div dangerouslySetInnerHTML={{ __html: toHtml(content.intro) }} />
        )}

        {/* --------  PRODUCTS  -------- */}
        {categoryProducts.length ? (
          <div className="grid mb-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found in this category.</p>
        )}

        {/* --------  OUTRO  -------- */}
        {content.outro && (
          <div dangerouslySetInnerHTML={{ __html: toHtml(content.outro) }} />
        )}
      </div>
    </>
  );
}

/* ---------------------------------------------------------- */
/*  static paths / props  (unchanged)                        */
/* ---------------------------------------------------------- */
export async function getStaticPaths() {
  const set = new Set();
  products.forEach((p) =>
    p.categories?.forEach((c) => set.add(c.trim().toLowerCase()))
  );
  const slugs = Array.from(set);
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const slug = params.slug.toLowerCase();
  const filtered = products.filter((p) =>
    p.categories?.some((c) => c.toLowerCase() === slug)
  );
  return { props: { products: filtered, slug: params.slug } };
}