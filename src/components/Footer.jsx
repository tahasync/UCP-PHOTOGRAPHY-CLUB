import { Link } from 'react-router-dom';
import { CLUB } from '../data/site.js';
import { NAV_ITEMS } from '../data/navigation.js';

/** Deliberately small: wordmark, three links, one line of legal text. */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__grid">
          <div>
            <p className="site-footer__wordmark">
              {CLUB.name}
              <br />
              {CLUB.tenure}
            </p>
          </div>

          <nav className="site-footer__links" aria-label="Footer">
            {NAV_ITEMS.map((item) => (
              <Link key={item.to} to={item.to}>
                <span className="u-line">{item.menuLabel}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="site-footer__bottom">
          <span>© {CLUB.name} {CLUB.tenure}</span>
          <span>{CLUB.statement}</span>
        </div>
      </div>
    </footer>
  );
}
