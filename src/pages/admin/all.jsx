// src/pages/admin/all.jsx
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function AdminAll() {
  /* 1️⃣  NEVER render on server (prevents hook count mismatch) */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  /* 2️⃣  Session check */
  const { data: session, status } = useSession();
  if (status === 'loading') return <p className="text-center mt-10">Loading…</p>;
  if (!session) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <button
          onClick={() => signIn('github')}
          className="bg-black text-white px-5 py-2 rounded"
        >
          Login with GitHub
        </button>
      </div>
    );
  }

  /* 3️⃣  Admin UI */
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [formData, setFormData] = useState(null);
  const [isNew, setIsNew] = useState(false);

  /* load products */
  useEffect(() => {
    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'username/repo';
    const branch = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main';
    fetch(`https://raw.githubusercontent.com/${repo}/${branch}/src/data/products.js`)
      .then(r => r.text())
      .then(txt => setProducts(eval(txt.replace('export default', ''))));
  }, []);

  const resetForm = () => {
    const maxId = products.length ? Math.max(...products.map(p => +p.id)) : 0;
    setFormData({
      id: String(maxId + 1).padStart(3, '0'),
      slug: '',
      name: '',
      active: true,
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
      reviews: []
    });
  };

  const handleSelect = id => {
    setSelectedId(id);
    if (id === 'new') { setIsNew(true); resetForm(); }
    else { setIsNew(false); setFormData({ ...products.find(p => p.id === id) }); }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    let parsed = value;
    if (['categories', 'related', 'images'].includes(name)) {
      parsed = value.split(',').map(v => v.trim()).filter(Boolean);
    } else if (name === 'qtyDiscount') {
      try { parsed = JSON.parse(value); } catch { parsed = {}; }
    } else if (type === 'number') parsed = Number(value);
    else if (type === 'checkbox') parsed = checked;
    setFormData(prev => ({ ...prev, [name]: parsed }));
  };

  const saveProduct = async () => {
    const updated = isNew ? [...products, formData] : products.map(p => p.id === formData.id ? formData : p);
    const res = await fetch('/api/update-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: updated, token: session.accessToken }),
    });
    if (res.ok) {
      alert('✅ Saved to GitHub!');
      window.location.reload();
    } else {
      const err = await res.json();
      alert('❌ ' + err.error);
    }
  };

  const deleteProduct = async () => {
    if (!confirm('Delete this product?')) return;
    const updated = products.filter(p => p.id !== formData.id);
    const res = await fetch('/api/update-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: updated, token: session.accessToken }),
    });
    if (res.ok) {
      alert('✅ Deleted & pushed to GitHub!');
      window.location.reload();
    } else {
      const err = await res.json();
      alert('❌ ' + err.error);
    }
  };

  if (!products.length) return <p className="text-center mt-10">Loading products…</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Admin – Products (Live)</h1>

      <select onChange={e => handleSelect(e.target.value)} value={selectedId} className="border px-2 py-1">
        <option value="">-- Select Product --</option>
        {products.map(p => <option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}
        <option value="new">➕ Add New Product</option>
      </select>

      {formData && (
        <div className="border p-4 rounded space-y-4">
          <h2 className="text-xl font-semibold">{isNew ? 'Add New' : 'Edit'} Product</h2>
          {Object.keys(formData).map(key => (
            <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <label className="font-semibold">{key}</label>
              {['longDesc', 'metaDescription', 'specialNote'].includes(key) ? (
                <textarea name={key} value={formData[key]} onChange={handleChange} rows={3} className="border px-2 py-1" />
              ) : key === 'active' ? (
                <input type="checkbox" name={key} checked={formData[key]} onChange={handleChange} />
              ) : key === 'qtyDiscount' ? (
                <textarea name={key} value={JSON.stringify(formData[key], null, 2)} onChange={handleChange} rows={3} className="font-mono border px-2 py-1" />
              ) : (
                <input type={typeof formData[key] === 'number' ? 'number' : 'text'} name={key} value={formData[key]} onChange={handleChange} className="border px-2 py-1" />
              )}
            </div>
          ))}

          <div className="flex gap-2">
            <button onClick={saveProduct} className="bg-green-600 text-white px-4 py-2 rounded">Save to GitHub</button>
            {!isNew && <button onClick={deleteProduct} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>}
          </div>
        </div>
      )}
    </div>
  );
}