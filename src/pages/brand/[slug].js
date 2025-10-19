import Head from 'next/head';
import ProductCard from '@/components/ProductCard';
import products from '@/data/products';
import brandContent from '@/data/brand';
import { SITE_URL } from '@/data/constants';

export default function BrandPage({ products: brandProducts, slug }) {
    const content = brandContent[slug] || {};

    const toHtml = (field) =>
        Array.isArray(field) ? field.join('') : (field || '');

    const canonical = `${SITE_URL}/brand/${slug}`;

    const brandSchema = {
        '@context': 'https://schema.org',
        '@type': 'Brand',
        name: content.metaTitle || slug.replace(/-/g, ' '),
        description: content.metaDesc || `${slug.replace(/-/g, ' ')}'s range of medicines with different active ingredients. Buy genuine products online.`,
        url: canonical,
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${slug.replace(/-/g, ' ')} Medicines`,
            itemListElement: brandProducts.map((p, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                item: {
                    '@type': 'Drug',
                    name: p.name,
                    url: `${SITE_URL}/products/${p.slug}`,
                    image: `${SITE_URL}${p.images[0]}`,
                    brand: {
                        '@type': 'Brand',
                        name: p.brand
                    },
                    activeIngredient: p.ActiveSalt || 'Generic',
                    dosageForm: p.dosageForm || 'Tablet',
                    drugUnit: p.tabsMg || 'N/A',
                    offers: {
                        '@type': 'Offer',
                        price: p.price || 0,
                        priceCurrency: 'PKR',
                        availability: p.stock > 0 ? 'InStock' : 'OutOfStock',
                        priceValidUntil: '2030-12-31'
                    }
                }
            }))
        }
    };

    return (
        <>
            <Head>
                <title>{content.metaTitle || slug}</title>
                <meta name="description" content={content.metaDesc || `${slug.replace(/-/g, ' ')}'s range of medicines with different active ingredients. Buy genuine products online.`} />
                <link rel="canonical" href={canonical} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }}
                />
            </Head>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4 mt-4 text-center capitalize">
                    {slug.replace(/-/g, ' ')}
                </h1>

                {content.intro && (
                    <div dangerouslySetInnerHTML={{ __html: toHtml(content.intro) }} />
                )}

                {brandProducts.length ? (
                    <div className="grid mb-4 mt-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {brandProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No products found for this brand...</p>
                )}

                <div className="">
                    {content.outro && (
                        <div dangerouslySetInnerHTML={{ __html: toHtml(content.outro) }} />
                    )}
                </div>
            </div>
        </>
    );
}

/* ---------------------------------------------------------- */
/*  static paths / props                                     */
/* ---------------------------------------------------------- */
export async function getStaticPaths() {
    const brandSlugs = new Set();

    products.forEach((p) => {
        if (!p.brand) return;

        // string OR array → array
        const brands = Array.isArray(p.brand) ? p.brand : [p.brand];

        brands.forEach((b) =>
            brandSlugs.add(b.trim().toLowerCase().replace(/\s+/g, '-'))
        );
    });

    Object.keys(brandContent).forEach((k) =>
        brandSlugs.add(k.trim().toLowerCase().replace(/\s+/g, '-'))
    );

    return {
        paths: Array.from(brandSlugs).map((slug) => ({ params: { slug } })),
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const requested = params.slug.toLowerCase().replace(/\s+/g, '-');

    const filtered = products.filter((p) => {
        if (!p.brand) return false;

        const brands = Array.isArray(p.brand) ? p.brand : [p.brand];

        return brands.some((b) =>
            b.trim().toLowerCase().replace(/\s+/g, '-') === requested
        );
    });

    const hasContent = !!brandContent[requested];
    if (filtered.length === 0 && !hasContent) return { notFound: true };

    return { props: { products: filtered, slug: requested } };
}