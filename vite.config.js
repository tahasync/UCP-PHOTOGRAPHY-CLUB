import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Build-time finishing touches:
 *
 * 1. Preloads the single Inter subset so the first paint never shows fallback
 *    type (the display headline is the whole first impression).
 * 2. Emits `dist/404.html` as a safety net for unknown URLs.
 * 3. Pre-renders a real HTML file for every route, so a scanned QR link
 *    (e.g. /vice-president) answers HTTP 200 on any static host with no 404
 *    request in the browser console.
 */
function buildFinishingPlugin(base) {
  const writeStaticRoutes = async () => {
    const distDir = path.resolve(process.cwd(), 'dist');
    const indexPath = path.join(distDir, 'index.html');
    if (!fs.existsSync(indexPath)) return;

    const html = fs.readFileSync(indexPath, 'utf8');
    const { memberRoutes } = await import('./src/data/members.js');
    const { departmentRoutes } = await import('./src/data/hierarchy.js');

    const allRoutes = [
      'present-body',
      'patrons',
      'hierarchy',
      ...departmentRoutes,
      ...memberRoutes
    ];

    for (const route of allRoutes) {
      // Folder form: works with any static server and SPA fallback.
      const dir = path.join(distDir, route);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), html);

      // Flat file form: GitHub Pages answers /vice-president with 200
      // instead of a 301 redirect to /vice-president/.
      fs.writeFileSync(path.join(distDir, `${route}.html`), html);
    }
  };

  return {
    name: 'upc-build-finishing',
    apply: 'build',
    // Run after Vite's HTML plugin so index.html exists in the bundle.
    enforce: 'post',

    generateBundle(_options, bundle) {
      const fontFile = Object.keys(bundle).find((name) => name.endsWith('.woff2'));
      const indexAsset = bundle['index.html'];

      if (fontFile && indexAsset) {
        const href = `${base}${fontFile}`.replace(/\/{2,}/g, '/');
        const preload = `<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin />`;
        indexAsset.source = indexAsset.source
          .toString()
          .replace('</title>', `</title>\n    ${preload}`);
      }

      const templatePath = path.resolve(process.cwd(), 'scripts', '404.template.html');
      if (fs.existsSync(templatePath)) {
        this.emitFile({
          type: 'asset',
          fileName: '404.html',
          source: fs.readFileSync(templatePath, 'utf8').replaceAll('__BASE__', base)
        });
      }
    },

    async closeBundle() {
      try {
        await writeStaticRoutes();
      } catch (error) {
        console.error('Failed to pre-generate static route files:', error);
      }
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // GitHub Pages project site at /<repo>/; local dev and the default build use the root.
  const base = env.VITE_BASE || '/';

  return {
    base,
    plugins: [react(), buildFinishingPlugin(base)],
    server: { port: 5173, open: false },
    build: {
      target: 'es2019',
      cssCodeSplit: false,
      assetsInlineLimit: 2048,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion']
          }
        }
      }
    }
  };
});

