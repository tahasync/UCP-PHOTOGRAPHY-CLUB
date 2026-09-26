import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Emits `dist/404.html` and pre-generates `dist/<route>/index.html` for all
 * defined application routes.
 *
 * This completely eliminates the browser console 404 error when navigating
 * or hard-refreshing directly on GitHub Pages (e.g. /vice-president), while
 * keeping the fallback 404.html for truly unknown routes.
 */
function staticRoutesPlugin(base) {
  return {
    name: 'upc-static-routes-plugin',
    apply: 'build',
    async closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const indexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return;

      const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

      // 1. Emit 404.html
      const templatePath = path.resolve(process.cwd(), 'scripts', '404.template.html');
      if (fs.existsSync(templatePath)) {
        const template = fs.readFileSync(templatePath, 'utf8');
        fs.writeFileSync(path.join(distDir, '404.html'), template.replaceAll('__BASE__', base));
      }

      // 2. Pre-generate physical directories with index.html for all valid routes
      try {
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
          const targetDir = path.join(distDir, route);
          fs.mkdirSync(targetDir, { recursive: true });
          fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent);
        }
      } catch (err) {
        console.error('Failed to pre-generate static route files:', err);
      }
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // Local + Netlify deploy at the root, GitHub Pages project sites at /<repo>/.
  const base = env.VITE_BASE || '/';

  return {
    base,
    plugins: [react(), staticRoutesPlugin(base)],
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

