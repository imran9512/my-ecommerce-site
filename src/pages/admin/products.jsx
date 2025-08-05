// src/pages/admin/products.jsx
import { useEffect, useState, useRef } from 'react';
import { SITE_NAME } from '@/data/constants';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const OWNER = 'imran9512';
const REPO  = 'my-ecommerce-site';
const FILE  = 'src/data/products.js';

/* ---------------- helpers ---------------- */
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

export default function AdminProducts() {
  const [token, setToken] = useState('');
  const [products, setProducts] = useState([]);
  const [edit, setEdit] = useState(null);
  const [images, setImages] = useState([]);

  /* load products */
  useEffect(() => {
    const t = localStorage.getItem('gh_token');
    if (!t) return setToken('');
    setToken(t);
    api(`/contents/${FILE}`)
      .then((f) => fetch(f.download_url))
      .then((r) => r.text())
      .then((txt) => setProducts(eval(txt.replace('export default', ''))));

    /* load images from public/Prod-images */
    fetch('/Prod-images')
      .then((r) => r.text())
      .then((txt) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(txt, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'))
          .map((a) => a.textContent.trim())
          .filter((t) => t.endsWith('.webp') || t.endsWith('.jpg'));
        setImages(links);
      });
  }, [token]);

  const save = async (list) => {
    const { sha } = await api(`/contents/${FILE}`);
    const content = btoa(`export default ${JSON.stringify(list, null, 2)}`);
    await api(`/contents/${FILE}`, {
      method: 'PUT',
      body: JSON.stringify({ message: 'Update via admin', content, sha }),
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
  const handleArray = (val) => val.split(',').map((v) => v.trim()).filter(Boolean);
  const handleObj = (val) => {
    const obj = {};
    val.split(',').forEach((pair) => {
      const [k, v] = pair.split(':');
      if (k && v) obj[k.trim()] = Number(v.trim());
    });
    return obj;
  };

  /* form state & refs */
  const formRef = useRef(null);
  const [form, setForm] = useState({ ...blank });

  /* edit existing */
  useEffect(() => {
    if (edit) setForm({ ...edit });
  }, [edit]);

  const handleChange = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const handleSave = () => {
    const idx = products.findIndex((p) => p.id === form.id);
    const list = idx >= 0 ? [...products] : [...products, form];
    list[idx >= 0 ? idx : list.length - 1] = form;
    save(list);
  };
  const remove = (id) => save(products.filter((p) => p.id !== id));

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

  /* image picker */
  const ImagePicker = ({ value, onChange }) => (
    <div>
      <label>Images</label>
      <select
        multiple
        value={value || []}
        onChange={(e) => onChange(Array.from(e.target.selectedOptions, (o) => o.value))}
        className="w-full border px-2 py-1 h-32"
      >
        {images.map((img) => (
          <option key={img} value={`/Prod-images/${img}`}>
            {img}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-1 mt-1">
        {value?.map((img) => (
          <img key={img} src={img} className="w-10 h-10 object-cover rounded" alt="" />
        ))}
      </div>
    </div>
  );

  /* form field component */
  const Field = ({ k, type = 'text', isArray = false, isObj = false }) => (
    <div>
      <label className="block font-semibold text-sm">{k}</label>
      {type === 'textarea' ? (
        <textarea
          value={form[k] || ''}
          onChange={(e) => handleChange(k, e.target.value)}
          className="w-full border px-2 py-1"
        />
      ) : isArray ? (
        <input
          value={(form[k] || []).join(', ')}
          onChange={(e) => handleChange(k, handleArray(e.target.value))}
          className="w-full border px-2 py-1"
          placeholder="comma separated"
        />
      ) : isObj ? (
        <input
          value={Object.entries(form[k] || {})
            .map(([a, b]) => `${a}:${b}`)
            .join(', ')}
          onChange={(e) => handleChange(k, handleObj(e.target.value))}
          className="w-full border px-2 py-1"
          placeholder="qty:price, qty:price"
        />
      ) : (
        <input
          value={form[k] || ''}
          onChange={(e) => handleChange(k, type === 'number' ? Number(e.target.value) : e.target.value)}
          className="w-full border px-2 py-1"
          type={type}
        />
      )}
    </div>
  );

  /* review builder */
  const ReviewBuilder = () => (
    <div>
      <label className="block font-semibold text-sm">Reviews</label>
      {form.reviews.map((r, idx) => (
        <div key={idx} className="flex flex-col space-y-1 border p-2 mb-2">
          <input placeholder="date" value={r.date} onChange={(e) => updateReview(idx, 'date', e.target.value)} />
          <input placeholder="name" value={r.name} onChange={(e) => updateReview(idx, 'name', e.target.value)} />
          <input placeholder="rating" type="number" value={r.rating} onChange={(e) => updateReview(idx, 'rating', Number(e.target.value))} />
          <textarea placeholder="comment" value={r.comment} onChange={(e) => updateReview(idx, 'comment', e.target.value)} />
          <button onClick={() => removeReview(idx)} className="text-red-500 text-xs">
            Remove
          </button>
        </div>
      ))}
      <button onClick={addReview} className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
        + Add Review
      </button>
    </div>
  );

  if (!token)
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
        value={edit?.id || ''}
        onChange={(e) => setEdit(products.find((p) => p.id === e.target.value))}
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
      <button onClick={() => setEdit({ ...blank })} className="mb-4 bg-green-500 text-white px-3 py-1">
        + New Product
      </button>

      {edit && (
        <div className="space-y-3 border p-4 rounded">
          <Field k="id" />
          <Field k="slug" />
          <Field k="name" />
          <Field k="sku" />
          <Field k="stock" type="number" />
          <Field k="rating" type="number" />
          <Field k="reviewCount" type="number" />
          <Field k="price" type="number" />
          <Field k="offerPrice" type="number" />
          <ImagePicker value={edit.images} onChange={(v) => handleChange('images', v)} />
          <Field k="categories" isArray />
          <Field k="qtyDiscount" isObj />
          <Field k="related" isArray />
          <Field k="shortDesc" type="textarea" />
          <Field k="longDesc" type="textarea" />
          <Field k="specialNote" />
          <Field k="metaTitle" />
          <Field k="metaDescription" />
          <Field k="ActiveSalt" />
          <ReviewBuilder />
          <div className="flex space-x-2">
            <button onClick={handleSave} className="bg-blue-500 text-white px-3 py-1">
              Save
            </button>
            {edit.id && (
              <button onClick={() => remove(edit.id)} className="bg-red-500 text-white px-3 py-1">
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}