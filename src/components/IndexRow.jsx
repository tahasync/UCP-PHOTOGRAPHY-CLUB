import { Link } from 'react-router-dom';
import Arrow from './Arrow.jsx';

/**
 * One line of a directory list: number, title, optional sub-line, meta, arrow.
 * Renders as a link when `to` is provided, otherwise as a plain row.
 */
export default function IndexRow({ to, num, title, sub, meta, ariaLabel, preview }) {
  const content = (
    <>
      {num ? (
        <span className="index-row__num tnum" aria-hidden="true">
          {num}
        </span>
      ) : null}

      <span className="index-row__body">
        <span className="index-row__title">{title}</span>
        {sub ? <span className="index-row__sub">{sub}</span> : null}
      </span>

      <span className="index-row__meta">
        {meta ? <span>{meta}</span> : null}
        <span className="index-row__arrow" aria-hidden="true">
          <Arrow />
        </span>
      </span>

      {preview || null}
    </>
  );

  if (!to) {
    return <div className="index-row">{content}</div>;
  }

  return (
    <Link className="index-row" to={to} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}
