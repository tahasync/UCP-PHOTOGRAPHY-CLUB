/**
 * GitHub Pages deep-link test.
 *
 *   npm run build:gh
 *   node scripts/check-gh-pages.mjs
 *
 * Simulates GitHub Pages: serves dist/ under the /UCP-PHOTOGRAPHY-CLUB/ base and
 * answers unknown paths with 404.html (exactly like Pages does). Then it opens
 * QR-style URLs in a real browser and asserts the identity page rendered.
 */

import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const BASE = '/UCP-PHOTOGRAPHY-CLUB';
const PORT = Number(process.env.GH_TEST_PORT || 4180);

const BROWSERS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);

  if (pathname.startsWith(BASE)) {
    pathname = pathname.slice(BASE.length) || '/';
  }

  const candidates = [
    path.join(DIST, pathname),
    path.join(DIST, pathname, 'index.html')
  ];

  for (const candidate of candidates) {
    try {
      const data = await fs.readFile(candidate);
      response.writeHead(200, {
        'Content-Type': TYPES[path.extname(candidate)] || 'application/octet-stream'
      });
      response.end(data);
      return;
    } catch {
      /* try the next candidate */
    }
  }

  // GitHub Pages behaviour: unknown path -> 404.html with a 404 status.
  const notFound = await fs.readFile(path.join(DIST, '404.html'));
  response.writeHead(404, { 'Content-Type': TYPES['.html'] });
  response.end(notFound);
});

const findBrowser = async () => {
  for (const candidate of BROWSERS) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      /* keep looking */
    }
  }
  throw new Error('No Chrome or Edge installation found.');
};

const CASES = [
  { path: '/', expect: 'Photography' },
  { path: '/present-body', expect: 'Tayyab Iftikhar' },
  { path: '/patrons', expect: 'Patrons' },
  { path: '/hierarchy', expect: 'Operations' },
  { path: '/operations', expect: 'Abdul Rahman' },
  {
    path: '/vice-president',
    expect: 'Taha Naeem',
    title: 'Taha Naeem, Vice President'
  },
  { path: '/editing/director', expect: 'Mateen Kashif' },
  { path: '/creatives/director-art-craft', expect: 'Farmeen Aejaz Chughtaie' },
  { path: '/patrons/co-patron', expect: '[Name to be added]' },
  { path: '/this-does-not-exist', expect: "doesn't exist" }
];

const main = async () => {
  await fs.access(path.join(DIST, 'index.html'));

  await new Promise((resolve) => server.listen(PORT, resolve));
  const origin = `http://localhost:${PORT}`;

  const executablePath = await findBrowser();
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox']
  });

  let failures = 0;

  for (const testCase of CASES) {
    const page = await browser.newPage();
    const url = `${origin}${BASE}${testCase.path}`;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
    const text = await page.evaluate(() => document.body.innerText);
    const title = await page.title();
    const landed = new URL(page.url()).pathname;

    // Browsers report text-transform'd content in innerText, and the design
    // uppercases display type — compare case-insensitively.
    const okText = text
      .toLowerCase()
      .includes(testCase.expect.toLowerCase());
    const okTitle = testCase.title ? title.startsWith(testCase.title) : true;
    const okUrl = landed.startsWith(`${BASE}${testCase.path}`);

    const ok = okText && okTitle && okUrl;
    if (!ok) failures += 1;

    console.log(
      `${ok ? 'OK  ' : 'FAIL'} ${BASE}${testCase.path}  ->  ${landed}` +
        (ok ? '' : `\n     expect text "${testCase.expect}" | title "${title}"`)
    );

    await page.close();
  }

  await browser.close();
  await new Promise((resolve) => server.close(resolve));

  console.log(
    failures === 0
      ? '\nAll GitHub Pages deep links resolved to the correct page.'
      : `\n${failures} deep link(s) failed.`
  );
  process.exitCode = failures === 0 ? 0 : 1;
};

main().catch((error) => {
  console.error(error);
  server.close();
  process.exitCode = 1;
});
