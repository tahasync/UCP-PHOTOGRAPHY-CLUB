/**
 * Portrait optimiser (run after the official hierarchy photoshoot).
 *
 *   1. Put originals in  assets-source/members/   e.g. taha-naeem.jpg
 *   2. npm run images
 *   3. Paste the printed snippet into src/data/members.js
 *
 * Produces public/images/members/<slug>.jpg (max 1600px wide, 4:5 friendly)
 * and public/images/members/<slug>.webp for modern browsers.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'assets-source', 'members');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'members');

const MAX_WIDTH = 1600;
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif']);

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const main = async () => {
  let entries = [];
  try {
    entries = await fs.readdir(SOURCE_DIR);
  } catch {
    console.log(`No source folder yet: ${SOURCE_DIR}`);
    console.log('Create it and drop the official portraits inside, then re-run.');
    return;
  }

  const files = entries.filter((file) => SUPPORTED.has(path.extname(file).toLowerCase()));
  if (files.length === 0) {
    console.log(`No images found in ${SOURCE_DIR}`);
    return;
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const file of files) {
    const slug = slugify(file);
    const input = path.join(SOURCE_DIR, file);
    const jpgPath = path.join(OUT_DIR, `${slug}.jpg`);
    const webpPath = path.join(OUT_DIR, `${slug}.webp`);

    const pipeline = sharp(input)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true });

    await pipeline.clone().jpeg({ quality: 84, mozjpeg: true }).toFile(jpgPath);
    await pipeline.clone().webp({ quality: 80 }).toFile(webpPath);

    const meta = await sharp(jpgPath).metadata();
    console.log(`${file} -> ${slug}.jpg (${meta.width}x${meta.height}) + ${slug}.webp`);
    console.log('  data snippet:');
    console.log(`    image: '/images/members/${slug}.jpg',`);
    console.log(`    imageWebp: '/images/members/${slug}.webp',`);
    console.log('    imagePlaceholder: false,');
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
