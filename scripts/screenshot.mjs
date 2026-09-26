/**
 * Visual smoke test (development only).
 *
 *   npm run build && npm run preview      (terminal 1)
 *   node scripts/screenshot.mjs           (terminal 2)
 *
 * Screenshots key routes at mobile + desktop widths into .screens/ and reports
 * any console/runtime errors, so layout regressions are caught before deploy.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const BASE = process.env.PREVIEW_URL || 'http://localhost:4173';
const OUT_DIR = path.join(process.cwd(), '.screens');

const BROWSERS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
];

const SHOTS = [
  { name: 'home-desktop', route: '/', width: 1440, height: 1000 },
  { name: 'home-desktop-dark', route: '/', width: 1440, height: 1000, theme: 'dark' },
  { name: 'home-mobile', route: '/', width: 390, height: 844 },
  { name: 'home-mobile-dark', route: '/', width: 390, height: 844, theme: 'dark' },
  { name: 'present-body-desktop', route: '/present-body', width: 1440, height: 1000 },
  {
    name: 'present-body-desktop-dark',
    route: '/present-body',
    width: 1440,
    height: 1000,
    theme: 'dark'
  },
  { name: 'hierarchy-desktop', route: '/hierarchy', width: 1440, height: 1200 },
  {
    name: 'hierarchy-desktop-dark',
    route: '/hierarchy',
    width: 1440,
    height: 1200,
    theme: 'dark'
  },
  { name: 'department-desktop', route: '/comms', width: 1440, height: 1000 },
  {
    name: 'department-desktop-dark',
    route: '/creatives',
    width: 1440,
    height: 1000,
    theme: 'dark'
  },
  { name: 'person-desktop', route: '/vice-president', width: 1440, height: 1000 },
  {
    name: 'person-desktop-dark',
    route: '/editing/director',
    width: 1440,
    height: 1000,
    theme: 'dark'
  },
  { name: 'person-mobile', route: '/vice-president', width: 375, height: 812 },
  {
    name: 'person-mobile-dark',
    route: '/vice-president',
    width: 375,
    height: 812,
    theme: 'dark'
  },
  { name: 'menu-open-mobile', route: '/', width: 390, height: 844, click: '.menu-toggle' },
  {
    name: 'menu-open-mobile-dark',
    route: '/',
    width: 390,
    height: 844,
    click: '.menu-toggle',
    theme: 'dark'
  },
  { name: 'notfound-desktop-dark', route: '/x', width: 1440, height: 900, theme: 'dark' }
];

const findBrowser = async () => {
  for (const candidate of BROWSERS) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      /* keep looking */
    }
  }
  throw new Error('No Chrome or Edge installation found for screenshots.');
};

/** Scrolls the whole page so `whileInView` reveals have fired before capture. */
const primeReveals = async (page) => {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.round(window.innerHeight * 0.7));
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 110));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((resolve) => setTimeout(resolve, 700));
};

const main = async () => {
  const executablePath = await findBrowser();
  await fs.mkdir(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--hide-scrollbars', '--force-device-scale-factor=1']
  });

  let problems = 0;

  for (const shot of SHOTS) {
    const page = await browser.newPage();
    const messages = [];

    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') {
        messages.push(`${message.type()}: ${message.text()}`);
      }
    });
    page.on('pageerror', (error) => messages.push(`pageerror: ${error.message}`));
    page.on('requestfailed', (request) =>
      messages.push(`requestfailed: ${request.url()}`)
    );

    const mobile = shot.width < 700;
    await page.setViewport({
      width: shot.width,
      height: shot.height,
      deviceScaleFactor: 1,
      isMobile: mobile,
      hasTouch: mobile
    });

    // Force the requested theme before the page's pre-paint script runs.
    await page.evaluateOnNewDocument((theme) => {
      try {
        window.localStorage.setItem('upc-theme', theme);
      } catch (error) {
        /* ignore */
      }
    }, shot.theme || 'light');

    await page.goto(`${BASE}${shot.route}`, {
      waitUntil: 'networkidle0',
      timeout: 45000
    });

    if (shot.click) {
      await page.click(shot.click);
      await new Promise((resolve) => setTimeout(resolve, 700));
    }

    await primeReveals(page);

    await page.screenshot({
      path: path.join(OUT_DIR, `${shot.name}.jpg`),
      fullPage: true,
      type: 'jpeg',
      quality: 76
    });

    const title = await page.title();
    console.log(`${shot.name.padEnd(24)} ${shot.width}x${shot.height}  "${title}"`);

    if (messages.length > 0) {
      problems += messages.length;
      console.log(`   ! ${messages.slice(0, 4).join('\n   ! ')}`);
    }

    await page.close();
  }

  await browser.close();

  if (problems > 0) {
    console.log(`\n${problems} console/network message(s) captured.`);
  } else {
    console.log('\nNo console errors or failed requests.');
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
