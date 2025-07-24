// pages/shop.js
import Head from 'next/head';
import ProductCard from '../components/ProductCard';

export async function getStaticProps() {
  // read static JSON (commit this file)
  const products = await import('../public/products.json').then(m => m.default);
  return { props: { products }, revalidate: 60 };
}

export default function Shop({ products }) {
  return (
    <>
      <Head>
        <title>Shop – My E-commerce</title>
        <meta name="description" content="Browse our full catalog" />
        {/* JSON-LD schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: products.map((p, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                item: {
                  '@type': 'Product',
                  name: p.title,
                  image: p.image,
                  description: p.desc,
                  url: `https://my-ecommerce-site-gamma.vercel.app/product/${p.id}`,
                  offers: {
                    '@type': 'Offer',
                    price: p.price,
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock'
                  }
                }
              }))
            })
          }}
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Products</h1>

        {/* simple filter */}
        <div className="mb-4">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Search products…"
            onChange={(e) => {/* live filter later */}}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </main>
    </>
  );
}