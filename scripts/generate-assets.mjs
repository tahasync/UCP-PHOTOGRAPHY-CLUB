/**
 * Branding + placeholder asset generator.
 *
 *   npm run assets            (uses D:/UPC/Logo-Photography-Club-01.png)
 *   LOGO_PATH=... npm run assets
 *
 * Outputs (all replaceable later without touching components):
 *   public/images/branding/upc-logo.png        optimised official logo
 *   public/images/branding/favicon.svg         temporary wrapped raster mark
 *   public/images/branding/favicon-16/32/48.png
 *   public/images/branding/apple-touch-icon.png
 *   public/images/branding/icon-192.png, icon-512.png
 *   public/images/branding/og-cover.jpg        Open Graph image (1200x630)
 *   public/images/members/member-placeholder-0{1,2,3}.jpg/.webp
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const LOGO_SOURCE =
  process.env.LOGO_PATH || path.join('D:', 'UPC', 'Logo-Photography-Club-01.png');

const BRAND_DIR = path.join(ROOT, 'public', 'images', 'branding');
const MEMBER_DIR = path.join(ROOT, 'public', 'images', 'members');

/* The camera mark occupies the upper square of the artwork. */
const EMBLEM_WIDTH_RATIO = 0.66;
const EMBLEM_TOP_RATIO = 0;

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const squareIcon = async (buffer, size, padding = 0) => {
  const inner = Math.max(8, size - padding * 2);
  return sharp(buffer)
    .resize({ width: inner, height: inner, fit: 'contain', background: WHITE })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: WHITE
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
};

const memberPlaceholderSvg = (variant) => {
  const headY = 520 + variant * 14;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
  <rect width="1200" height="1500" fill="#f5f5f5"/>
  <circle cx="600" cy="${headY}" r="200" fill="#e2e2e2"/>
  <path d="M600 700c-152 0-302 132-332 334-12 76-18 210-18 466h700c0-256-6-390-18-466-30-202-180-334-332-334z" fill="#e2e2e2"/>
  <rect x="44" y="44" width="1112" height="1412" fill="none" stroke="#e5e5e5" stroke-width="2"/>
  <rect x="84" y="118" width="88" height="6" fill="#000000"/>
  <rect x="84" y="1372" width="132" height="8" fill="#ff0000"/>
</svg>`;
};

const main = async () => {
  await fs.mkdir(BRAND_DIR, { recursive: true });
  await fs.mkdir(MEMBER_DIR, { recursive: true });

  // ---------------------------------------------------------------- logo
  const source = await fs.readFile(LOGO_SOURCE);
  const trimmedBuffer = await sharp(source).trim({ threshold: 12 }).png().toBuffer();
  const trimmedMeta = await sharp(trimmedBuffer).metadata();

  const logo = await sharp(trimmedBuffer)
    .resize({ width: 1400, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const logoMeta = await sharp(logo).metadata();
  await fs.writeFile(path.join(BRAND_DIR, 'upc-logo.png'), logo);

  // ------------------------------------------------------------- emblem
  const side = Math.round(
    Math.min(trimmedMeta.width, Math.round(trimmedMeta.height * EMBLEM_WIDTH_RATIO))
  );
  const emblem = await sharp(trimmedBuffer)
    .extract({
      left: Math.max(0, Math.round((trimmedMeta.width - side) / 2)),
      top: Math.round(trimmedMeta.height * EMBLEM_TOP_RATIO),
      width: side,
      height: side
    })
    .png()
    .toBuffer();

  // ------------------------------------------------------------ favicons
  const emblem128 = await squareIcon(emblem, 128, 4);
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect width="128" height="128" fill="#ffffff"/>
  <image href="data:image/png;base64,${emblem128.toString('base64')}" width="128" height="128"/>
</svg>
`;
  await fs.writeFile(path.join(BRAND_DIR, 'favicon.svg'), faviconSvg);
  await fs.writeFile(
    path.join(BRAND_DIR, 'favicon-16.png'),
    await squareIcon(emblem, 16, 1)
  );
  await fs.writeFile(
    path.join(BRAND_DIR, 'favicon-32.png'),
    await squareIcon(emblem, 32, 2)
  );
  await fs.writeFile(
    path.join(BRAND_DIR, 'apple-touch-icon.png'),
    await squareIcon(emblem, 180, 18)
  );
  await fs.writeFile(
    path.join(BRAND_DIR, 'icon-192.png'),
    await squareIcon(emblem, 192, 20)
  );
  await fs.writeFile(
    path.join(BRAND_DIR, 'icon-512.png'),
    await squareIcon(emblem, 512, 52)
  );

  // ------------------------------------------------------------ OG image
  const ogLogo = await sharp(trimmedBuffer)
    .resize({ height: 430, fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer();
  const ogLogoMeta = await sharp(ogLogo).metadata();
  const redBar = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="630"><rect width="26" height="630" fill="#ff0000"/></svg>'
  );

  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: '#ffffff' }
  })
    .composite([
      { input: redBar, top: 0, left: 0 },
      {
        input: ogLogo,
        top: Math.round((630 - ogLogoMeta.height) / 2),
        left: Math.round((1200 - ogLogoMeta.width) / 2)
      }
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(BRAND_DIR, 'og-cover.jpg'));

  // -------------------------------------------- neutral member portraits
  for (const variant of [1, 2, 3]) {
    const svg = Buffer.from(memberPlaceholderSvg(variant));
    const base = path.join(MEMBER_DIR, `member-placeholder-0${variant}`);
    await sharp(svg).jpeg({ quality: 82, mozjpeg: true }).toFile(`${base}.jpg`);
    await sharp(svg).webp({ quality: 78 }).toFile(`${base}.webp`);
  }

  console.log('Branding assets written to public/images/branding');
  console.log(
    `  logo: ${logoMeta.width}x${logoMeta.height} | emblem: ${side}x${side}`
  );
  console.log('Member placeholders written to public/images/members');
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

