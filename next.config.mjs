/** @type {import('next').NextConfig} */
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
};

export default nextConfig;