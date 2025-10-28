// src/pages/active-pharmaceutical-ingredients/[slug].js
import Head from 'next/head';
import ProductCard from '@/components/ProductCard';
import products from '@/data/products';
import saltContent from '@/data/salt';
import { SITE_URL } from '@/data/constants';

export default function SaltPage({ products: saltProducts, slug }) {
    const content = saltContent[slug] || {};
    const toHtml = (field) =>
        Array.isArray(field) ? field.join('') : (field || '');

    // Filter active products for table and schema
    const activeProducts = saltProducts.filter(p => p.active === "true");

    // PriceRow component for table
    const PriceRow = ({ product }) => {
        const hasDiscount = !!product.qtyDiscount?.length;
        const getLowestPrice = () => {
            if (!hasDiscount || !product.price) return product.price;
            // Assuming first discount range's 'end' is the max discount percentage
            const disc = product.qtyDiscount[0];
            const maxDisc = disc?.end / 100 || 0;
            return Math.round(product.price * (1 - maxDisc));
        };
        const lowestPrice = getLowestPrice();

        if (!product.price)
            return (
                <p className="motion-safe:animate-bounce text-xs text-center mx-auto mt-1 w-max px-2 py-0.5 rounded-full bg-yellow-300 font-semibold text-gray-800">
                    Contact Us to buy
                </p>
            );
        return (
            <>
                <p className="text-xs">Rs: {product.price.toLocaleString()}</p>
                {hasDiscount && (
                    <p className="text-xs">
                        As low as{' '}
                        <span className="shadow text-blue-800 font-semibold">
                            Rs {lowestPrice.toLocaleString()}
                        </span>
                    </p>
                )}
            </>
        );
    };

    // getLowestPrice function for schema
    const getLowestPrice = (product) => {
        const hasDiscount = !!product.qtyDiscount?.length;
        if (!hasDiscount || !product.price) return product.price;
        const disc = product.qtyDiscount[0];
        const maxDisc = disc?.end / 100 || 0;
        return Math.round(product.price * (1 - maxDisc));
    };

    // Simplified schema: Minimal fixes for errors, focus on comparison
    const saltSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',  // Keep for Carousels (if wanted)
        name: content.metaTitle || `${slug.replace(/-/g, ' ')} Medicines`,
        description: `${slug.replace(/-/g, ' ')}'s brands comparison and availability.`,
        numberOfItems: activeProducts.length,
        itemListElement: activeProducts.map((p, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            item: {
                '@type': 'Drug',
                '@id': `${SITE_URL}/products/${p.slug}`,
                name: p.name,  // Only products
                url: `${SITE_URL}/products/${p.slug}`,
                image: p.ogImg ? `${SITE_URL}/og/${p.ogImg}` : undefined,
                brand: { '@type': 'Brand', name: p.brand },
                activeIngredient: p.ActiveSalt,
                dosageForm: p.dosageForm,
                drugUnit: p.tabsMg,
                aggregateRating: {  // Added: Fixes Product Snippets & Carousels errors
                    '@type': 'AggregateRating',
                    ratingValue: p.rating || '0',  // Use p.rating, default 0
                    reviewCount: p.reviewCount || 0  // Use p.reviewCount, default 0
                },
                offers: {
                    '@type': 'Offer',
                    price: p.price || 0,
                    priceCurrency: 'PKR',
                    availability: p.stock > 0 ? 'InStock' : 'OutOfStock',
                    priceValidUntil: '2030-12-31'
                },
                additionalProperty: [  // Table comparison properties
                    { '@type': 'PropertyValue', name: 'Origin', value: p.origin },
                    { '@type': 'PropertyValue', name: 'Quality', value: p.quality },
                    { '@type': 'PropertyValue', name: 'Pack', value: p.tabsMg },
                    { '@type': 'PropertyValue', name: 'Strip Stock', value: p.stripStock ? 'Available' : 'N/A' }
                ]
                // No offers/review – avoid extra snippets
            }
        })),
    };

    // Table schema (unchanged, for comparison indication)
    const tableSchema = {
        '@context': 'https://schema.org',
        '@type': 'Table',
        about: { '@type': 'DrugClass', name: 'Medicines Comparison' },
        name: `${slug.replace(/-/g, ' ')} Products Comparison Table`,
        description: 'Comparison table showing medicines by name, brand, origin, quality, pack size, price, and strip availability.',
        cssSelector: '.table-scroll'
    };

    const canonical = `${SITE_URL}/active-pharmaceutical-ingredients/${slug}`;
    return (
        <>
            <Head>
                <title>{content.metaTitle || slug}</title>
                <meta name="description" content={`${slug.replace(/-/g, ' ').toUpperCase()}'s brands comparison and availability - Buy genuine medicines online with same active ingredient at best prices.`} />
                <link rel="canonical" href={canonical} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(saltSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(tableSchema) }}
                />
                {/* Custom CSS for permanent horizontal scrollbar visibility */}
                <style jsx global>{`
                    .table-scroll::-webkit-scrollbar {
                        height: 8px;
                    }
                    .table-scroll::-webkit-scrollbar-track {
                        background: #f1f5f9;
                        border-radius: 4px;
                    }
                    .table-scroll::-webkit-scrollbar-thumb {
                        background: #cbd5e1;
                        border-radius: 4px;
                    }
                    .table-scroll::-webkit-scrollbar-thumb:hover {
                        background: #94a3b8;
                    }
                `}</style>
            </Head>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4 mt-4 text-center capitalize">
                    {slug.replace(/-/g, ' ')}
                </h1>
                {content.intro && (
                    <div dangerouslySetInnerHTML={{ __html: toHtml(content.intro) }} />
                )}
                {/* Dynamic responsive table in intro section */}
                {activeProducts.length > 0 && (
                    <div className="overflow-x-auto mb-4 shadow-lg rounded-lg table-scroll" style={{ WebkitOverflowScrolling: 'touch' }}>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pack</th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strip</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {activeProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-2 py-1 whitespace-nowrap text-xs font-medium text-gray-900">{p.name}</td>
                                        <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">{p.brand}</td>
                                        <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">{p.origin}</td>
                                        <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">{p.quality}</td>
                                        <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">{p.tabsMg}</td>
                                        <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-900">
                                            <PriceRow product={p} />
                                        </td>
                                        <td className="px-4 py-1 whitespace-nowrap text-sm text-gray-900">
                                            {p.stripStock ? <span className="text-green-600 font-bold text-sm">✓</span> : <span className="text-gray-400">-</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
/*  static paths / props                                      */
/* ---------------------------------------------------------- */
const getIndividualSalts = (activeSalt) => {
    if (!activeSalt) return [];
    let salts;
    if (Array.isArray(activeSalt)) {
        salts = activeSalt;
    } else {
        salts = activeSalt.split(',').map(s => s.trim()).filter(s => s);
    }
    return salts.map(s => s.toLowerCase().trim().replace(/\s+/g, '-'));
};

export async function getStaticPaths() {
    const saltSlugs = new Set();

    products.forEach((p) => {
        const individuals = getIndividualSalts(p.ActiveSalt);
        individuals.forEach(slug => saltSlugs.add(slug));
    });

    // content file keys (split if comma, but probably single)
    Object.keys(saltContent).forEach((k) => {
        const individuals = getIndividualSalts(k); // Use same function for safety
        individuals.forEach(slug => saltSlugs.add(slug));
    });

    return {
        paths: Array.from(saltSlugs).map((slug) => ({ params: { slug } })),
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const requested = params.slug; // Already processed in path

    const filtered = products.filter((p) => {
        const individuals = getIndividualSalts(p.ActiveSalt);
        return individuals.includes(requested);
    });

    const hasContent = !!saltContent[requested];
    if (filtered.length === 0 && !hasContent) {
        return { notFound: true };
    }

    return { props: { products: filtered, slug: requested } };
}