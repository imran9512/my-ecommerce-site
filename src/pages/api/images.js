// pages/api/images.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const dir = path.join(process.cwd(), 'public', 'Prod-images');
  try {
    const files = fs.readdirSync(dir).filter((f) => !f.startsWith('.'));
    res.status(200).json(files);
  } catch {
    res.status(200).json([]);
  }
}