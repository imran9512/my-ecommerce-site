// src/pages/sitemap.xml.js
import products from '@/data/products'; // default export

export default function Sitemap() {
  // Required empty export for Next.js pages
}

export async function getServerSideProps({ res }) {
  const host = 'https://my-ecommerce-site-gamma.vercel.app';

  /* 1. static pages */
  const staticUrls = ['', '/shop', '/search', '/cart', '/contact', '/faq', '/help'];

  /* 2. products */
  const productUrls = products.map(p => `/products/${p.slug}`);

  /* 3. unique categories */
  const categorySet = new Set();
  products.forEach(p =>
    p.categories.forEach(c => categorySet.add(c.toLowerCase()))
  );
  const categoryUrls = [...categorySet].map(c => `/category/${c}`);

  /* 4. build XML */
  const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(u => `<url><loc>${host}${u}</loc><changefreq>weekly</changefreq></url>`)
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(xml);
  res.end();

  return { props: {} };
}