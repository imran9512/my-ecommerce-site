// next.config.js  (rename .mjs → .js)
/** @type {import('next').NextConfig} */
const productRedirects = require('./src/utils/redirectsData.cjs');
const rewritesList = require('./src/utils/rewritesData.cjs');

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
  async rewrites() {
    return rewritesList;
  },
  async redirects() {
    return productRedirects;
  },
};

module.exports = nextConfig;