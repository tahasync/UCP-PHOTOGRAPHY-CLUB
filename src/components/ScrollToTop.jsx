import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Route changes start at the top of the page.
 * The temporary `scroll-behavior: auto` keeps the jump instant even for
 * visitors with `prefers-reduced-motion: no-preference` smooth scrolling.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
  }, [pathname]);

  return null;
}
