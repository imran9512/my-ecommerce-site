import { useEffect, useState } from 'react';
import { SITE_NAME } from '@/data/constants';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const OWNER = 'imran9512';
const REPO  = 'my-ecommerce-site';
const FILE  = 'src/data/products.js';

export default function AdminProducts() {
  const [token, setToken] = useState('');
  const [products, setProducts] = useState([]);
  const [edit, setEdit] = useState(null);
  const [images, setImages] = useState([]);
  const [folders, setFolders] = useState(['', 'other-img']);

  /* GitHub helpers */
  const api = (path, opts) =>
    fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
      ...opts,
    }).then((r) => r.json());

  /* OAuth login (popup) */
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
              setToken(token);
            });
        }
      } catch {}
    }, 500);
  };

  /* Load products & images */
  useEffect(() => {
    const t = localStorage.getItem('gh_token');
    if (!t) return;
    setToken(t);
    api(`/contents/${FILE}`)
      .then((f) => fetch(f.download_url))
      .then((r) => r.text())
      .then((txt) => setProducts(eval(txt.replace('export default', ''))));

    api(`/git/trees/main?recursive=1`)
      .then((r) =>
        r.tree
          .filter((f) => f.path.startsWith('public/Prod-images') && f.type === 'blob')
          .map((f) => f.path.replace('public/Prod-images/', ''))
      )
      .then(setImages);
  }, [token]);

  /* Save products */
  const save = async (list) => {
    const { sha } = await api(`/contents/${FILE}`);
    const content = btoa(`export default ${JSON.stringify(list, null, 2)}`);
    await api(`/contents/${FILE}`, {
      method: 'PUT',
      body: JSON.stringify({ message: 'Update products via admin', content, sha }),
    });
    setProducts(list);
  };

  /* Blank product template */
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

  /* Form helpers */
  const handleSave = (p) => {
    const idx = products.findIndex((x) => x.id === p.id);
    const list = idx >= 0 ? [...products] : [...products, p];
    list[idx >= 0 ? idx : list.length - 1] = p;
    save(list);
    setEdit(null);
  };
  const remove = (id) => save(products.filter((p) => p.id !== id));

  /* Field helpers */
  const handleArray = (key, val) => val.split(',').map((v) => v.trim());
  const handleObj = (key, val) => {
    const pairs = val.split(',').map((v) => v.trim());
    const obj = {};
    pairs.forEach((p) => {
      const [k, v] = p.split(':');
      obj[k.trim()] = parseFloat(v);
    });
    return obj;
  };

  if (!token)
    return (
      <div className="p-10 text-center">
        <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">
          Login with GitHub
        </button>
      </div>
    );

  /* ---------- FORM ---------- */
  const Form = ({ p, isNew }) => (
    <div className="space-y-4 border p-4 rounded">
      <h2 className="text-xl font-bold">{isNew ? 'Add Product' : 'Edit Product'}</h2>

      {/* Simple inputs */}
      {['id', 'slug', 'name', 'sku', 'stock', 'rating', 'reviewCount', 'price', 'offerPrice', 'shortDesc', 'longDesc', 'specialNote', 'metaTitle', 'metaDescription', 'ActiveSalt'].map((k) => (
        <input
          key={k}
          placeholder={k}
          value={p[k] || ''}
          onChange={(e) => setEdit({ ...p, [k]: k === 'stock' || k === 'rating' ? Number(e.target.value) : e.target.value })}
          className="w-full border px-2 py-1"
        />
      ))}

      {/* Multi-line arrays */}
      <label>Images (comma-separated)</label>
      <select
        multiple
        value={p.images || []}
        onChange={(e) => setEdit({ ...p, images: Array.from(e.target.selectedOptions, (o) => o.value) })}
        className="w-full border px-2 py-1"
      >
        {images.map((img) => (
          <option key={img} value={`/Prod-images/${img}`}>
            {img}
          </option>
        ))}
      </select>

      <label>Categories (comma-separated)</label>
      <input
        placeholder="fitness,health"
        value={(p.categories || []).join(',')}
        onChange={(e) => setEdit({ ...p, categories: handleArray('categories', e.target.value) })}
        className="w-full border px-2 py-1"
      />

      <label>Qty Discount (qty:price,...)</label>
      <input
        placeholder="2:290,3:280"
        value={Object.entries(p.qtyDiscount || {})
          .map(([k, v]) => `${k}:${v}`)
          .join(',')}
        onChange={(e) => setEdit({ ...p, qtyDiscount: handleObj('qtyDiscount', e.target.value) })}
        className="w-full border px-2 py-1"
      />

      <label>Related (comma product IDs)</label>
      <input
        placeholder="001,002"
        value={(p.related || []).join(',')}
        onChange={(e) => setEdit({ ...p, related: handleArray('related', e.target.value) })}
        className="w-full border px-2 py-1"
      />

      {/* Reviews */}
      <div>
        <label>Reviews (JSON)</label>
        <textarea
          placeholder='[{"date":"2024-05-15","name":"Ali","rating":5,"comment":"great"}]'
          value={JSON.stringify(p.reviews || [], null, 2)}
          onChange={(e) => {
            try {
              setEdit({ ...p, reviews: JSON.parse(e.target.value) });
            } catch {}
          }}
          className="w-full border px-2 py-1 h-32"
        />
      </div>

      <div className="flex space-x-2">
        <button onClick={() => handleSave(p)} className="bg-green-500 text-white px-3 py-1">
          Save
        </button>
        {!products.find((x) => x.id === p.id) && (
          <button onClick={() => handleSave(p)} className="bg-blue-500 text-white px-3 py-1">
            Add
          </button>
        )}
        {products.find((x) => x.id === p.id) && (
          <button onClick={() => remove(p.id)} className="bg-red-500 text-white px-3 py-1">
            Delete
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{SITE_NAME} – Product Manager</h1>
      <button onClick={() => setEdit(blank)} className="mb-4 bg-blue-500 text-white px-3 py-1">
        + New Product
      </button>

      {edit && <Form p={edit} />}
      {!edit && (
        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.id} className="border p-2">
              <strong>{p.name}</strong>
              <button onClick={() => setEdit(p)} className="ml-2 text-blue-600">
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}