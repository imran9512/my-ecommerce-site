
// pages/admin.js
import { useSession, signIn } from 'next-auth/react';
import { Octokit } from '@octokit/core';
import { useState, useEffect } from 'react';

const octokit = new Octokit({ auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN });

export default function Admin() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: '', price: '', image: '', desc: '' });

  // load products
  useEffect(() => {
    if (!session) return;
    fetch('/products.json')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [session]);

  // save products (commit to repo)
  async function saveProducts(list) {
    const content = btoa(JSON.stringify(list, null, 2));
    const { data } = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'imran9512',
      repo: 'my-ecommerce-site',
      path: 'public/products.json',
      message: 'Update products via admin',
      content,
      sha: (await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: 'imran9512',
        repo: 'my-ecommerce-site',
        path: 'public/products.json'
      })).data.sha
    });
    setProducts(list);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = { id: Date.now(), ...form, price: Number(form.price) };
    saveProducts([...products, newProduct]);
    setForm({ title: '', price: '', image: '', desc: '' });
  };

  if (status === 'loading') return <p>Loading…</p>;
  if (!session) return (
    <main className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <button onClick={() => signIn('github')} className="bg-black text-white px-4 py-2 rounded">
        Sign in with GitHub
      </button>
    </main>
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Add product form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input required placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border px-3 py-2 rounded" />
        <input required placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} type="number" className="w-full border px-3 py-2 rounded" />
        <input required placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full border px-3 py-2 rounded" />
        <textarea required placeholder="Description" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} className="w-full border px-3 py-2 rounded" rows="3"></textarea>
        <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded">Add Product</button>
      </form>

      {/* List & delete */}
      <h2 className="text-xl mb-4">Products</h2>
      <div className="space-y-2">
        {products.map(p => (
          <div key={p.id} className="flex justify-between items-center border px-3 py-2 rounded">
            <span>{p.title} – ${p.price}</span>
            <button onClick={() => saveProducts(products.filter(x => x.id !== p.id))} className="text-red-500 text-sm">Delete</button>
          </div>
        ))}
      </div>
    </main>
  );
}