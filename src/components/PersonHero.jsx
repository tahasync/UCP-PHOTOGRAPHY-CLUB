import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import Portrait from './Portrait.jsx';
import PersonLinks from './PersonLinks.jsx';
import Arrow from './Arrow.jsx';
import { CLUB } from '../data/site.js';
import { relatedMembers } from '../data/members.js';

const splitName = (name) => name.split(' ').filter(Boolean);

/**
 * The digital identity block behind every QR code.
 * Desktop: sticky portrait beside identity + bio + links.
 * Mobile: position, name, portrait, details, links — in that order.
 */
export default function PersonHero({ member, relatedLabel, browseTo, browseLabel }) {
  const positionLines = member.positionLines?.length
    ? member.positionLines
    : [member.position];
  const nameLines = splitName(member.name);
  const related = relatedMembers(member);

  return (
    <article className="person">
      <div className="person__identity">
        <Reveal as="p" className="eyebrow eyebrow--muted">
          {CLUB.name} · {CLUB.tenure}
        </Reveal>

        <Reveal as="p" className="person__position" delay={0.04}>
          {positionLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </Reveal>

        <Reveal as="h1" className="person__name" delay={0.1}>
          {nameLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </Reveal>
      </div>

      <div className="person__visual">
        <Portrait
          member={member}
          ratio="4x5"
          priority
          sizes="(min-width: 1024px) 52vw, 100vw"
        />
        <p className="portrait__caption">
          <span>
            {member.imagePlaceholder
              ? 'Placeholder portrait'
              : `${member.name} · ${CLUB.tenure}`}
          </span>
          <span>{member.position}</span>
        </p>
      </div>

      <div className="person__info">
        <div className="person__meta">
          <span className="eyebrow">{CLUB.name}</span>
          <span className="label">{member.body}</span>
          <span className="label tnum">{CLUB.tenure}</span>
        </div>

        <p className="person__bio">
          {member.bio}
          {member.bioIsPlaceholder ? (
            <span className="person__bio-note label">
              Placeholder introduction. Awaiting approved copy.
            </span>
          ) : null}
        </p>

        {member.role ? (
          <div className="person__role">
            <h2 className="label">Role</h2>
            <p className="small">{member.role}</p>
          </div>
        ) : null}

        <PersonLinks member={member} />

        {related.length > 0 ? (
          <section className="also" aria-label={`Other positions in ${relatedLabel}`}>
            <h2 className="label">Also in {relatedLabel}</h2>
            <ul className="also__list">
              {related.map((other) => (
                <li key={other.slug}>
                  <Link className="also__link" to={other.path}>
                    <span className="also__position">{other.position}</span>
                    <span className="u-line">{other.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <Link className="cta-row" to={browseTo}>
          <span className="cta-row__label">{browseLabel}</span>
          <span className="cta-row__arrow" aria-hidden="true">
            <Arrow />
          </span>
        </Link>
      </div>
    </article>
  );
}

