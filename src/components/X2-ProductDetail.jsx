// src/components/ProductDetail.jsx
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useSwipeable } from 'react-swipeable';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function ProductDetail({ product }) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = product?.images ?? [];
  if (!images.length) return <p className="p-4 text-center">Product images missing</p>;

  /* --- swipe handlers --- */
  const handlers = useSwipeable({
    onSwipedLeft : () => setCurrent((c) => (c + 1) % images.length),
    onSwipedRight: () => setCurrent((c) => (c - 1 + images.length) % images.length),
    trackMouse: true,
  });

  return (
    <section className="max-w-4xl mx-auto p-4">
      {/* Main image */}
      <div {...handlers} className="relative cursor-pointer" onClick={() => setLightboxOpen(true)}>
        <Image
          src={`${images[current]}?v=2`}
          alt={product.name}
          width={600}
          height={400}
          layout="responsive"
          className="rounded"
        />
        {/* Heroicons arrows */}
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + images.length) % images.length); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 shadow">
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % images.length); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 shadow">
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-3 overflow-x-auto">
        {images.map((img, idx) => (
          <button key={idx} onClick={() => setCurrent(idx)}
                  className={`w-16 h-16 border-2 rounded overflow-hidden ${idx === current ? 'border-blue-500' : 'border-gray-300'}`}>
            <Image src={`${img}?v=2`} alt={`thumb-${idx}`} width={64} height={64} objectFit="cover" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={images.map((img) => ({ src: `${img}?v=2` }))}
        index={current}
        on={{ view: ({ index }) => setCurrent(index) }}
      />

      {/* baaki tumhara purana detail section yahan aye ga */}
    </section>
  );
}