import { SITE_URL } from '@/data/constants';
import { faqsByProduct } from '@/data/faq';

export function generateProductSchemas(product) {
    // Base schema same as tera code...
    const baseSchema = {
        '@context': 'https://schema.org',
        '@type': ['Product', 'Drug'],
        name: product.name,
        sku: product.sku,
        image: [
            `${SITE_URL}/og/${product.ogImg}`,
            ...product.images.map((img) => `${SITE_URL}${img}`)
        ],
        description: product.metaDescription,
        brand: { '@type': 'Brand', name: product.brand },
        manufacturer: { '@type': 'Organization', name: product.brand },
        proprietaryName: product.name,
        activeIngredient: product.ActiveSalt,
        warning: 'Consult a healthcare professional before use. Not for use without prescription.',
        prescriptionStatus: 'https://schema.org/PrescriptionOnly',
        isAvailableGenerically: true,
        legalStatus: 'https://schema.org/DrugLegalStatus.PrescriptionDrug',
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'PKR',
            availability: product.stock === 0 ? 'https://schema.org/OutOfStock' : product.stock < 5 ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/InStock',
            priceValidUntil: '2035-12-31',
            shippingDetails: { /* Same as tera... */ },
            hasMerchantReturnPolicy: { /* Same as tera... */ }
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount ?? 0,
        },
        review: product.reviews?.length
            ? product.reviews
                .filter((review) => review.body && review.rating)
                .map((review) => ({
                    '@type': 'Review',
                    reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: 5 },
                    author: { '@type': 'Person', name: review.author },
                    reviewBody: review.body,
                    datePublished: review.date ? new Date(review.date).toISOString() : undefined
                }))
                .filter((rev) => rev.datePublished || true)
            : []
    };

    let schema = { ...baseSchema };

    // Conditional fields same as tera (medicalIndication, nonProprietaryName, etc.)
    if (product.medicalIndication && product.medicalIndication.name && product.medicalIndication.code) {
        schema = { ...schema, medicalIndication: { /* Same... */ } };
    }
    const nonPropName = product.nonProprietaryName || 'Methylphenidate Hydrochloride';
    if (nonPropName) schema = { ...schema, nonProprietaryName: nonPropName };

    const dosageForm = product.dosageForm || 'Tablet';
    if (dosageForm) schema = { ...schema, dosageForm: dosageForm };

    const adminRoute = product.administrationRoute || 'Oral';
    if (adminRoute) schema = { ...schema, administrationRoute: adminRoute };

    const drugClass = product.drugClass || 'Central Nervous System Stimulant';
    if (drugClass) schema = { ...schema, drugClass: drugClass };

    const pregnancyCat = product.pregnancyCategory || 'https://schema.org/DrugPregnancyCategory.C';
    if (pregnancyCat) schema = { ...schema, pregnancyCategory: pregnancyCat };

    // Breadcrumb schema same...
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: product.categories?.[0] || 'Products', item: `${SITE_URL}/category/${encodeURIComponent((product.categories?.[0] || 'products').toLowerCase().replace(/\s+/g, '-'))}` },
            { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}/products/${product.slug}` }
        ]
    };

    // FAQ same...
    const faqSchema = (faqsByProduct[product.id] || []).length
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: (faqsByProduct[product.id] || []).map((item) => ({
                '@type': 'Question',
                name: item.q?.trim(),
                acceptedAnswer: { '@type': 'Answer', text: item.a?.trim() },
            })),
        }
        : null;

    return { productSchema: schema, breadcrumbSchema, faqSchema };
}