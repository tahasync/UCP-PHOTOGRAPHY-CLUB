import { useEffect, useState } from 'react';
import { applyTheme, readStoredTheme } from '../lib/theme.js';

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <circle cx="12" cy="12" r="4.4" />
    <path
      strokeLinecap="round"
      d="M12 2.6v2.4M12 19v2.4M2.6 12H5M19 12h2.4M5.4 5.4l1.7 1.7M16.9 16.9l1.7 1.7M18.6 5.4l-1.7 1.7M7.1 16.9l-1.7 1.7"
    />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 13.6A8.4 8.4 0 0 1 10.4 4a8.4 8.4 0 1 0 9.6 9.6Z"
    />
  </svg>
);

/**
 * Light / dark switch. Shows a sun in dark mode (what you get when you click)
 * and a moon in light mode. 44×44px target for touch.
 */
export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(() =>
    typeof window === 'undefined' ? 'light' : readStoredTheme()
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <span className="theme-toggle__sun">
        <SunIcon />
      </span>
      <span className="theme-toggle__moon">
        <MoonIcon />
      </span>
    </button>
  );
}
