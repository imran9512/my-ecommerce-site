// src/pages/api/github-token.js
export default async function handler(req, res) {
  const { code } = req.body;
  const r = await fetch(
    `https://github.com/login/oauth/access_token`,
    {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: 'Ov23liigiC0PS07gHcCK',
        client_secret: '7008721c67330cd943f96886b8a025b2f3bd3ab1',
        code,
      }),
    }
  );
  const data = await r.json();
  res.json({ token: data.access_token });
}