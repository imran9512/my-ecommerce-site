// src/pages/404.js
import ProductCard from '@/components/ProductCard';
import products from '@/data/products';

// خالی array → تمام active products
const shownProducts = products.filter(p => p.active);

export default function NotFound() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* 404 Message */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-red-600 mb-2">404 – Page Not Found</h1>
                <p className="text-gray-600 mb-4">
                    Maaf kijiye, aap jo page dhoondh rahe hain wo mojood nahi.
                </p>
                <a
                    href="/"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Go Back to Home
                </a>
            </div>

            {/* Infinite RTL slider */}
            <div className="relative overflow-hidden">
                <div className="flex animate-rtl group">
                    {/* دو بار concat کر کے infinite loop */}
                    {shownProducts.concat(shownProducts).map((p, i) => (
                        <div key={i} className="flex-none w-60 px-2">
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Tailwind keyframes */}
            <style jsx global>{`
        @keyframes rtl {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-rtl {
          animation: rtl 30s linear infinite;
        }
        .group:hover .animate-rtl {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
}