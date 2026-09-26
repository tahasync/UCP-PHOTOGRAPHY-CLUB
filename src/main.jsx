import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './styles/fonts.css';
import './styles/globals.css';
import './styles/animations.css';

import App from './App.jsx';
import { initTheme } from './lib/theme.js';

/*
 * GitHub Pages answers unknown paths with 404.html, which forwards the deep
 * link here as ?__spa_path=... — restore it before the router boots so QR
 * URLs such as /vice-president behave exactly like a direct server route.
 */
const spaPath = new URLSearchParams(window.location.search).get('__spa_path');
if (spaPath) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const restored = spaPath.startsWith('/') ? spaPath : `/${spaPath}`;
  window.history.replaceState(null, '', `${base}${restored}`);
}

/* Apply the stored / system theme before the first paint. */
initTheme();

/* React Router basename keeps links working under a project-site subpath. */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
