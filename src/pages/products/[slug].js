// src/pages/products/[slug].js
import Head from 'next/head';
import ProductDetail from '@/components/ProductDetail';
import TabsSection from '@/components/TabsSection';
import RelatedProducts from '@/components/RelatedProducts';
import products from '@/data/products';
import { SITE_URL } from '@/data/constants';
import { faqsByProduct } from '@/data/faq';
import { productDesc } from '@/data/productDesc';

export default function ProductPage({ product, related }) {
  /* ---------- merged editorial data already in product prop ---------- */

  /* ---------- Product Schema ---------- */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    image: product.images.map((img) => `${SITE_URL}${img}`),
    description: product.metaDescription,   // ← now comes from productDesc
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'PKR',
      availability:
        product.stock === 0
          ? 'https://schema.org/OutOfStock'
          : product.stock < 5
            ? 'https://schema.org/LimitedAvailability'
            : 'https://schema.org/InStock',
      priceValidUntil: '2035-12-31',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount ?? 0,
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: 150,
        currency: 'PKR',
      },
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'PK',
      },
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 7,
      returnMethod: 'https://schema.org/ReturnByMail',
    },
  };

  /* ---------- FAQ Schema ---------- */
  const faqSchema = (faqsByProduct[product.id] || []).length
    ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (faqsByProduct[product.id] || []).map((item) => ({
        '@type': 'Question',
        name: item.q?.trim(),
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a?.trim(),
        },
      })),
    }
    : null;

  const canonical = product.canon
    ? `${SITE_URL}/${product.canon}`
    : `${SITE_URL}/products/${product.slug}`;
  return (
    <>
      <Head>
        <title>{product.metaTitle}</title>
        <meta name="description" content={product.metaDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={product.metaTitle} />
        <meta property="og:description" content={product.metaDescription} />
        <meta property="og:image" content={product.images[0]} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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

/* ---------- Build paths via slugs ---------- */
export async function getStaticPaths() {
  const paths = products.map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: false };
}

/* ---------- Fetch product via slug + merge editorial ---------- */
export async function getStaticProps({ params }) {
  const product = products.find((p) => p.slug === params.slug && p.active);
  if (!product) return { notFound: true };

  // merge editorial content (fallback to empty object)
  const content = productDesc[product.id] || {};

  if (!productDesc[product.id]) {
    console.warn('Missing editorial data for product.id:', product.id);
  }

  const mergedProduct = { ...product, ...content };

  const related = products.filter((p) => product.related?.includes(p.id));
  return {
    props: { product: mergedProduct, related },
    revalidate: false,
  };
}