import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Emits `dist/404.html` with the deployment base baked in.
 *
 * GitHub Pages serves 404.html for any unknown path, so this file hands the
 * requested deep link (QR URLs such as /vice-president) back to index.html.
 * Netlify never reaches it thanks to public/_redirects + netlify.toml.
 */
function spaDeepLinkFallback(base) {
  return {
    name: 'upc-spa-deep-link-fallback',
    apply: 'build',
    generateBundle() {
      const templatePath = path.resolve(process.cwd(), 'scripts', '404.template.html');
      const template = fs.readFileSync(templatePath, 'utf8');
      this.emitFile({
        type: 'asset',
        fileName: '404.html',
        source: template.replaceAll('__BASE__', base)
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // Local + Netlify deploy at the root, GitHub Pages project sites at /<repo>/.
  const base = env.VITE_BASE || '/';

  return {
    base,
    plugins: [react(), spaDeepLinkFallback(base)],
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
