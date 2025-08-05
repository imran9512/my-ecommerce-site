// src/pages/admin/products.jsx
import { useEffect, useState } from 'react';
import { SITE_NAME } from '@/data/constants';

const OWNER = 'imran9512';
const REPO = 'my-ecommerce-site';
const FILE = 'src/data/products.js';

export default function AdminProducts() {
  const [token, setToken] = useState('');
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(null);

  /* GitHub helpers */
  const api = (path, opts) =>
    fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
      headers: { Authorization: `token ${localStorage.getItem('gh_token')}`, 'Content-Type': 'application/json' },
      ...opts,
    }).then((r) => r.json());

  const login = () => {
    const url = `https://github.com/login/oauth/authorize?client_id=Ov23liigiC0PS07gHcCK&scope=repo`;
    const popup = window.open(url, 'oauth', 'width=500,height=600');
    const timer = setInterval(() => {
      try {
        if (popup.location.href.includes('code=')) {
          const code = popup.location.href.match(/code=([^&]+)/)[1];
          popup.close();
          clearInterval(timer);
          fetch('/api/github-token', {
            method: 'POST',
            body: JSON.stringify({ code }),
          })
            .then((r) => r.json())
            .then(({ token }) => {
              localStorage.setItem('gh_token', token);
              window.location.reload();
            });
        }
      } catch {}
    }, 500);
  };

  /* load products */
  useEffect(() => {
    const t = localStorage.getItem('gh_token');
    if (!t) return;
    api(`/contents/${FILE}`)
      .then((f) => fetch(f.download_url))
      .then((r) => r.text())
      .then((txt) => {
        const data = eval(txt.replace('export default', ''));
        setProducts(data);
      });
  }, [token]);

  const save = async (list) => {
    const { sha } = await api(`/contents/${FILE}`);
    const content = btoa(`export default ${JSON.stringify(list, null, 2)}`);
    await api(`/contents/${FILE}`, {
      method: 'PUT',
      body: JSON.stringify({ message: 'Update products', content, sha }),
    });
    alert('Saved!');
    window.location.reload();
  };

  /* blank template */
  const blank = {
    id: '',
    slug: '',
    name: '',
    categories: [],
    sku: '',
    stock: 0,
    rating: 0,
    reviewCount: 0,
    images: [],
    price: 0,
    offerPrice: 0,
    qtyDiscount: {},
    shortDesc: '',
    longDesc: '',
    specialNote: '',
    related: [],
    metaTitle: '',
    metaDescription: '',
    ActiveSalt: '',
    reviews: [],
  };

  /* helpers */
  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleArray = (val) => val.split(',').map((v) => v.trim()).filter(Boolean);
  const handleObj = (val) => {
    const obj = {};
    val.split(',').forEach((pair) => {
      const [k, v] = pair.split(':');
      if (k && v) obj[k.trim()] = Number(v.trim());
    });
    return obj;
  };

  /* review helpers */
  const addReview = () =>
    setForm((f) => ({ ...f, reviews: [...f.reviews, { date: '', name: '', rating: 0, comment: '' }] }));
  const updateReview = (idx, key, val) =>
    setForm((f) => ({
      ...f,
      reviews: f.reviews.map((r, i) => (i === idx ? { ...r, [key]: val } : r)),
    }));
  const removeReview = (idx) =>
    setForm((f) => ({ ...f, reviews: f.reviews.filter((_, i) => i !== idx) }));

  /* mount products once */
  useEffect(() => {
    if (products.length) setForm({ ...blank });
  }, [products]);

  if (!token)
    return (
      <div className="p-10 text-center">
        <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">
          Login with GitHub
        </button>
      </div>
    );

  /* ---------- FORM ---------- */
  const Form = ({ f }) => (
    <div className="space-y-3 border p-4 rounded">
      {['id', 'slug', 'name', 'sku', 'stock', 'rating', 'reviewCount', 'price', 'offerPrice', 'shortDesc', 'longDesc', 'specialNote', 'metaTitle', 'metaDescription', 'ActiveSalt'].map((k) => (
        <input
          key={k}
          placeholder={k}
          value={f[k] || ''}
          onChange={(e) => handleChange(k, k === 'stock' || k === 'rating' ? Number(e.target.value) : e.target.value)}
          className="w-full border px-2 py-1"
        />
      ))}
      <label>Categories (comma)</label>
      <input
        value={(f.categories || []).join(', ')}
        onChange={(e) => handleChange('categories', handleArray(e.target.value))}
        className="w-full border px-2 py-1"
      />
      <label>Qty Discount (qty:price,...)</label>
      <input
        value={Object.entries(f.qtyDiscount || {})
          .map(([k, v]) => `${k}:${v}`)
          .join(', ')}
        onChange={(e) => handleChange('qtyDiscount', handleObj(e.target.value))}
        className="w-full border px-2 py-1"
      />
      <label>Images (comma URLs)</label>
      <textarea
        value={(f.images || []).join(', ')}
        onChange={(e) => handleChange('images', handleArray(e.target.value))}
        className="w-full border px-2 py-1"
      />
      <label>Related IDs (comma)</label>
      <input
        value={(f.related || []).join(', ')}
        onChange={(e) => handleChange('related', handleArray(e.target.value))}
        className="w-full border px-2 py-1"
      />

      {/* reviews builder */}
      <div>
        <label className="block font-semibold text-sm">Reviews</label>
        {f.reviews.map((r, idx) => (
          <div key={idx} className="flex flex-col space-y-1 border p-2 mb-2">
            <input placeholder="date" value={r.date} onChange={(e) => updateReview(idx, 'date', e.target.value)} />
            <input placeholder="name" value={r.name} onChange={(e) => updateReview(idx, 'name', e.target.value)} />
            <input placeholder="rating" type="number" value={r.rating} onChange={(e) => updateReview(idx, 'rating', Number(e.target.value))} />
            <textarea placeholder="comment" value={r.comment} onChange={(e) => updateReview(idx, 'comment', e.target.value)} />
            <button onClick={() => removeReview(idx)} className="text-red-500 text-xs">Remove</button>
          </div>
        ))}
        <button onClick={addReview} className="text-xs bg-blue-500 text-white px-2 py-1 rounded">+ Add Review</button>
      </div>

      <div className="flex space-x-2">
        <button onClick={() => save(products.find((p) => p.id === form.id) ? products : [...products, form])} className="bg-blue-500 text-white px-3 py-1">
          Save
        </button>
        {form.id && (
          <button onClick={() => save(products.filter((p) => p.id !== form.id))} className="bg-red-500 text-white px-3 py-1">
            Delete
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{SITE_NAME} – Product Manager</h1>

      {/* dropdown of existing products */}
      <select
        value={form?.id || ''}
        onChange={(e) => setForm(products.find((p) => p.id === e.target.value) || { ...blank })}
        className="mb-4 border px-2 py-1"
      >
        <option value="">-- Select Product to Edit --</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* new product */}
      <button onClick={() => setForm({ ...blank })} className="mb-4 bg-green-500 text-white px-3 py-1">
        + New Product
      </button>

      {form && <Form f={form} />}
    </div>
  );
}