import { Link } from 'react-router-dom';
import Arrow from './Arrow.jsx';
import { CLUB, CLUB_LINKS } from '../data/site.js';
import { NAV_ITEMS } from '../data/navigation.js';

/** Deliberately small: wordmark, navigation, official accounts, legal line. */
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

        {CLUB_LINKS.instagram ? (
          <nav className="site-footer__social" aria-label="Official club accounts">
            <span className="site-footer__social-label">Follow the club</span>
            <a
              className="site-footer__social-link"
              href={CLUB_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="u-line">@upcofficials</span>
              <Arrow direction="up-right" />
            </a>
          </nav>
        ) : null}

        <div className="site-footer__bottom">
          <span>© {CLUB.name} {CLUB.tenure}</span>
          <span>{CLUB.statement}</span>
        </div>
      </div>
    </footer>
  );
}
