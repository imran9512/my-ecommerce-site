// next.config.mjs
/** @type {import('next').NextConfig} */
import productRedirects from './src/utils/redirectsData.mjs';
import rewritesList from './src/utils/rewritesData.mjs';

const nextConfig = {
  reactStrictMode: true,
  env: {
    SITE_URL:
      process.env.VERCEL_ENV === 'production'
        ? 'https://www.aapkisehat.com'
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000',
  },
  images: {  // NEW: Image optimization for LCP (WebP/AVIF, responsive)
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],  // Mobile-first breakpoints
    // Agar external images hain (jaise CDN se), to domains add kar: domains: ['aapkisehat.com']
  },
  // experimental: {  // NEW: Streaming for better render (Next.js 14+)
  //   ppr: true,  // Partial Prerendering – static shell fast, dynamic later
  //},
  async rewrites() {
    return [...rewritesList];
  },
  async redirects() {
    return [...productRedirects];
  },
};
export default nextConfig;