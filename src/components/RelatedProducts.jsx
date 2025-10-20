// src/pages/shop.js
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { canonical } from '@/utils/seo';
import ProductCard from '@/components/ProductCard';
import products from '@/data/products';
import { categories } from '@/data/constants';

export default function ShopPage() {
  const visibleProducts = products.filter(p => p.active);

  // Helper: Group products by category (match main name or sub titles)
  const groupProductsByCategory = () => {
    const grouped = {};
    categories.forEach(cat => {
      const categoryKeys = [cat.name.toLowerCase()];
      cat.sub.forEach(sub => {
        categoryKeys.push(sub.title.toLowerCase());
        sub.children.forEach(child => categoryKeys.push(child.toLowerCase()));
      });
      grouped[cat.name] = visibleProducts.filter(p =>
        p.categories.some(c => categoryKeys.includes(c.toLowerCase()))
      );
    });
    return grouped;
  };

  const groupedProducts = groupProductsByCategory();

  // Main categories for top buttons (custom 4 as requested)
  const mainCategoryButtons = [
    { name: 'ADHD', href: '/category/adhd' },
    { name: 'For-Men', href: '/category/for-men' },
    { name: 'For-Women', href: '/category/for-women' },
    { name: 'Miscellaneous', href: '/category/others' },
  ];

  return (
    <>
      <Head>
        <title>Shop All | Aap Ki Sehat</title>
        <link rel="canonical" href={canonical('/shop')} />
      </Head>

      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl mt-4 font-bold text-center mb-8">Shop All</h1>

        {/* Top 4 Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {mainCategoryButtons.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className="px-6 py-3 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              {name}
            </Link>
          ))}
        </div>

        {/* Category Sliders */}
        {categories.map(cat => {
          const catProducts = groupedProducts[cat.name];
          const showSlider = catProducts && catProducts.length > 0;
          return (
            <div key={cat.name} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-center capitalize">{cat.name}</h2>
              {showSlider ? (
                <div>
                  <div className="flex overflow-x-auto gap-3 scrollbar-thin scrollbar-thumb-gray-400 pb-4"> {/* FIXED: Tailwind scrollbar like your related products, no custom style */}
                    {catProducts.map(p => (
                      <div key={p.id} className="flex-shrink-0 w-[150px] md:w-[150px] lg:w-[150px]"> {/* FIXED: w-48 -> w-[150px] to match your code */}
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                  {/* Subtle Swipe Indicator Line */}
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="mx-2 text-xs text-gray-400 px-2">↔ Swipe for more</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">No products available in this category.</p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}