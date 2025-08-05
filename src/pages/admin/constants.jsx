// src/pages/admin/constants.jsx
import { useEffect, useState } from 'react';
import { SITE_NAME } from '@/data/constants';

const OWNER = 'imran9512';
const REPO  = 'my-ecommerce-site';
const FILE  = 'src/data/constants.js';

export default function AdminConstants() {
  const [token, setToken] = useState('');
  const [lines, setLines] = useState([]);
  const [edit, setEdit] = useState({ key: '', val: '' });

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
    api(`/contents/${FILE}`)
      .then((f) => fetch(f.download_url))
      .then((r) => r.text())
      .then((txt) => {
        const arr = txt.split('\n').filter((l) => /^export const/.test(l));
        setLines(arr.map((l) => ({ key: l.match(/const\s+(\w+)/)[1], val: l.split('=')[1] })));
      });
  }, [token]);

  const save = async (newLines) => {
    const { sha } = await api(`/contents/${FILE}`);
    const content = btoa(
      `// auto-generated\n${newLines.map((l) => `export const ${l.key} = ${l.val}`).join('\n')}`
    );
    await api(`/contents/${FILE}`, {
      method: 'PUT',
      body: JSON.stringify({ message: 'Update constants', content, sha }),
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
      <h1 className="text-2xl font-bold mb-4">{SITE_NAME} – Constants Admin</h1>
      {lines.map((l) => (
        <div key={l.key} className="mb-2">
          <span className="font-mono">{l.key} = </span>
          <input
            value={l.val}
            onChange={(e) =>
              setLines(lines.map((x) => (x.key === l.key ? { ...x, val: e.target.value } : x)))
            }
            className="border px-2 py-1 w-64"
          />
        </div>
      ))}
      <button onClick={() => save(lines)} className="bg-green-500 text-white px-3 py-1 mt-4">
        Save
      </button>
    </div>
  );
}