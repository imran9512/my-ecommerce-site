// src/pages/admin/all.jsx
import { useEffect, useState } from 'react';

const OWNER = 'imran9512';
const REPO = 'my-ecommerce-site';

export default function AdminAll() {
  /* --- server guard --- */
  if (typeof window === 'undefined') return null;

  /* --- client only --- */
  const [token, setToken] = useState(localStorage.getItem('gh_token') || '');
  const [products, setProducts] = useState([]);
  const [constants, setConstants] = useState([]);
  const [images, setImages] = useState([]);

  const api = (path, opts) =>
    fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
      headers: { Authorization: `token ${token}` },
      ...opts,
    }).then((r) => r.json());

  const login = () =>
    window.open(`https://github.com/login/oauth/authorize?client_id=Ov23liigiC0PS07gHcCK&scope=repo`, 'oauth', 'width=500,height=600');

  /* load once */
  useEffect(() => {
    if (!token) return;
    Promise.all([
      api(`/contents/src/data/products.js`).then((f) => fetch(f.download_url).then((r) => r.text()).then((txt) => eval(txt.replace('export default', '')))),
      api(`/contents/src/data/constants.js`).then((f) => fetch(f.download_url).then((r) => r.text()).then((txt) => txt.split('\n').filter((l) => /^export const/.test(l)).map((l) => ({ key: l.match(/const\s+(\w+)/)[1], val: l.split('=')[1] })))),
      api('/git/trees/main?recursive=1').then((r) => r.tree.filter((f) => f.path.startsWith('public/Prod-images') && f.type === 'blob').map((f) => f.path.replace('public/Prod-images/', ''))),
    ]).then(([p, c, i]) => {
      setProducts(p);
      setConstants(c);
      setImages(i);
    });
  }, [token]);

  /* helpers */
  const saveFile = async (path, content, msg) => {
    const { sha } = await api(`/contents/${path}`);
    await api(`/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({ message: msg, content: btoa(content), sha }),
    });
    alert(`${msg} saved`);
    location.reload();
  };

  /* login screen */
  if (!token)
    return (
      <div className="p-10 text-center">
        <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">
          Login with GitHub
        </button>
      </div>
    );

  /* editable JSON for products */
  const [prodJSON, setProdJSON] = useState(JSON.stringify(products, null, 2));
  const [constJSON, setConstJSON] = useState(JSON.stringify(constants, null, 2));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">All-in-One Admin</h1>

      {/* PRODUCTS */}
      <section>
        <h2 className="text-xl font-bold">Products</h2>
        <textarea
          value={prodJSON}
          onChange={(e) => setProdJSON(e.target.value)}
          className="w-full h-60 border px-2 py-1 font-mono text-sm"
        />
        <button onClick={() => saveFile('src/data/products.js', prodJSON, 'Update products')} className="mt-2 bg-blue-500 text-white px-3 py-1">
          Save Products
        </button>
      </section>

      {/* CONSTANTS */}
      <section>
        <h2 className="text-xl font-bold">Constants</h2>
        <textarea
          value={constJSON}
          onChange={(e) => setConstJSON(e.target.value)}
          className="w-full h-40 border px-2 py-1 font-mono text-sm"
        />
        <button onClick={() => saveFile('src/data/constants.js', constJSON, 'Update constants')} className="mt-2 bg-green-500 text-white px-3 py-1">
          Save Constants
        </button>
      </section>

      {/* IMAGES */}
      <section>
        <h2 className="text-xl font-bold">Images</h2>
        <div className="grid grid-cols-4 gap-2 text-sm">
          {images.map((img) => (
            <a
              key={img}
              href={`https://raw.githubusercontent.com/${OWNER}/${REPO}/main/public/Prod-images/${img}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate bg-gray-100 p-1 rounded"
            >
              {img}
            </a>
          ))}
        </div>
        <p className="text-xs mt-2 text-gray-500">
          Upload/delete via GitHub UI:{' '}
          <a
            href={`https://github.com/${OWNER}/${REPO}/tree/main/public/Prod-images`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            GitHub folder
          </a>
        </p>
      </section>
    </div>
  );
}