// src/pages/products/[slug].js
import Head from 'next/head';
import ProductDetail from '@/components/ProductDetail';
import TabsSection from '@/components/TabsSection';
import RelatedProducts from '@/components/RelatedProducts';
import products from '@/data/products';


export default function ProductPage({ product, related }) {
  return (
    <>
      {/* ---------- SEO Meta ---------- */}
      <Head>
        <title>{product.metaTitle}</title>
        <meta name="description" content={product.metaDescription} />
        <meta property="og:title" content={product.metaTitle} />
        <meta property="og:description" content={product.metaDescription} />
        <meta property="og:image" content={product.images[0]} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />
        <TabsSection product={product} />
        <RelatedProducts products={related} />
      </div>
    </>
  );
}

/* ---------- Build paths via slugs ---------- */
export async function getStaticPaths() {
  const paths = products.map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: false };
}

/* ---------- Fetch product via slug ---------- */
export async function getStaticProps({ params }) {
  const product = products.find((p) => p.slug === params.slug && p.active);
  //const product = products.find((p) => p.slug === params.slug);
  if (!product) return { notFound: true };

  const related = products.filter((p) => product.related?.includes(p.id));
  return { props: { product, related }, revalidate: false };
}