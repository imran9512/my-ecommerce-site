/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SITE_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://www.aapkisehat.com', // ← replace with your actual domain
  },
};

export default nextConfig;