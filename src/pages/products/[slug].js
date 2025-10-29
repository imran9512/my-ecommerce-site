// src/pages/products/[slug].js
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { generateProductSchemas } from '@/lib/schema';  // NEW: Schema utility import
import products from '@/data/products';
import { SITE_URL } from '@/data/constants';
import { faqsByProduct } from '@/data/faq';
import { productDesc } from '@/data/productDesc';
import { reviews as allReviews } from '@/data/reviews';

// Dynamic components (NEW: Initial load fast karega, blocking kam)
const ProductDetail = dynamic(() => import('@/components/ProductDetail'), {
  loading: () => <div className="animate-pulse h-64 bg-gray-200">Loading product...</div>,
  ssr: false  // Agar heavy client-only hai to
});
const TabsSection = dynamic(() => import('@/components/TabsSection'), {
  loading: () => <div className="animate-pulse h-48 bg-gray-200">Loading tabs...</div>
});
const RelatedProducts = dynamic(() => import('@/components/RelatedProducts'), {
  loading: () => <div className="animate-pulse h-32 bg-gray-200">Loading related...</div>
});

export default function ProductPage({ product, related, schema, breadcrumbSchema, faqSchema }) {
  const canonical = product.canon
    ? `${SITE_URL}/${product.canon}`
    : `${SITE_URL}/products/${product.slug}`;

  return (
    <>
      <Head>
        <title>{product.metaTitle}</title>
        <meta name="description" content={product.metaDescription} />
        <meta name="keywords" content={product.tags?.join(', ')} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={product.metaTitle} />
        <meta property="og:description" content={product.metaDescription} />
        <meta property="og:image" content={`${SITE_URL}/og/${product.ogImg}`} />
        <meta property="og:url" content={`${SITE_URL}/products/${product.slug}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${SITE_URL}/og/${product.ogImg}`} />
        <link
          rel="preload"
          as="image"
          href={product.images[0]}
          fetchPriority="high"
        />
        {/* NEW: Schema props se direct use */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: faqSchema }}
          />
        )}
      </Head>

      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />
        <TabsSection product={product} faqItems={faqsByProduct[product.id] || []} />
        <RelatedProducts products={related} />
      </div>
    </>
  );
}

/* ---------- Reviews pulling aur Schema Generation ---------- */
export async function getStaticProps({ params }) {
  const product = products.find((p) => p.slug === params.slug && p.active);
  if (!product) return { notFound: true };

  // merge editorial content (fallback to empty object)
  const content = productDesc[product.id] || {};

  if (!productDesc[product.id]) {
    console.warn('Missing editorial data for product.id:', product.id);
  }

  const mergedProduct = { ...product, ...content };

  // Filter and transform reviews for this product
  const productReviews = allReviews
    .filter((r) => r.productId === mergedProduct.id)
    .map((r) => ({
      author: r.name,
      body: r.comment,
      rating: r.rating,
      date: r.date  // Optional: for datePublished in schema
    }));

  // Attach to merged product
  mergedProduct.reviews = productReviews;

  const related = products.filter((p) => product.related?.includes(p.id));

  // NEW: Schema generate karo utility se
  const { productSchema: productSchemaObj, breadcrumbSchema: breadcrumbSchemaObj, faqSchema: faqSchemaObj } = generateProductSchemas(mergedProduct);

  return {
    props: {
      product: mergedProduct,
      related,
      schema: JSON.stringify(productSchemaObj),  // Stringify for Head
      breadcrumbSchema: JSON.stringify(breadcrumbSchemaObj),
      faqSchema: JSON.stringify(faqSchemaObj)
    },
    revalidate: 60,  // NEW: ISR for fresh data without full rebuild
  };
}

/* ---------- Build paths via slugs ---------- */
export async function getStaticPaths() {
  const paths = products
    .filter((p) => p.slug && p.slug.trim() !== '') // Filter out empty/invalid slugs
    .map((p) => ({ params: { slug: p.slug } }));
  return {
    paths,
    fallback: 'blocking' // Changed to 'blocking' for dynamic handling without build fails
  };
}