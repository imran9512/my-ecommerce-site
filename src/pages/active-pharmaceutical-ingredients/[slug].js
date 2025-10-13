import Head from 'next/head';
import ProductCard from '@/components/ProductCard';
import products from '@/data/products';
import saltContent from '@/data/salt';
import { SITE_URL } from '@/data/constants';

export default function SaltPage({ products: saltProducts, slug }) {
    const content = saltContent[slug] || {};

    const toHtml = (field) =>
        Array.isArray(field) ? field.join('') : (field || '');

    const saltSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: content.metaTitle || slug,
        itemListElement: saltProducts.map((p, idx) => ({
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

    const canonical = `${SITE_URL}/active-pharmaceutical-ingredients/${slug}`;

    return (
        <>
            <Head>
                <title>{content.metaTitle || slug}</title>
                <meta name="description" content={content.metaDesc || ''} />
                <link rel="canonical" href={canonical} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(saltSchema) }}
                />
            </Head>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4 mt-4 text-center capitalize">
                    {slug.replace(/-/g, ' ')}
                </h1>

                {content.intro && (
                    <div dangerouslySetInnerHTML={{ __html: toHtml(content.intro) }} />
                )}

                {saltProducts.length ? (
                    <div className="grid mb-4 mt-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {saltProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">
                        No products found for this active ingredient...
                    </p>
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
    const saltSlugs = new Set();
    products.forEach((p) => {
        if (p.ActiveSalt) {
            // normalize: lowercase + dash
            saltSlugs.add(
                p.ActiveSalt.trim().toLowerCase().replace(/\s+/g, '-')
            );
        }
    });

    // content file k keys bhi same tarike se normalize karain
    Object.keys(saltContent).forEach((k) =>
        saltSlugs.add(k.trim().toLowerCase().replace(/\s+/g, '-'))
    );

    return {
        paths: Array.from(saltSlugs).map((slug) => ({ params: { slug } })),
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    // jo bhi URL se aaya hai use bhi normalize karain
    const requested = params.slug.toLowerCase().replace(/\s+/g, '-');
    const filtered = products.filter(
        (p) =>
            p.ActiveSalt &&
            p.ActiveSalt.toLowerCase().replace(/\s+/g, '-') === requested
    );

    const hasContent = !!saltContent[requested];
    if (filtered.length === 0 && !hasContent) {
        return { notFound: true };
    }

    return { props: { products: filtered, slug: requested } };
}