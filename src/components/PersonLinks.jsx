import Arrow from './Arrow.jsx';

const ORDER = ['instagram', 'linkedin', 'portfolio', 'email'];

const LABELS = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  portfolio: 'Portfolio',
  email: 'Email'
};

/**
 * Renders only the links that actually exist in the member record.
 * Nothing is invented, and empty entries never leave an empty row behind.
 */
export default function PersonLinks({ member }) {
  const links = member.links || {};
  const available = ORDER.filter(
    (key) => typeof links[key] === 'string' && links[key].trim() !== ''
  );

  if (available.length === 0) {
    return (
      <div className="links">
        <p className="links__note">
          Approved Instagram, LinkedIn and email links for {member.name} will appear
          here once they are supplied for the 2026–27 tenure.
        </p>
      </div>
    );
  }

  return (
    <ul className="links">
      {available.map((key) => {
        const value = links[key].trim();
        const isEmail = key === 'email';
        const href = isEmail
          ? value.startsWith('mailto:')
            ? value
            : `mailto:${value}`
          : value;

        return (
          <li key={key}>
            <a
              className="links__row"
              href={href}
              {...(isEmail ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            >
              <span className="u-line">{LABELS[key]}</span>
              <span className="links__arrow" aria-hidden="true">
                <Arrow direction="up-right" />
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
