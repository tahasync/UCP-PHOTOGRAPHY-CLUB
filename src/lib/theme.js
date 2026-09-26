/**
 * Theme (light / dark) helpers.
 *
 * The chosen theme is stored in localStorage; with no stored preference the
 * system setting wins. `initTheme()` runs before React mounts (see main.jsx)
 * and `initThemeInline` runs inside index.html to avoid a flash of the
 * wrong theme.
 */

export const THEME_KEY = 'upc-theme';

export const THEME_META = {
  light: '#ffffff',
  dark: '#0b0b0c'
};

const systemTheme = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const readStoredTheme = () => {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage unavailable — fall back to the system setting */
  }
  return systemTheme();
};

export const applyTheme = (theme) => {
  const resolved = theme === 'dark' ? 'dark' : 'light';
  const root = document.documentElement;

  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;

  try {
    window.localStorage.setItem(THEME_KEY, resolved);
  } catch {
    /* ignore */
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_META[resolved]);
};

/** Call once at startup, then keep following the OS while the user has no choice. */
export const initTheme = () => {
  applyTheme(readStoredTheme());
};
