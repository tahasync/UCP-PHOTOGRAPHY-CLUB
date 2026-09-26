import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Arrow from '../components/Arrow.jsx';

/** Minimal, on-brand 404 — also used for unknown team/profile slugs. */
export default function NotFound({
  message = "This page doesn't exist.",
  hint = 'The address may be incomplete, or the page may have moved.',
  backTo = '/',
  backLabel = 'Return to UPC'
}) {
  return (
    <>
      <Seo title="Page not found" description={message} noindex />

      <div className="shell notfound">
        <p className="eyebrow eyebrow--red tnum">Error 404</p>
        <p className="notfound__code tnum" aria-hidden="true">
          404
        </p>
        <h1 className="h-section">{message}</h1>
        <p className="lede">{hint}</p>

        <Link className="cta-row" to={backTo}>
          <span className="cta-row__label">{backLabel}</span>
          <span className="cta-row__arrow" aria-hidden="true">
            <Arrow />
          </span>
        </Link>
      </div>
    </>
  );
}
