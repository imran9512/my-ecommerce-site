// src/pages/index.js
import Link from 'next/link';
import Head from 'next/head';
import { SITE_NAME, SITE_URL } from '@/data/constants';
import products from '@/data/products';

const Home = () => {
  // Compute unique salts and brands
  const uniqueSalts = [...new Set(products
    .filter(p => p.ActiveSalt)
    .map(p => p.ActiveSalt.trim().toLowerCase().replace(/\s+/g, '-'))
  )].slice(0, 9);

  const uniqueBrands = [...new Set(products
    .filter(p => p.brand)
    .map(p => p.brand.trim().toLowerCase().replace(/\s+/g, '-'))
  )].slice(0, 9);

  // Schema: BreadcrumbList for detection (full list, separate for salts/brands)
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      // Salts as first group (alag section)
      ...uniqueSalts.map((salt, idx) => ({
        '@type': 'ListItem',
        position: 2 + idx,
        name: `Active Ingredient: ${salt.replace(/-/g, ' ')}`,
        item: `${SITE_URL}/active-pharmaceutical-ingredients/${salt}`
      })),
      // Brands as second group (alag, after salts)
      ...uniqueBrands.map((brand, idx) => ({
        '@type': 'ListItem',
        position: 2 + uniqueSalts.length + idx,
        name: `Brand: ${brand.replace(/-/g, ' ')}`,
        item: `${SITE_URL}/brand/${brand}`
      }))
    ]
  };

  return (
    <>
      <Head>
        <title>{SITE_NAME} – Empowering Wellbeing for Men & Women</title>
        <meta
          name="description"
          content="Aap Ki Sehat – discreet, effective health solutions for every body and mind. Shop confidently with plain packaging & secure payment."
        />
        <link rel="canonical" href={SITE_URL} />
        {uniqueSalts.length > 0 || uniqueBrands.length > 0 ? (  // Only add schema if data exists
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
          />
        ) : null}
      </Head>
      {/* Active Ingredients Section - At the start */}
      <section className="mt-16">
        <div className="max-w-7xl mx-auto px-2">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Active Ingredients</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {uniqueSalts.map((salt) => (
              <Link
                key={salt}
                href={`/active-pharmaceutical-ingredients/${salt}`}
                className="w-fit px-3 py-2 text-sm font-medium text-gray-700 bg-green-50 backdrop-blur-md border border-white/20 shadow-lg rounded-lg hover:shadow-x2 hover:bg-blue-100 transition-all duration-200 no-underline whitespace-nowrap"
              >
                {salt.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section - Right after salts */}
      <section className="mt-2">
        <div className="max-w-7xl mx-auto px-2">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Popular Brands</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {uniqueBrands.map((brand) => (
              <Link
                key={brand}
                href={`/brand/${brand}`}
                className="w-fit px-3 py-2 text-sm font-medium text-gray-700 bg-green-50 backdrop-blur-md border border-white/20 shadow-lg rounded-lg hover:shadow-x2 hover:bg-blue-100 transition-all duration-200 no-underline whitespace-nowrap"
              >
                {brand.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-sky-700 mb-4">
          Empowering Wellbeing for Men and Women
        </h1>

        <p className="text-lg text-gray-700 leading-relaxed">
          🌿 Welcome to <strong className="text-sky-600">{SITE_NAME}</strong> — We’re here whenever you need a quiet, judgment-free space to look after your body and mind. From everyday questions to the things you’d rather not say out loud, our hand-picked guides and products are chosen to help you feel confident, comfortable and in control.
        </p>

        <p className="mt-4 text-gray-700 leading-relaxed">
          From everyday physical concerns to the issues you keep private, we offer discreet, effective solutions you can trust. Mental-health support is part of the journey too—products you can use regularly to feel balanced, confident, and in control.
        </p>

        <p className="mt-4 text-gray-700 leading-relaxed">
          We prioritise discretion. Your privacy is our priority. Shop at your own pace, pay without worry, and receive every order in plain, unmarked packaging that keeps your choices between you and your doorstep. At <strong>{SITE_NAME}</strong> we’re here to give you the straightforward information and practical tools you need to feel steady, strong, and in charge of your * wellbeing.
        </p>

        <Link href="/shop" className="mt-8 inline-block bg-sky-600 text-white px-6 py-3 rounded-md hover:bg-sky-700">
          Shop Now
        </Link>
      </div>
    </>
  );
};

export default Home;