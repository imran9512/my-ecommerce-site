// scripts/updateFromSheet.js
const https = require('https');
const fs = require('fs');

const SERVICE_ACCOUNT_JSON = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const FILE_MAP = [
  { sheet: 'prod-code', range: 'B1', filePath: 'src/data/products.js' },
  { sheet: 'cons-code', range: 'B1', filePath: 'src/data/constants.js' },
  { sheet: 'rev-code', range: 'B1', filePath: 'src/data/reviews.js' },
  { sheet: 'cat-code', range: 'B1', filePath: 'src/data/categoryContent.js' },
  { sheet: 'faq-code', range: 'B1', filePath: 'src/data/faq.js' }
];

// ---- tiny JWT helper ----
function createJwt() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: SERVICE_ACCOUNT_JSON.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  const key = SERVICE_ACCOUNT_JSON.private_key;
  const jwt = require('jsonwebtoken');
  return require('jsonwebtoken').sign(claim, key, { algorithm: 'RS256' });
}

async function getAccessToken() {
  return new Promise((resolve, reject) => {
    const jwt = createJwt();
    const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data).access_token));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ---- main ----
(async () => {
  const token = await getAccessToken();
  for (const { sheet, range, filePath } of FILE_MAP) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheet}!${range}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const json = await res.json();
    const content = json.values?.[0]?.[0] || '';
    if (!content.trim()) {
      console.warn(`⚠️ Empty content for ${filePath}`);
      continue;
    }
    const dir = filePath.split('/').slice(0, -1).join('/');
    if (dir) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${filePath}`);
  }
})();
