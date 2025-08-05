// src/pages/admin/products.jsx
import { useEffect, useState } from 'react';

const OWNER = 'imran9512';
const REPO  = 'my-ecommerce-site';
const FILE  = 'src/data/products.js';

export default function AdminProducts() {
  const [token, setToken]         = useState(null);
  const [products, setProducts]   = useState([]);
  const [form, setForm]           = useState(null);

  /* GitHub API wrapper (browser only) */
  const api = (path, opts) =>
    fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
      headers: { Authorization: `token ${typeof window !== 'undefined' ? window.localStorage.getItem('gh_token') : ''}` },
      ...opts,
    }).then((r) => r.json());

  /* OAuth popup (unchanged) */
  const login = () =>
    window.open(`https://github.com/login/oauth/authorize?client_id=Ov23liigiC0PS07gHcCK&scope=repo`, 'oauth', 'width=500,height=600');

  /* load products once on client mount */
  useEffect(() => {
    const t = typeof window !== 'undefined' ? window.localStorage.getItem('gh_token') : null;
    if (!t) return;
    setToken(t);
    api(`/contents/${FILE}`)
      .then((f) => fetch(f.download_url))
      .then((r) => r.text())
      .then((txt) => setProducts(eval(txt.replace('export default', ''))));
  }, []);

  /* save changes */
  const save = async (list) => {
    const { sha } = await api(`/contents/${FILE}`);
    const content = btoa(`export default ${JSON.stringify(list, null, 2)}`);
    await api(`/contents/${FILE}`, {
      method: 'PUT',
      body: JSON.stringify({ message: 'Update products via admin', content, sha }),
    });
    alert('Saved! Refresh to see new product on site.');
    window.location.reload();
  };

  /* blank template */
  const blank = {
    id: Date.now().toString(),
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

  /* login screen */
  if (typeof window === 'undefined' || !localStorage.getItem('gh_token'))
    return (
      <div className="p-10 text-center">
        <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">
          Login with GitHub
        </button>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{SITE_NAME} – Product Manager</h1>

      {/* dropdown of existing products */}
      <select
        value={form?.id || ''}
        onChange={(e) => setForm(products.find((p) => p.id === e.target.value) || blank)}
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
      <button onClick={() => setForm(blank)} className="mb-4 bg-green-500 text-white px-3 py-1">
        + New Product
      </button>

      {form && (
        <div className="space-y-3 border p-4 rounded">
          <input placeholder="Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full border px-2 py-1" />
          <input placeholder="Slug" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} className="w-full border px-2 py-1" />
          <input placeholder="Price" type="number" value={form.price} onChange={(e) => handleChange('price', Number(e.target.value))} className="w-full border px-2 py-1" />
          <input placeholder="Offer Price" type="number" value={form.offerPrice} onChange={(e) => handleChange('offerPrice', Number(e.target.value))} className="w-full border px-2 py-1" />
          <input placeholder="Images (comma URLs)" value={form.images.join(', ')} onChange={(e) => handleChange('images', handleArray(e.target.value))} className="w-full border px-2 py-1" />
          <input placeholder="Categories (comma)" value={form.categories.join(', ')} onChange={(e) => handleChange('categories', handleArray(e.target.value))} className="w-full border px-2 py-1" />
          <textarea placeholder="Short Description" value={form.shortDesc} onChange={(e) => handleChange('shortDesc', e.target.value)} className="w-full border px-2 py-1" />
          <textarea placeholder="Long Description" value={form.longDesc} onChange={(e) => handleChange('longDesc', e.target.value)} className="w-full border px-2 py-1" />
          <button onClick={() => save([...products, form])} className="bg-blue-500 text-white px-3 py-1">
            Save
          </button>
        </div>
      )}
    </div>
  );
}