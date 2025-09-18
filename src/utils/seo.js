// src/utils/seo.js
export const canonical = (path) => `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aapkisehat.com'}${path}`;