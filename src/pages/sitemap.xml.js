// src/pages/sitemap.xml.js
import products from '@/data/products';

export default function Sitemap() { }

export async function getServerSideProps({ res }) {
  const host = process.env.SITE_URL || 'https://www.aapkisehat.com';

  /* ---------- 1.  active products ---------- */
  const activeSlugs = products
    .filter(p => p.active)
    .map(p => `/products/${p.slug}`);

  /* ---------- 2.  categories ---------- */
  const categorySlugs = [
    ...new Set(
      products
        .flatMap(p => p.categories || [])
        .map(c => c.toLowerCase().trim().replace(/\s+/g, '-'))
    )
  ].map(c => `/category/${c}`);

  /* ---------- 3.  brands ---------- */
  const brandSlugs = [
    ...new Set(
      products
        .flatMap(p => (p.brand ? [p.brand] : []))
        .map(b => b.toLowerCase().trim().replace(/\s+/g, '-'))
    )
  ].map(b => `/brand/${b}`);

  /* ---------- 4.  active-pharmaceutical-ingredients (salts) ---------- */
  const saltSlugs = [
    ...new Set(
      products
        .flatMap(p => (p.ActiveSalt ? [p.ActiveSalt] : []))
        .map(s => s.toLowerCase().trim().replace(/\s+/g, '-'))
    )
  ].map(s => `/active-pharmaceutical-ingredients/${s}`);

  /* ---------- 5.  static pages ---------- */
  const staticPaths = ['', '/shop', '/search', '/cart', '/contact', '/faq', '/help'];

  /* ---------- combine ---------- */
  const allPaths = [
    ...staticPaths,
    ...categorySlugs,
    ...brandSlugs,
    ...saltSlugs,
    ...activeSlugs
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths
      .map(url => `<url><loc>${host}${url}</loc></url>`)
      .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.write(sitemap);
  res.end();

  return { props: {} };
}