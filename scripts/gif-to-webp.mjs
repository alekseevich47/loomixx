import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const inp = process.argv[2];
const out = process.argv[3];
const size = Number(process.argv[4] || 128);
const quality = Number(process.argv[5] || 55);

if (!inp || !out) {
  console.error('Usage: node gif-to-webp.mjs <input.gif> <output.webp> [size=128] [quality=55]');
  process.exit(1);
}

await mkdir(path.dirname(out), { recursive: true });

const info = await sharp(inp, { animated: true, limitInputPixels: false })
  .resize(size, size, { fit: 'inside' })
  .webp({ quality, effort: 6, loop: 0 })
  .toFile(out);

console.log(JSON.stringify({ out, ...info }, null, 2));
