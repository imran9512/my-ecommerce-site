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

  // Dynamic mainCategoryButtons from categories array—new category add karo constants.js mein, auto aa jayega
  const mainCategoryButtons = categories.map(cat => ({
    name: cat.name,
    href: `/category/${cat.name.toLowerCase()}`
  }));

  // Hardcoded For-Women button with pink background (separate for custom style)
  const forWomenButton = {
    name: 'For-Women',
    href: '/category/for-women'
  };

  return (
    <>
      <Head>
        <title>Shop All | Aap Ki Sehat</title>
        <link rel="canonical" href={canonical('/shop')} />
      </Head>

      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl mt-4 font-bold text-center mb-8">Shop All</h1>

        {/* Top Category Buttons - Dynamic + For-Women */}
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
          {/* For-Women with pink background */}
          <Link
            href={forWomenButton.href}
            className="px-6 py-3 bg-pink-500 text-white rounded-full text-sm font-semibold hover:bg-pink-600 transition-colors"
          >
            {forWomenButton.name}
          </Link>
        </div>

        {/* Category Sliders - FIXED: No divider line, smoother snap scroll like swiper */}
        {categories.map(cat => {
          const catProducts = groupedProducts[cat.name];
          const showSlider = catProducts && catProducts.length > 0;
          return (
            <div key={cat.name} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-center capitalize">{cat.name}</h2>
              {showSlider ? (
                <div className="[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"> {/* Hidden scrollbar */}
                  <div className="flex overflow-x-auto gap-3 snap-x snap-mandatory pb-2 scroll-smooth"> {/* FIXED: snap-x mandatory for swiper-like snap on swipe, scroll-smooth for fluid, pb-2 tight space, no divider */}
                    {catProducts.map(p => (
                      <div key={p.id} className="flex-shrink-0 w-[150px] md:w-[150px] lg:w-[150px] snap-center"> {/* FIXED: snap-center for card centering on swipe */}
                        <ProductCard product={p} />
                      </div>
                    ))}
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