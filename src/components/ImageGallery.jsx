// src/components/ImageGallery.jsx
'use client'; // ← Next-13 app dir ke liye
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

    return (
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
                            src={`${img}?v=2`}
                            alt={img.split('/')?.pop()?.replace(/\.(jpg|jpeg|png|webp)$/i, '') || product.name}
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover cursor-pointer"
                            priority={idx === 0}
                        />
                    </div>
                ))}
            </div>

            {/* thumbnails */}
            <div className="flex justify-center gap-2 mt-3 overflow-x-auto">
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
                        }}
                        className={`w-16 h-16 shrink-0 border-2 rounded-2xl overflow-hidden transition
            ${idx === currentImg ? 'border-blue-200' : 'border-transparent'}`}
                    >
                        <Image src={`${img}?v=2`} alt={`thumb-${idx}`} width={72} height={72} className="object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}