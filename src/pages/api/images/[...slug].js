// src/pages/api/images/[...slug].js
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  const { slug } = req.query;

  const imagePath     = path.join(process.cwd(), 'public', 'Prod-images', ...slug);
  const watermarkPath = path.join(process.cwd(), 'public', 'watermark.png');

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }
  if (!fs.existsSync(watermarkPath)) {
    return res.status(500).json({ error: 'Watermark missing' });
  }

  try {
    const imageBuffer     = fs.readFileSync(imagePath);
    const watermarkBuffer = fs.readFileSync(watermarkPath);

    const imgMeta = await sharp(imageBuffer).metadata();
    const wmMeta  = await sharp(watermarkBuffer).metadata();

    // ---- tweak here ----
    const scale    = 1.5;              // <== bigger / smaller
    const opacity  = 255;              // <== 0–255
    // --------------------

    const wmWidth  = Math.round(wmMeta.width  * scale);
    const wmHeight = Math.round(wmMeta.height * scale);

    const top  = Math.round((imgMeta.height - wmHeight) / 2);
    const left = Math.round((imgMeta.width  - wmWidth)  / 2);

    const processed = await sharp(imageBuffer)
      .composite([{
        input: await sharp(watermarkBuffer)
                 .resize(wmWidth, wmHeight)
                 .modulate({ opacity })
                 .toBuffer(),
        top,
        left,
      }])
      .webp({ quality: 100 })
      .toBuffer();

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(processed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Processing failed' });
  }
}

export const config = { api: { bodyParser: false } };