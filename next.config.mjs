// next.config.mjs
/** @type {import('next').NextConfig} */
import productRedirects from './src/utils/redirectsData.mjs';
import rewritesList from './src/utils/rewritesData.mjs';

const nextConfig = {
  reactStrictMode: true,
  env: {
    SITE_URL:
      process.env.VERCEL_ENV === 'production'
        ? 'https://www.aapkisehat.com' // ← your real domain
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000',
  },
  async rewrites() {
    return [...rewritesList]; // external file se import
  },
  async redirects() {
    return [...productRedirects];
  },
};
export default nextConfig;