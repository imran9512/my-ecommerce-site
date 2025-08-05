// src/pages/admin/images.jsx
import { useEffect, useState } from 'react';
import { SITE_NAME } from '@/data/constants';

const OWNER = 'imran9512';
const REPO  = 'my-ecommerce-site';
const BASE  = 'public/Prod-images';

export default function AdminImages() {
  const [token, setToken] = useState('');
  const [files, setFiles] = useState([]);
  const [folder, setFolder] = useState('');

  const api = (path, opts) =>
    fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
      ...opts,
    }).then((r) => r.json());

  /* same login as products page (copy) */
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

  useEffect(() => {
    const t = localStorage.getItem('gh_token');
    if (t) setToken(t);
    else return;
    api(`/git/trees/main?recursive=1`)
      .then((r) =>
        r.tree
          .filter((f) => f.path.startsWith(BASE) && f.type === 'blob')
          .map((f) => f.path.replace(BASE, ''))
      )
      .then(setFiles);
  }, [token]);

  const upload = async (file, path) => {
    const base64 = await file.arrayBuffer().then((b) => btoa(new Uint8Array(b).reduce((a, c) => a + String.fromCharCode(c), '')));
    const filePath = `${BASE}${path}/${file.name}`;
    await api(`/contents/${filePath}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Upload ${file.name}`,
        content: base64,
      }),
    });
    window.location.reload();
  };

  const remove = async (path) => {
    const { sha } = await api(`/contents/${BASE}${path}`);
    await api(`/contents/${BASE}${path}`, {
      method: 'DELETE',
      body: JSON.stringify({ message: `Delete ${path}`, sha }),
    });
    window.location.reload();
  };

  if (!token)
    return (
      <div className="p-10 text-center">
        <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">
          Login with GitHub
        </button>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{SITE_NAME} – Image Manager</h1>

      <input
        type="file"
        onChange={(e) =>
          upload(e.target.files[0], folder)
        }
        accept="image/*"
        className="mb-4"
      />

      <div className="grid grid-cols-3 gap-4">
        {files.map((f) => (
          <div key={f} className="relative">
            <img
              src={`https://raw.githubusercontent.com/${OWNER}/${REPO}/main/public/Prod-images${f}`}
              alt={f}
              className="w-full h-24 object-cover rounded"
            />
            <button
              onClick={() => remove(f)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}