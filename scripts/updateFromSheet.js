// scripts/updateFromSheet.js
const { google } = require('googleapis');
const fs   = require('fs');

// Environment variables injected by GitHub Actions
const SERVICE_ACCOUNT_JSON = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const FILE_MAP = [
  { sheet: 'prod-code', cell: 'B1', filePath: 'src/data/products.js' },
  { sheet: 'cons-code', cell: 'B1', filePath: 'src/data/constants.js' },
  { sheet: 'rev-code',  cell: 'B1', filePath: 'src/data/reviews.js' },
  { sheet: 'cat-code',  cell: 'B1', filePath: 'src/data/categoryContent.js' }
];

(async () => {
  // Authconst jwtClient = new google.auth.JWT(
  SERVICE_ACCOUNT_JSON.client_email,
  null,
  SERVICE_ACCOUNT_JSON.private_key,
  ['https://www.googleapis.com/auth/spreadsheets.readonly']
};
await jwtClient.authorize();
const sheets = google.sheets({ version: 'v4', auth: jwtClient });

  // Loop over files
  for (const { sheet, cell, filePath } of FILE_MAP) {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${sheet}!${cell}`
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
    } catch (err) {
      console.error(`❌ Failed to update ${filePath}:`, err.message);
    }
  }
})();
