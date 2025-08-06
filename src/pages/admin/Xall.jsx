// src/pages/admin/all.jsx
import { useEffect, useState } from 'react';

export default function AdminAll() {
  /* client-only guard */
  if (typeof window === 'undefined') return null;

  /* --- local file URLs --- */
  const PRODUCTS_URL = '/src/data/products.js';
  const CONSTANTS_URL = '/src/data/constants.js';

  const [products, setProducts] = useState([]);
  const [constants, setConstants] = useState([]);
  const [images, setImages] = useState([]);

  /* load once */
  useEffect(() => {
    /* products */
    fetch(PRODUCTS_URL)
      .then((r) => r.text())
      .then((txt) => setProducts(eval(txt.replace('export default', ''))));

    /* constants */
    fetch(CONSTANTS_URL)
      .then((r) => r.text())
      .then((txt) =>
        txt
          .split('\n')
          .filter((l) => /^export const/.test(l))
          .map((l) => ({ key: l.match(/const\s+(\w+)/)[1], val: l.split('=')[1] }))
      )
      .then(setConstants);

    /* images from public/Prod-images */
    fetch('/Prod-images')
      .then((r) => r.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return Array.from(doc.querySelectorAll('a'))
          .map((a) => a.textContent.trim())
          .filter((t) => /\.(jpg|jpeg|png|webp)$/i.test(t));
      })
      .then(setImages);
  }, []);

  /* helpers */
  const handleChange = (k, v) => setProducts((p) => ({ ...p, [k]: v }));
  const handleArray = (val) => val.split(',').map((v) => v.trim()).filter(Boolean);

  /* editable JSON */
  const [prodJSON, setProdJSON] = useState('[]');

  useEffect(() => setProdJSON(JSON.stringify(products, null, 2)), [products]);

  const saveProducts = () => {
    const blob = new Blob([`export default ${prodJSON}`], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Local Admin – Products / Constants / Images</h1>

      {/* PRODUCTS ------------------------------------------------ */}
      <section>
        <h2 className="text-xl font-bold">Products</h2>
        <textarea
          value={prodJSON}
          onChange={(e) => setProdJSON(e.target.value)}
          className="w-full h-60 border px-2 py-1 font-mono text-sm"
        />
        <button onClick={saveProducts} className="mt-2 bg-blue-500 text-white px-3 py-1">
          Download products.js
        </button>
      </section>

      {/* CONSTANTS ------------------------------------------------ */}
      <section>
        <h2 className="text-xl font-bold">Constants</h2>
        <textarea
          value={JSON.stringify(constants, null, 2)}
          onChange={(e) => setConstants(JSON.parse(e.target.value || '[]'))}
          className="w-full h-40 border px-2 py-1 font-mono text-sm"
        />
        <button onClick={() => { /* manual save later */ }} className="mt-2 bg-green-500 text-white px-3 py-1">
          Download constants.js
        </button>
      </section>

      {/* IMAGES ------------------------------------------------ */}
      <section>
        <h2 className="text-xl font-bold">Images</h2>
        <div className="grid grid-cols-4 gap-2 text-sm">
          {images.map((img) => (
            <div key={img} className="truncate bg-gray-100 p-1 rounded">
              {img}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}