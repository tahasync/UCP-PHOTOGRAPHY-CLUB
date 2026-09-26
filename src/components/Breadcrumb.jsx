import { Link } from 'react-router-dom';

/**
 * Deliberately tiny breadcrumb so a visitor always knows where they came from
 * after scanning a QR code: HIERARCHY / OPERATIONS / DIRECTOR.
 */
export default function Breadcrumb({ items }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span className="crumb__item" key={`${item.label}-${index}`}>
            {index > 0 ? (
              <span className="crumb__sep" aria-hidden="true">
                /
              </span>
            ) : null}
            {item.to && !isLast ? (
              <Link className="crumb__link" to={item.to}>
                {item.label}
              </Link>
            ) : (
              <span className="crumb__current" aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
