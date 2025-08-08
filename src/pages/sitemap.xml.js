// src/pages/sitemap.xml.js
import products from '@/data/products';

export default function Sitemap() {}

export async function getServerSideProps({ res }) {
  const host = process.env.SITE_URL; // ← dynamic & correct

  const staticUrls = ['', '/shop', '/search', '/cart', '/contact', '/faq', '/help'];
  const productUrls = products.map(p => `/products/${p.slug}`);
  const categorySet = new Set();
  products.forEach(p => p.categories.forEach(c => categorySet.add(c.toLowerCase())));
  const categoryUrls = [...categorySet].map(c => `/category/${c}`);

  const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(u => `<url><loc>${host}${u}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`)
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(xml);
  res.end();
  return { props: {} };
}