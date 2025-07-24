// pages/product/[id].js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export async function getStaticPaths() {
  const products = await import('../../public/products.json').then(m => m.default);
  const paths = products.map(p => ({ params: { id: String(p.id) } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const products = await import('../../public/products.json').then(m => m.default);
  const product = products.find(p => p.id === Number(params.id));
  if (!product) return { notFound: true };
  return { props: { product }, revalidate: 60 };
}

export default function ProductPage({ product }) {
  return (
    <>
      <Head>
        <title>{product.title} – My E-commerce</title>
        <meta name="description" content={product.desc} />
        {/* JSON-LD product schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.title,
              image: `https://my-ecommerce-site-gamma.vercel.app${product.image}`,
              description: product.desc,
              sku: product.id,
              offers: {
                '@type': 'Offer',
                price: product.price,
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock'
              }
            })
          }}
        />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Image
              src={product.image}
              alt={product.title}
              width={600}
              height={600}
              className="rounded-lg shadow"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-2xl font-semibold text-sky-600 mb-4">${product.price}</p>
            <p className="mb-6">{product.desc}</p>

            {/* Add to Cart button */}
            <button
              onClick={() => addItem(product)}
  className="bg-sky-600 text-white px-6 py-2 rounded"
>
  Add to Cart
            </button>

            <Link href="/shop" className="ml-4 text-gray-600 underline">
              ← Back to Shop
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}