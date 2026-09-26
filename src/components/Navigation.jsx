import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MobileMenu from './MobileMenu.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { NAV_ITEMS, isNavItemActive } from '../data/navigation.js';

/**
 * Minimal sticky header: wordmark, three links on desktop, MENU on mobile.
 * Gains a hairline rule only once the page is scrolled.
 */
export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Never leave the overlay open across navigations.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const headerClass = [
    'site-header',
    scrolled && !menuOpen ? 'is-scrolled' : '',
    menuOpen ? 'is-open' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className={headerClass}>
        <div className="shell site-header__inner">
          <Link className="wordmark" to="/" aria-label="UCP Photography Club home">
            <span className="wordmark__text">UPC</span>
            <span className="wordmark__rule" aria-hidden="true" />
          </Link>

          <nav className="nav" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(item, pathname);
              return (
                <Link
                  key={item.to}
                  className="nav__link"
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="site-header__actions">
            <ThemeToggle />

            <button
              type="button"
              className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span>{menuOpen ? 'Close' : 'Menu'}</span>
              <span className="menu-toggle__bars" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
