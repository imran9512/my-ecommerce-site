// src/pages/404.js
import { useEffect, useRef, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import products from '@/data/products';

const shownProducts = products.filter(p => p.active);


export default function NotFound() {
    const sliderRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-scroll speed (pixels per frame)
    const speed = 1;

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        let offset = 0;
        let animationId;

        const scroll = () => {
            if (!isPaused) {
                offset -= speed;
                // Reset offset when first copy scrolls completely
                if (Math.abs(offset) >= slider.scrollWidth / 2) {
                    offset = 0;
                }
                slider.style.transform = `translateX(${offset}px)`;
            }
            animationId = requestAnimationFrame(scroll);
        };

        animationId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationId);
    }, [isPaused]);

    // Touch & mouse events
    const handleStart = () => setIsPaused(true);
    const handleEnd = () => setIsPaused(false);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* 404 Message */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-red-600 mb-2">Page Not Found</h1>
                <p className="text-gray-600 mb-4">
                    Sorry Your Required Page is not available.<br />You can chose any product from bottom list, Or
                </p>
                <a
                    href="/"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Go Back to Home
                </a>
            </div>

            {/* Touch-friendly slider */}
            <div
                className="relative overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleStart}
                onMouseUp={handleEnd}
                onTouchStart={handleStart}
                onTouchEnd={handleEnd}
            >
                <div
                    ref={sliderRef}
                    className="flex transition-transform duration-100 ease-linear"
                >
                    {/* 2× repeat for infinite scroll */}
                    {[...shownProducts, ...shownProducts].map((p, i) => (
                        <div key={i} className="flex-none w-48 md:w-60 px-2">
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}