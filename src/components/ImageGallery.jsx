'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function ImageGallery({ product, isStrip }) {
    const baseImgs = product.images || [];
    const stripImg = product.stripImage;

    let images = baseImgs;
    if (isStrip && stripImg) {
        if (!baseImgs.includes(stripImg)) images = [stripImg, ...baseImgs];
        else images = [stripImg, ...baseImgs.filter(i => i !== stripImg)];
    }

    const [currentImg, setCurrentImg] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);  // Modal state for zoom
    const [modalIndex, setModalIndex] = useState(0);  // Current image in modal

    /* strip toggle pe strip-image pe jump */
    useEffect(() => {
        if (isStrip && stripImg) {
            setCurrentImg(0);
            document.getElementById('slide-0')?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start',
            });
        }
    }, [isStrip, stripImg]);

    /* Keyboard nav for modal (ESC close, arrows next/prev) */
    useEffect(() => {
        if (!modalOpen) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') setModalOpen(false);
            else if (e.key === 'ArrowLeft') setModalIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
            else if (e.key === 'ArrowRight') setModalIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [modalOpen, images.length]);

    /* Open modal on image click */
    const openModal = (idx) => {
        setModalIndex(idx);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    return (
        <>
            <div className="relative w-full">
                {/* main slides */}
                <div
                    id="gallery-scroll"
                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth
            scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-500
            scrollbar-track-transparent"
                >
                    {images.map((img, idx) => (
                        <div key={idx} id={`slide-${idx}`} className="w-full shrink-0 snap-center">
                            <Image
                                src={`${img}`}
                                alt={img.split('/')?.pop()?.replace(/\.(jpg|jpeg|png|webp)$/i, '') || product.name}
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover cursor-pointer"
                                priority={idx === 0}
                                fetchPriority={idx === 0 ? 'high' : undefined}
                                sizes={idx === 0 ? "(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 600px" : undefined}
                                loading={idx === 0 ? "eager" : "lazy"}
                                quality={idx === 0 ? 100 : 80}  // Hero full, baaki balanced
                                // placeholder="blur"  // UPDATED: Hata diya error avoid ke liye (add blurDataURL if needed)
                                onError={(e) => { e.target.style.display = 'none'; }}
                                onClick={() => openModal(idx)}
                            />
                        </div>
                    ))}
                </div>

                {/* thumbnails */}
                <div className="flex justify-center gap-1 mt-3 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-500 scrollbar-track-transparent snap-x snap-mandatory">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setCurrentImg(idx);
                                document.getElementById(`slide-${idx}`).scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'nearest',
                                    inline: 'start',
                                });
                                openModal(idx);  // Thumb click modal open
                            }}
                            className={`w-12 h-12 shrink-0 border-2 rounded-xl overflow-hidden transition-all duration-200
                ${idx === currentImg ? 'border-blue-200' : 'border-transparent'}`}
                        >
                            <Image
                                src={`${img}?v=2`}
                                alt={`thumb-${idx}`}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full cursor-pointer"
                                loading="lazy"
                                sizes="48px"
                                quality={60}
                            // placeholder="blur"  // UPDATED: Hata diya thumbs pe bhi
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Zoom Modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
                    onClick={closeModal}  // Click outside to close
                >
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 z-10 text-white text-3xl hover:text-gray-300"
                    >
                        ×
                    </button>
                    <div className="relative max-w-4xl max-h-full p-4">
                        <Image
                            src={images[modalIndex]}
                            alt={product.name}
                            width={1200}
                            height={800}
                            className="max-w-full max-h-[90vh] object-contain cursor-zoom-in"
                            quality={100}
                            sizes="100vw"
                            onClick={(e) => e.stopPropagation()}  // Prevent close on image click
                        // placeholder="blur"  // UPDATED: Modal pe bhi hata diya (optional)
                        />
                        {/* Nav arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setModalIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                                    }}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setModalIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                                    }}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                >
                                    ›
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}