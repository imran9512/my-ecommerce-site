// src/pages/gallery.js
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';

export default function GalleryPage() {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/api/images2')
      .then(r => r.json())
      .then(data => setFiles(data.files));
  }, []);

  return (
    <>
      <Head>
        <title>Image Gallery – WebP Converter</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl mt-8 font-bold mb-6">Gallery</h1>

        {files.length === 0 && (
          <p className="text-gray-500">
            Drop images into <code>/public/pix</code> and refresh.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map(f => (
            <div
              key={f}
              className="cursor-pointer"
              onClick={() => setSelected(`/pix/${f}`)}
            >
              <Image
                src={`/pix/${f}`}
                alt={f}
                width={300}
                height={300}
                className="rounded"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>

        {/* Light-box */}
        {selected && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setSelected(null)}
          >
            <Image
              src={selected}
              alt="preview"
              width={900}
              height={900}
              className="max-w-full max-h-full"
              style={{ objectFit: 'contain' }}
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
          </div>
        )}
      </main>
    </>
  );
}