import products from '@/data/products';

export default function Sitemap() {}

export async function getServerSideProps({ res }) {
  // 1️⃣ read the real domain from env
  const host = process.env.SITE_URL || 'https://my-ecommerce-site-gamma.vercel.app';

  // 2️⃣ static pages
  const staticUrls = ['', '/shop', '/search', '/cart', '/contact', '/faq', '/help'];

  // 3️⃣ products
  const productUrls = products.map(p => `/products/${p.slug}`);

  // 4️⃣ categories
  const categorySet = new Set();
  products.forEach(p =>
    p.categories.forEach(c => categorySet.add(c.toLowerCase()))
  );
  const categoryUrls = [...categorySet].map(c => `/category/${c}`);

  // 5️⃣ build XML
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