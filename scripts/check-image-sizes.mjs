/**
 * Guards against the Lighthouse "images should have explicit dimensions" audit.
 *
 * Applies Lighthouse's own `unsized-images` rule to every image on every route:
 * an image passes when it has explicit width + height (HTML attributes or CSS),
 * or an explicit dimension plus an explicit aspect ratio. Run it with the
 * preview server up:
 *
 *   npm run build && npm run preview
 *   node scripts/check-image-sizes.mjs
 *
 * Chrome is emulated as a pointer device so the desktop hover portraits render.
 */

import puppeteer from 'puppeteer-core';

const BASE = process.env.PREVIEW_URL || 'http://localhost:4173';

const ROUTES = [
  '/',
  '/present-body',
  '/patrons',
  '/hierarchy',
  '/operations',
  '/editing',
  '/comms',
  '/social-media',
  '/creatives',
  '/vice-president',
  '/creatives/director-art-craft',
  '/patrons/co-patron'
];

const isExplicit = (value) =>
  value !== null &&
  value !== undefined &&
  !['auto', 'initial', 'unset', 'inherit'].includes(String(value));

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars']
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });

// Raw CDP: puppeteer's helper does not expose the `hover` media feature.
const cdp = await page.createCDPSession();
await cdp.send('Emulation.setEmulatedMedia', {
  features: [
    { name: 'hover', value: 'hover' },
    { name: 'pointer', value: 'fine' }
  ]
});

let flagged = 0;

for (const route of ROUTES) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0' });

  await page.evaluate(async () => {
    const step = Math.max(200, Math.round(window.innerHeight * 0.8));
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((resolve) => setTimeout(resolve, 400));

  const images = await page.evaluate(() =>
    [...document.querySelectorAll('img')].map((img) => {
      const cs = getComputedStyle(img);
      const rect = img.getBoundingClientRect();
      return {
        src: img.currentSrc.split('/').pop(),
        loading: img.getAttribute('loading'),
        attrW: img.getAttribute('width'),
        attrH: img.getAttribute('height'),
        cssW: cs.width,
        cssH: cs.height,
        aspect: cs.aspectRatio,
        position: cs.position,
        rendered: !(rect.width === 0 && rect.height === 0)
      };
    })
  );

  const unsized = images.filter((image) => {
    if (image.position === 'fixed' || image.position === 'absolute') return false;
    if (!image.rendered) return false;

    const htmlWidth = Number.isInteger(parseInt(image.attrW, 10)) && parseInt(image.attrW, 10) >= 0;
    const htmlHeight = Number.isInteger(parseInt(image.attrH, 10)) && parseInt(image.attrH, 10) >= 0;
    const cssWidth = isExplicit(image.cssW);
    const cssHeight = isExplicit(image.cssH);
    const ratio = isExplicit(image.aspect);
    const width = htmlWidth || cssWidth;
    const height = htmlHeight || cssHeight;

    return !((width && height) || (width && ratio) || (height && ratio));
  });

  flagged += unsized.length;
  console.log(
    `${route.padEnd(32)} images=${String(images.length).padEnd(2)} unsized=${unsized.length}`
  );

  for (const image of unsized) {
    console.log(
      `    ! ${image.src} loading=${image.loading} attr=${image.attrW}x${image.attrH} ` +
        `css=${image.cssW}x${image.cssH} aspect=${image.aspect}`
    );
  }
}

await browser.close();

if (flagged > 0) {
  console.log(`\n${flagged} image(s) would be flagged by Lighthouse.`);
  process.exitCode = 1;
} else {
  console.log('\nAll images carry explicit dimensions (Lighthouse-safe).');
}
