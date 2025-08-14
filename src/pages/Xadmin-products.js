// src/pages/admin-products.js
import { useEffect, useState } from 'react';
import productsData from '../data/products';

const SECRET = 'imran9512';          // change to anything you like
const blankProduct = () => ({
  id: '',
  slug: '',
  name: '',
  active: false,
  categories: [],
  sku: '',
  stock: 0,
  rating: 0,
  reviewCount: 0,
  images: [],
  price: 0,
  qtyDiscount: {},
  tabsMg: '',
  origin: '',
  quality: '',
  shortDesc: '',
  longDesc: '',
  specialNote: '',
  related: [],
  metaTitle: '',
  metaDescription: '',
  ActiveSalt: '',
  reviews: [{ date: '', name: '', rating: 0, comment: '' }],
});

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [granted, setGranted] = useState(false);
  const [keyInput, setKeyInput] = useState('');

  /* ---------- gate ---------- */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('adminKey');
      if (stored === SECRET) setGranted(true);
    }
  }, []);

  /* ---------- unlock ---------- */
  const unlock = () => {
    if (keyInput === SECRET) {
      localStorage.setItem('adminKey', SECRET);
      setGranted(true);
    }
  };

  /* ---------- load data ---------- */
  useEffect(() => {
    if (!granted) return;
    setProducts(productsData);
    fetch('/api/images')
      .then((r) => r.json())
      .then(setImageFiles)
      .catch(() => setImageFiles([]));
  }, [granted]);

  /* ---------- helpers ---------- */
  const setField = (idx, path, value) =>
    setProducts((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const clone = { ...item };
        if (typeof path === 'string') clone[path] = value;
        else {
          let cur = clone;
          for (let p = 0; p < path.length - 1; p++) cur = cur[path[p]];
          cur[path.at(-1)] = value;
        }
        return clone;
      })
    );

  const setReview = (pIdx, rIdx, sub, val) =>
    setProducts((p) =>
      p.map((item, i) =>
        i !== pIdx
          ? item
          : {
              ...item,
              reviews: item.reviews.map((rev, j) =>
                j !== rIdx ? rev : { ...rev, [sub]: val }
              ),
            }
      )
    );

  const addReview = (pIdx) =>
    setProducts((p) =>
      p.map((item, i) =>
        i !== pIdx
          ? item
          : { ...item, reviews: [...item.reviews, blankProduct().reviews[0]] }
      )
    );

  const addProduct = () => setProducts((prev) => [...prev, blankProduct()]);

  const download = () => {
    const raw = `const products = ${JSON.stringify(products, null, 2)};\n\nexport default products;\n`;
    const blob = new Blob([raw], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- gate UI ---------- */
  if (!granted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
        <h1 className="text-2xl mb-4">Admin Panel Locked</h1>
        <input
          type="password"
          placeholder="Enter secret key"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          className="border px-3 py-1"
        />
        <button onClick={unlock} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded">
          Unlock
        </button>
      </div>
    );
  }

  /* ---------- actual page ---------- */
  const fields = [
    { key: 'id', label: 'ID', w: 'w-20' },
    { key: 'slug', label: 'Slug', w: 'w-28' },
    { key: 'name', label: 'Name', w: 'w-36' },
    { key: 'active', label: 'Active', w: 'w-12' },
    { key: 'categories', label: 'Cats', w: 'w-28' },
    { key: 'sku', label: 'SKU', w: 'w-24' },
    { key: 'stock', label: 'Stock', w: 'w-16' },
    { key: 'rating', label: 'Rate', w: 'w-16' },
    { key: 'reviewCount', label: '#R', w: 'w-12' },
    { key: 'price', label: 'Price', w: 'w-20' },
    { key: 'offerPrice', label: 'Offer', w: 'w-20' },
    { key: 'qtyDiscount', label: 'Q-Disc', w: 'w-28' },
    { key: 'tabsMg', label: 'Tabs', w: 'w-24' },
    { key: 'origin', label: 'Origin', w: 'w-24' },
    { key: 'quality', label: 'Quality', w: 'w-24' },
    { key: 'shortDesc', label: 'Short', w: 'w-32' },
    { key: 'longDesc', label: 'Long', w: 'w-32' },
    { key: 'specialNote', label: 'Note', w: 'w-32' },
    { key: 'related', label: 'Related', w: 'w-32' },
    { key: 'metaTitle', label: 'SEO Title', w: 'w-32' },
    { key: 'metaDescription', label: 'SEO Desc', w: 'w-32' },
    { key: 'ActiveSalt', label: 'Salt', w: 'w-24' },
  ];

  return (
    <div className="p-4 bg-slate-50">
      <h1 className="text-2xl font-bold mb-4">Edit Products</h1>

      <div className="overflow-x-auto max-h-[80vh]">
        <table className="min-w-max table-auto border-collapse border border-slate-400 bg-white ">
          <thead className="sticky top-0 bg-slate-200 z-50" style={{ position: 'sticky', top: 0 }}>
            <tr>
              {fields.map((f) => (
                <th key={f.key} className="sticky top-0 bg-slate-200 z-50">
                  {f.label}
                </th>
              ))}
              <th className="border border-slate-300 px-2 py-1 text-xs w-44">Images</th>
              <th className="border border-slate-300 px-2 py-1 text-xs w-64">Reviews</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, pIdx) => (
              <tr key={pIdx}>
                {fields.map(({ key, w }) => (
                  <td key={`${p.id}-${key}`} className={`border border-slate-300 p-1 ${w}`}>
                    {key === 'active' ? (
                      <input
                        type="checkbox"
                        checked={p[key]}
                        onChange={(e) => setField(pIdx, key, e.target.checked)}
                        className="accent-blue-600"
                      />
                    ) : key === 'categories' || key === 'related' ? (
                      <input
                        value={Array.isArray(p[key]) ? p[key].join(', ') : ''}
                        onChange={(e) =>
                          setField(pIdx, key, e.target.value.split(',').map((s) => s.trim()))
                        }
                        className="w-full text-xs p-1 border rounded"
                      />
                    ) : key === 'qtyDiscount' ? (
    <td className="border border-slate-300 p-1 align-top">
      <div className="flex flex-col space-y-1 text-xs">
        {Object.entries(p.qtyDiscount)
          .concat([['', '']])     // 1 blank row ready
          .slice(0, 9)            // max 9 rows
          .map(([qty, price], idx) => (
            <div key={idx} className="flex items-center space-x-1">
              <input
                type="number"
                placeholder="qty"
                value={qty}
                onChange={(e) => {
                  const next = { ...p.qtyDiscount };
                  if (!e.target.value) delete next[qty];
                  else {
                    const newQty = e.target.value;
                    const val = next[qty] || 0;
                    delete next[qty];
                    next[newQty] = val;
                  }
                  setField(pIdx, 'qtyDiscount', next);
                }}
                className="w-10 p-1 border rounded"
              />
              <span>:</span>
              <input
                type="number"
                placeholder="price"
                value={price}
                onChange={(e) =>
                  setField(pIdx, 'qtyDiscount', { ...p.qtyDiscount, [qty]: Number(e.target.value) })
                }
                className="w-12 p-1 border rounded"
              />
              {qty && (
                <button
                  onClick={() =>
                    setField(
                      pIdx,
                      'qtyDiscount',
                      Object.fromEntries(Object.entries(p.qtyDiscount).filter(([k]) => k !== qty))
                    )
                  }
                  className="text-red-600"
                >
                  ×
                </button>
              )}
              {!qty && Object.keys(p.qtyDiscount).length < 9 && (
                <button
                  onClick={() =>
                    setField(pIdx, 'qtyDiscount', { ...p.qtyDiscount, [1]: 0 })
                  }
                  className="text-green-600"
                >
                  +
                </button>
              )}
            </div>
          ))}
      </div>
    </td>
)  : (
                      <input
                        type={['price', 'offerPrice', 'stock', 'rating', 'reviewCount'].includes(key) ? 'number' : 'text'}
                        value={p[key] ?? ''}
                        onChange={(e) =>
                          setField(
                            pIdx,
                            key,
                            ['price', 'offerPrice', 'stock', 'rating', 'reviewCount'].includes(key)
                              ? Number(e.target.value)
                              : e.target.value
                          )
                        }
                        className="w-full text-xs p-1 border rounded"
                      />
                    )}
                  </td>
                ))}

                {/* Images column: search + selected + choose */}
<td className="border border-slate-300 p-1 w-44 align-top">
  {/* selected tags */}
  <div className="flex flex-wrap gap-1 mb-1">
    {p.images.map((img, i) => (
      <span key={img} className="text-xs bg-slate-200 px-1 rounded">
        {img.replace('/Prod-images/', '')}
        <button
          className="ml-1 text-red-600"
          onClick={() =>
            setField(
              pIdx,
              'images',
              p.images.filter((_, idx) => idx !== i)
            )
          }
        >
          ❌
        </button>
      </span>
    ))}
  </div>

  {/* search input */}
  <input
    type="text"
    placeholder="Search…"
    className="w-full text-xs p-1 border rounded mb-1"
    onChange={(e) => {
      const term = e.target.value.toLowerCase();
      e.target.nextElementSibling
        .querySelectorAll('option')
        .forEach((opt) => {
          opt.style.display = opt.textContent.toLowerCase().includes(term) ? '' : 'none';
        });
    }}
  />

  {/* image list (filtered by search) */}
  <select
    multiple
    value={p.images}
    onChange={(e) =>
      setField(
        pIdx,
        'images',
        Array.from(e.target.selectedOptions, (o) => o.value)
      )
    }
    className="w-full text-xs p-1 border rounded h-20"
  >
    {imageFiles.map((file) => (
      <option key={file} value={`/Prod-images/${file}`}>
        {file}
      </option>
    ))}
  </select>
</td>

                {/* Reviews */}
                <td className="border border-slate-300 p-1 w-64 align-top">
                  {p.reviews.map((r, rIdx) => (
                    <div key={rIdx} className="space-y-1 mb-2">
                      <input
                        placeholder="date"
                        value={r.date}
                        onChange={(e) => setReview(pIdx, rIdx, 'date', e.target.value)}
                        className="w-full text-xs p-1 border rounded"
                      />
                      <input
                        placeholder="name"
                        value={r.name}
                        onChange={(e) => setReview(pIdx, rIdx, 'name', e.target.value)}
                        className="w-full text-xs p-1 border rounded"
                      />
                      <input
                        placeholder="rating"
                        type="number"
                        value={r.rating}
                        onChange={(e) => setReview(pIdx, rIdx, 'rating', Number(e.target.value))}
                        className="w-full text-xs p-1 border rounded"
                      />
                      <textarea
                        placeholder="comment"
                        value={r.comment}
                        onChange={(e) => setReview(pIdx, rIdx, 'comment', e.target.value)}
                        rows={2}
                        className="w-full text-xs p-1 border rounded resize-y"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addReview(pIdx)}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    + Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-x-2">
        <button onClick={addProduct} className="bg-green-600 text-white px-3 py-1 rounded">
          + Add new product
        </button>
        <button onClick={download} className="bg-indigo-600 text-white px-3 py-1 rounded">
          Download products.js
        </button>
      </div>
    </div>
  );
}