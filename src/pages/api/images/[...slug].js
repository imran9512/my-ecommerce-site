// src/pages/api/images/[...slug].js
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  const { slug } = req.query;

  const imagePath = path.join(process.cwd(), 'public', 'Prod-images', ...slug);
  const watermarkPath = path.join(process.cwd(), 'public', 'watermark2.png');

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Image not found' });
  }
  if (!fs.existsSync(watermarkPath)) {
    return res.status(500).json({ error: 'Watermark missing' });
  }

  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const watermarkBuffer = fs.readFileSync(watermarkPath);

    const imgMeta = await sharp(imageBuffer).metadata();

    // 05% padding har side se
    const padding = 0.05;
    const availW = Math.round(imgMeta.width * (1 - 2 * padding));   // usable width
    const availH = Math.round(imgMeta.height * (1 - 2 * padding));   // usable height

    // watermark ko available area ka 100% tak resize karo
    const wmMeta = await sharp(watermarkBuffer).metadata();
    const scale = Math.min(
      availW / wmMeta.width,
      availH / wmMeta.height
    );

    const wmWidth = Math.round(wmMeta.width * scale);
    const wmHeight = Math.round(wmMeta.height * scale);

    const top = Math.round((imgMeta.height - wmHeight) / 2);
    const left = Math.round((imgMeta.width - wmWidth) / 2);

    const processed = await sharp(imageBuffer)
      .composite([
        {
          input: await sharp(watermarkBuffer)
            .resize(wmWidth, wmHeight)
            .modulate({ opacity: 255 })
            .toBuffer(),
          top,
          left,
        },
      ])
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