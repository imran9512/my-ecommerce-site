// scripts/updateFromSheet.js
const fs = require('fs');
const axios = require('axios');

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const API_KEY  = process.env.GOOGLE_API_KEY;

const FILE_MAP = [
  { sheet: 'prod-code', cell: 'B1', filePath: 'src/data/products.js' },
  { sheet: 'cons-code', cell: 'B1', filePath: 'src/data/constants.js' },
  { sheet: 'rev-code',  cell: 'B1', filePath: 'src/data/reviews.js' },
  { sheet: 'cat-code',  cell: 'B1', filePath: 'src/data/categoryContent.js' }
];

(async () => {
  for (const { sheet, cell, filePath } of FILE_MAP) {
    try {
      const range = `${sheet}!${cell}`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
      const res = await axios.get(url);
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
