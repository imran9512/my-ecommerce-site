// scripts/updateFromSheet.js
const { google } = require('googleapis');
const fs = require('fs');

const SERVICE_ACCOUNT_JSON = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const FILE_MAP = [
  { sheet: 'prod-code', range: 'B1', filePath: 'src/data/products.js' },
  { sheet: 'cons-code', range: 'B1', filePath: 'src/data/constants.js' },
  { sheet: 'rev-code',  range: 'B1', filePath: 'src/data/reviews.js' },
  { sheet: 'cat-code',  range: 'B1', filePath: 'src/data/categoryContent.js' }
];

(async () => {
  const jwt = new google.auth.JWT(
    SERVICE_ACCOUNT_JSON.client_email,
    null,
    SERVICE_ACCOUNT_JSON.private_key,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
  );
  await jwt.authorize();
  const sheets = google.sheets({ version: 'v4', auth: jwt });

  for (const { sheet, range, filePath } of FILE_MAP) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${sheet}!${range}`
    });
    const content = res.data.values?.[0]?.[0] || '';
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
