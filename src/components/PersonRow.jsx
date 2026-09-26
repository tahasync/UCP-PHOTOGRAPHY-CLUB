import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Arrow from './Arrow.jsx';
import Portrait from './Portrait.jsx';

/** True only on devices that can actually hover (desktop, stylus/trackpad). */
const canHover = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: hover)').matches;

/**
 * A person inside a directory list.
 *
 * `showPreview` adds the hover/focus portrait (Present Body leadership rows).
 * Directory lists such as department pages stay compact and link-only, so no
 * invisible image ever reserves vertical space. On touch devices the preview is
 * not rendered at all, so phones never download an image they cannot show.
 */
export default function PersonRow({ member, num, meta, showPreview = false }) {
  const pending = member.nameIsPending ? ' (name to be added)' : '';
  const withPreview = useMemo(() => showPreview && canHover(), [showPreview]);

  return (
    <Link
      className={`index-row person-row${withPreview ? ' person-row--preview' : ''}`}
      to={member.path}
      aria-label={`${member.name}${pending}, ${member.position}. Open profile`}
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

      {withPreview ? (
        <span className="person-row__preview" aria-hidden="true">
          <Portrait member={member} ratio="4x5" sizes="168px" />
        </span>
      ) : null}
    </Link>
  );
}

