// src/pages/api/images2.js
// Returns JSON: { files: ['img1.png', 'img2.jpg', ...] }
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const dir = path.join(process.cwd(), 'public', 'pix');
  let files = [];
  try {
    files = fs.readdirSync(dir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
    });
  } catch (e) {
    /* dir not there yet → return empty array */
  }
  res.status(200).json({ files });
}