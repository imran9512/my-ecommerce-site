import { useEffect, useState } from 'react';

const OWNER = 'imran9512';
const REPO  = 'my-ecommerce-site';
const FILE  = 'src/data/products.js';

export default function AdminProducts() {
  const [token, setToken]         = useState('');
  const [products, setProducts]   = useState([]);
  const [form, setForm]           = useState(null);

  /* GitHub API wrapper */
  const api = (path, opts) =>
    fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
      headers: { Authorization: `token ${localStorage.getItem('gh_token')}` },
      ...opts,
    }).then((r) => r.json());

  /* OAuth popup (unchanged) */
  const login = () => {
    const url = `https://github.com/login/oauth/authorize?client_id=Ov23liigiC0PS07gHcCK&scope=repo`;
    window.open(url, 'oauth', 'width=500,height=600');
  };

  /* load products once on mount */
  useEffect(() => {
    const t = localStorage.getItem('gh_token');
    if (!t) return;
    api(`/contents/${FILE}`)
      .then((f) => fetch(f.download_url))
      .then((r) => r.text())
      .then((txt) => setProducts(eval(txt.replace('export default', ''))));
  }, []);

  /* save */
  const save = async (list) => {
    const { sha } = await api(`/contents/${FILE}`);
    const content = btoa(`export default ${JSON.stringify(list, null, 2)}`);
    await api(`/contents/${FILE}`, {
      method: 'PUT',
      body: JSON.stringify({ message: 'Update products', content, sha }),
    });
    alert('Products updated');
    location.reload();
  };

  /* helpers */
  const blank = { id: Date.now().toString(), name: '', slug: '', price: 0, images: [], categories: [], reviews: [] };
  const [edit, setEdit] = useState(blank);

  if (!localStorage.getItem('gh_token'))
    return (
      <div className="p-10 text-center">
        <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">
          Login with GitHub
        </button>
      </div>
    );

  /* dropdown of existing products */
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product Admin</h1>

      <select
        value={edit?.id || ''}
        onChange={(e) => setEdit(products.find((p) => p.id === e.target.value) || blank)}
        className="mb-4 border px-2 py-1"
      >
        <option value="">-- Select Product to Edit --</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Form (simple JSON textarea) */}
      <textarea
        value={JSON.stringify(edit, null, 2)}
        onChange={(e) => setEdit(JSON.parse(e.target.value))}
        className="w-full border px-2 py-1 h-96"
      />

      <div className="mt-4 flex space-x-2">
        <button onClick={() => save(products)} className="bg-blue-500 text-white px-3 py-1">
          Save All
        </button>
      </div>
    </div>
  );
}