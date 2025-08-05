// src/pages/admin/products.jsx
import { useEffect, useState } from 'react';
import { SITE_NAME } from '@/data/constants';

const OWNER = 'imran9512';
const REPO  = 'my-ecommerce-site';
const FILE  = 'src/data/products.js';

export default function AdminProducts() {
  const [token, setToken] = useState('');
  const [products, setProducts] = useState([]);
  const [edit, setEdit]   = useState(null);
  const [newProd, setNew] = useState({});

  /* GitHub API helpers */
  const api = (path, opts) =>
    fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
      ...opts,
    }).then((r) => r.json());

  /* OAuth popup */
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

  /* Load products */
  useEffect(() => {
    const t = localStorage.getItem('gh_token');
    if (t) setToken(t);
    else return;
    api(`/contents/${FILE}`)
      .then((f) => fetch(f.download_url))
      .then((r) => r.text())
      .then((txt) => {
        const data = eval(txt.replace('export default ', ''));
        setProducts(data);
      });
  }, [token]);

  /* Save products */
  const save = async (newList) => {
    const { sha } = await api(`/contents/${FILE}`);
    const content = btoa(
      `export default ${JSON.stringify(newList, null, 2)}`
    );
    await api(`/contents/${FILE}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: 'Update products via admin',
        content,
        sha,
      }),
    });
    setProducts(newList);
  };

  if (!token)
    return (
      <div className="p-10 text-center">
        <button
          onClick={login}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login with GitHub
        </button>
      </div>
    );

  /* Form helpers */
  const handleSave = (p) => {
    const idx = products.findIndex((x) => x.id === p.id);
    const list = [...products];
    list[idx] = p;
    save(list);
    setEdit(null);
  };
  const addProduct = () => {
    const id = Date.now().toString();
    save([...products, { ...newProd, id }]);
    setNew({});
  };
  const remove = (id) => save(products.filter((p) => p.id !== id));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{SITE_NAME} – Product Admin</h1>
      <select
        onChange={(e) => setEdit(products.find((p) => p.id === e.target.value))}
        className="mb-4 border px-2 py-1"
      >
        <option>Select Product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Edit form */}
      {edit && (
        <div className="space-y-2">
          {Object.keys(edit).map((k) => (
            <input
              key={k}
              value={edit[k]}
              onChange={(e) => setEdit({ ...edit, [k]: e.target.value })}
              className="w-full border px-2 py-1"
            />
          ))}
          <button onClick={() => handleSave(edit)} className="bg-green-500 text-white px-3 py-1">
            Save
          </button>
        </div>
      )}

      {/* Add new */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
        <input
          placeholder="name"
          value={newProd.name || ''}
          onChange={(e) => setNew({ ...newProd, name: e.target.value })}
          className="border px-2 py-1 mr-2"
        />
        <button onClick={addProduct} className="bg-blue-500 text-white px-3 py-1">
          Add
        </button>
      </div>
    </div>
  );
}