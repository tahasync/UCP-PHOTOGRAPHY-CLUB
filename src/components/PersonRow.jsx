import { Link } from 'react-router-dom';
import Arrow from './Arrow.jsx';
import Portrait from './Portrait.jsx';

/**
 * A person inside a directory list. The portrait stays hidden until hover or
 * keyboard focus on desktop; on touch devices the row is simply a link.
 */
export default function PersonRow({ member, num, meta }) {
  const pending = member.nameIsPending ? ' (name to be added)' : '';

  return (
    <Link
      className="index-row person-row"
      to={member.path}
      aria-label={`${member.name}${pending}, ${member.position} — open profile`}
    >
      {num ? (
        <span className="index-row__num tnum" aria-hidden="true">
          {num}
        </span>
      ) : null}

      <span className="index-row__body">
        <span className="index-row__title">{member.name}</span>
        <span className="index-row__sub">{member.position}</span>
      </span>

      <span className="index-row__meta">
        {meta ? <span>{meta}</span> : null}
        <span className="index-row__arrow" aria-hidden="true">
          <Arrow />
        </span>
      </span>

      <span className="person-row__preview" aria-hidden="true">
        <Portrait member={member} ratio="4x5" sizes="180px" />
      </span>
    </Link>
  );
}
