// src/pages/admin-products.js
import { useEffect, useState } from 'react';
import productsData from '../data/products';

const SECRET = 'imran9512';

/* ---------- blank template ---------- */
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
  offerPrice: 0,
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
  /* ---------- state ---------- */
  const [products, setProducts] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [granted, setGranted] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(null);   // row being edited
  const [editedList, setEditedList] = useState([]);       // sidebar list
  const [showAddPanel, setShowAddPanel] = useState(false); // new-product panel

  /* ---------- gate ---------- */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('adminKey');
      if (stored === SECRET) setGranted(true);
    }
  }, []);
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
  const setField = (idx, path, value) => {
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
    // track edited product
    setEditedList((prev) => {
      const already = prev.find((p) => p.id === products[idx].id);
      if (already) return prev;
      return [...prev, products[idx]];
    });
  };

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

  const addProduct = () => {
    const newProd = blankProduct();
    newProd.id = `temp-${Date.now()}`;
    setProducts((prev) => [...prev, newProd]);
    setEditedList((prev) => [...prev, newProd]);
    setSelectedIdx(products.length);
    setShowAddPanel(false);
  };

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

  /* ---------- dropdown list ---------- */
  const dropdownOptions = products.map((p, i) => ({
    value: i,
    label: `${p.name} (ID: ${p.id})`,
  }));

  /* ---------- form fields ---------- */
  const fields = [
    'id', 'slug', 'name', 'active', 'categories', 'sku', 'stock', 'rating', 'reviewCount',
    'images', 'price', 'offerPrice', 'qtyDiscount', 'tabsMg', 'origin', 'quality',
    'shortDesc', 'longDesc', 'specialNote', 'related', 'metaTitle', 'metaDescription', 'ActiveSalt',
  ];

  /* ---------- render ---------- */
  return (
    <div className="p-4 bg-slate-50">
      <h1 className="text-2xl font-bold mb-4">Edit Products</h1>

      {/* ------------ 1. Product dropdown ------------ */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Select product to edit:</label>
        <select
          value={selectedIdx ?? ''}
          onChange={(e) => {
            const idx = Number(e.target.value);
            setSelectedIdx(idx);
            setShowAddPanel(false);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="">-- choose product --</option>
          {dropdownOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setSelectedIdx(null);
            setShowAddPanel(true);
          }}
          className="ml-2 bg-green-600 text-white px-2 py-1 rounded"
        >
          + New product
        </button>
      </div>

      {/* ------------ 2. Sidebar edited list ------------ */}
      {editedList.length > 0 && (
        <aside className="w-64 fixed right-2 top-20 bg-white shadow-lg p-2 rounded border">
          <h2 className="text-sm font-bold mb-2">Recently edited</h2>
          {editedList.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedIdx(products.findIndex((x) => x.id === p.id))}
              className="block w-full text-left text-xs p-1 hover:bg-slate-100 truncate"
            >
              {p.name}
            </button>
          ))}
        </aside>
      )}

      {/* ------------ 3. Edit / Add form ------------ */}
      {selectedIdx !== null || showAddPanel ? (
        <div className="bg-white p-4 rounded shadow mb-4">
          {fields.map((key) => (
            <div key={key} className="mb-2">
              <label className="text-xs font-semibold">{key}</label>
              {key === 'active' ? (
                <input
                  type="checkbox"
                  checked={products[selectedIdx ?? products.length - 1]?.[key]}
                  onChange={(e) =>
                    setField(selectedIdx ?? products.length - 1, key, e.target.checked)
                  }
                />
              ) : key === 'categories' || key === 'related' || key === 'images' ? (
                <input
                  className="w-full border rounded px-1 text-xs"
                  value={products[selectedIdx ?? products.length - 1]?.[key]?.join(', ') || ''}
                  onChange={(e) =>
                    setField(
                      selectedIdx ?? products.length - 1,
                      key,
                      e.target.value.split(',').map((s) => s.trim())
                    )
                  }
                />
              ) : key === 'qtyDiscount' ? (
                <div className="flex flex-col space-y-1 text-xs">
                  {Object.entries(products[selectedIdx ?? products.length - 1]?.qtyDiscount ?? {})
                    .concat([['', '']])
                    .slice(0, 20)
                    .map(([qty, price], idx) => (
                      <div key={idx} className="flex items-center space-x-1">
                        <input
                          type="number"
                          placeholder="qty"
                          value={qty}
                          onChange={(e) => {
                            const next = { ...(products[selectedIdx ?? products.length - 1]?.qtyDiscount ?? {}) };
                            if (!e.target.value) delete next[qty];
                            else {
                              const newQty = e.target.value;
                              const val = next[qty] || 0;
                              delete next[qty];
                              next[newQty] = val;
                            }
                            setField(selectedIdx ?? products.length - 1, 'qtyDiscount', next);
                          }}
                          className="w-10 p-1 border rounded"
                        />
                        <span>:</span>
                        <input
                          type="number"
                          placeholder="price"
                          value={price}
                          onChange={(e) =>
                            setField(selectedIdx ?? products.length - 1, 'qtyDiscount', {
                              ...(products[selectedIdx ?? products.length - 1]?.qtyDiscount ?? {}),
                              [qty]: Number(e.target.value),
                            })
                          }
                          className="w-12 p-1 border rounded"
                        />
                        {qty && (
                          <button
                            onClick={() =>
                              setField(
                                selectedIdx ?? products.length - 1,
                                'qtyDiscount',
                                Object.fromEntries(
                                  Object.entries(
                                    products[selectedIdx ?? products.length - 1]?.qtyDiscount ?? {}
                                  ).filter(([k]) => k !== qty)
                                )
                              )
                            }
                            className="text-red-600"
                          >
                            ×
                          </button>
                        )}
                        {!qty && Object.keys(products[selectedIdx ?? products.length - 1]?.qtyDiscount ?? {}).length < 20 && (
                          <button
                            onClick={() =>
                              setField(selectedIdx ?? products.length - 1, 'qtyDiscount', {
                                ...(products[selectedIdx ?? products.length - 1]?.qtyDiscount ?? {}),
                                [1]: 0,
                              })
                            }
                            className="text-green-600"
                          >
                            +
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              ) : key === 'images' ? (
                <div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(products[selectedIdx ?? products.length - 1]?.images ?? []).map((img, i) => (
                      <span key={img} className="text-xs bg-slate-200 px-1 rounded">
                        {img.replace('/Prod-images/', '')}
                        <button
                          type="button"
                          className="ml-1 text-red-600"
                          onClick={() =>
                            setField(
                              selectedIdx ?? products.length - 1,
                              'images',
                              products[selectedIdx ?? products.length - 1]?.images.filter((_, idx) => idx !== i)
                            )
                          }
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <select
                    multiple
                    value={products[selectedIdx ?? products.length - 1]?.images ?? []}
                    onChange={(e) =>
                      setField(
                        selectedIdx ?? products.length - 1,
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
                </div>
              ) : key === 'reviews' ? (
                <div className="space-y-2">
                  {(products[selectedIdx ?? products.length - 1]?.reviews ?? []).map((r, rIdx) => (
                    <div key={rIdx} className="border rounded p-2 bg-slate-50 space-y-1">
                      <input
                        placeholder="date"
                        value={r.date}
                        onChange={(e) =>
                          setReview(selectedIdx ?? products.length - 1, rIdx, 'date', e.target.value)
                        }
                        className="w-full text-xs p-1 border rounded"
                      />
                      <input
                        placeholder="name"
                        value={r.name}
                        onChange={(e) =>
                          setReview(selectedIdx ?? products.length - 1, rIdx, 'name', e.target.value)
                        }
                        className="w-full text-xs p-1 border rounded"
                      />
                      <input
                        placeholder="rating"
                        type="number"
                        value={r.rating}
                        onChange={(e) =>
                          setReview(selectedIdx ?? products.length - 1, rIdx, 'rating', Number(e.target.value))
                        }
                        className="w-full text-xs p-1 border rounded"
                      />
                      <textarea
                        placeholder="comment"
                        value={r.comment}
                        onChange={(e) =>
                          setReview(selectedIdx ?? products.length - 1, rIdx, 'comment', e.target.value)
                        }
                        rows={2}
                        className="w-full text-xs p-1 border rounded resize-y"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addReview(selectedIdx ?? products.length - 1)}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    + Review
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  value={products[selectedIdx ?? products.length - 1]?.[key] || ''}
                  onChange={(e) =>
                    setField(selectedIdx ?? products.length - 1, key, e.target.value)
                  }
                  className="w-full border rounded px-1 text-xs"
                />
              )}
            </div>
          ))}
        </div>
      ) : null}

      {/* ------------ 4. Download button ------------ */}
      <div className="mt-4 space-x-2">
        <button onClick={download} className="bg-indigo-600 text-white px-3 py-1 rounded">
          Download products.js
        </button>
      </div>
    </div>
  );
}