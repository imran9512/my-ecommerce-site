// src/pages/category/[slug].js
import Head from 'next/head';
import ProductCard from '@/components/ProductCard';
import products from '@/data/products';
import categoryContent from '@/data/categoryContent';
import { SITE_URL } from '@/data/constants';

export default function CategoryPage({ products, slug }) {
  const content = categoryContent[slug] || {};
  const catSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',          // <- root type Google recognises
    name: content.metaTitle,
    itemListElement: products.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/products/${p.slug}`,
      name: p.name,
      image: `${SITE_URL}${p.images[0]}`,   // <- clean, no encodeURIComponent
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
        <h1 className="text-3xl font-bold mb-4 capitalize">
          {slug.replace('-', ' ')}
        </h1>

        {/* INTRO */}
        {content.intro && (
          <div dangerouslySetInnerHTML={{ __html: content.intro }} />
        )}

        {/* PRODUCTS */}
        {products.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found in this category.</p>
        )}

        {/* OUTRO */}
        {content.outro && (
          <div dangerouslySetInnerHTML={{ __html: content.outro }} />
        )}
      </div>
    </>
  );
}

/* static paths & props stay the same */
export async function getStaticPaths() {
  const set = new Set();
  products.forEach(p =>
    p.categories?.forEach(c => set.add(c.trim().toLowerCase()))
  );
  const slugs = Array.from(set);
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const slug = params.slug.toLowerCase();
  const filtered = products.filter((p) =>
    p.categories?.some(c => c.toLowerCase() === slug)
  );
  return { props: { products: filtered, slug: params.slug } };
}