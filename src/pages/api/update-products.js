// src/pages/api/update-products.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ✅ user ka personal token session se aaya
  const { products, token } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'No GitHub token provided' });
  }

  const REPO   = process.env.GITHUB_REPO;   // username/reponame
  const BRANCH = process.env.GITHUB_BRANCH || 'main';
  const PATH   = 'src/data/products.js';

  const content = `export default ${JSON.stringify(products, null, 2)};`;

  try {
    // 1. current file ka SHA nikalo
    const getRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${PATH}?ref=${BRANCH}`,
      { headers: { Authorization: `token ${token}` } }
    );
    if (!getRes.ok) throw new Error('Could not fetch file SHA');
    const { sha } = await getRes.json();

    // 2. push new content
    const putBody = {
      message: `Admin update via ${req.headers['x-forwarded-for'] ?? 'unknown'}`,
      content: Buffer.from(content).toString('base64'),
      sha,
      branch: BRANCH,
    };

    const putRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(putBody),
      }
    );

    if (!putRes.ok) {
      const err = await putRes.json();
      throw new Error(err.message ?? 'GitHub update failed');
    }

    res.status(200).json({ message: 'products.js updated on GitHub' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}