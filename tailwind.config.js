/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',  // NEW: App Router ke liye (safe add, ignore if not using)
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
      fontFamily: {  // NEW: Default fonts for better typography (match global.css)
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  // variants: { extend: {} },  // UPDATED: Hata diya, unnecessary in Tailwind v3+
  plugins: [
    require('@tailwindcss/aspect-ratio'),  // NEW: Images ke liye aspect ratios (CLS fix)
  ],
};