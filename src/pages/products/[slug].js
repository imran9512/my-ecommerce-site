// src/pages/products/[slug].js
import Head from 'next/head';
import ProductDetail from '@/components/ProductDetail';
import TabsSection from '@/components/TabsSection';
import RelatedProducts from '@/components/RelatedProducts';
import products from '@/data/products';
import { SITE_URL } from '@/data/constants';
import { faqsByProduct } from '@/data/faq';
import { productDesc } from '@/data/productDesc';
import { reviews as allReviews } from '@/data/reviews';

export default function ProductPage({ product, related }) {
  /* ---------- Product Schema ---------- */
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Drug'],
    name: product.name,
    sku: product.sku,
    image: [
      `${SITE_URL}/og/${product.ogImg}`,
      ...product.images.map((img) => `${SITE_URL}${img}`) // flatten
    ],
    description: product.metaDescription,
    brand: { '@type': 'Brand', name: product.brand },
    manufacturer: { '@type': 'Organization', name: product.brand },
    proprietaryName: product.name,
    activeIngredient: product.ActiveSalt,
    warning: 'Consult a healthcare professional before use. Not for use without prescription.',
    prescriptionStatus: 'https://schema.org/PrescriptionOnly',
    isAvailableGenerically: true,
    legalStatus: 'https://schema.org/DrugLegalStatus.PrescriptionDrug', // For controlled substances like this
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
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY'
          }
        },
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 150,
          currency: 'PKR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'PK',
        }
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory:
          'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
        applicableCountry: "PK",
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount ?? 0,
    },
    review: product.reviews?.length
      ? product.reviews
        .filter((review) => review.body && review.rating)  // Ensure valid reviews only
        .map((review) => ({
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating,
            bestRating: 5
          },
          author: { '@type': 'Person', name: review.author },
          reviewBody: review.body,
          datePublished: review.date ? new Date(review.date).toISOString() : undefined  // Optional ISO date
        }))
        .filter((rev) => rev.datePublished || true)  // Exclude if date is invalid, but keep otherwise
      : []
  };

  let schema = { ...baseSchema };

  // medicalIndication: Include only if product provides the data
  if (product.medicalIndication && product.medicalIndication.name && product.medicalIndication.code) {
    schema = {
      ...schema,
      medicalIndication: {
        '@type': 'MedicalCondition',
        name: product.medicalIndication.name,
        code: {
          '@type': 'MedicalCode',
          codeValue: product.medicalIndication.code.codeValue,
          codingSystem: product.medicalIndication.code.codingSystem
        }
      }
    };
  }

  // nonProprietaryName: Include if provided or universal default
  const nonPropName = product.nonProprietaryName || 'Methylphenidate Hydrochloride';
  if (nonPropName) {
    schema = {
      ...schema,
      nonProprietaryName: nonPropName
    };
  }

  // dosageForm: Include if provided or universal default
  const dosageForm = product.dosageForm || 'Tablet';
  if (dosageForm) {
    schema = {
      ...schema,
      dosageForm: dosageForm
    };
  }

  // administrationRoute: Include if provided or universal default
  const adminRoute = product.administrationRoute || 'Oral';
  if (adminRoute) {
    schema = {
      ...schema,
      administrationRoute: adminRoute
    };
  }

  // drugClass: Include if provided or universal default
  const drugClass = product.drugClass || 'Central Nervous System Stimulant';
  if (drugClass) {
    schema = {
      ...schema,
      drugClass: drugClass
    };
  }

  // pregnancyCategory: Include if provided or universal default
  const pregnancyCat = product.pregnancyCategory || 'https://schema.org/DrugPregnancyCategory.C';
  if (pregnancyCat) {
    schema = {
      ...schema,
      pregnancyCategory: pregnancyCat
    };
  }

  /* Breadcrumb Schema for Better Navigation SEO ---------- */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.categories?.[0] || 'Products', // Dynamic first category
        item: `${SITE_URL}/category/${encodeURIComponent((product.categories?.[0] || 'products').toLowerCase().replace(/\s+/g, '-'))}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${SITE_URL}/products/${product.slug}`
      }
    ]
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
          href={`${SITE_URL}${product.images[0]}`}
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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

/* ---------- Reviews pulling ---------- */
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
  return {
    props: { product: mergedProduct, related },
    revalidate: false,
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