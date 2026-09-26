import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import PersonRow from '../components/PersonRow.jsx';
import Arrow from '../components/Arrow.jsx';
import Reveal from '../components/Reveal.jsx';
import { CLUB } from '../data/site.js';
import { patronsBody } from '../data/patrons.js';

/**
 * Patrons Body — kept separate from the student executive body.
 * Official names have not been supplied, so the records remain placeholders.
 */
export default function Patrons() {
  return (
    <div className="shell">
      <Seo
        title="Patrons Body — 2026–27"
        description="The Patrons Body of the UCP Photography Club for the 2026–27 tenure."
      />

      <header className="page-head">
        <div className="page-head__meta">
          <span className="eyebrow eyebrow--red">Patrons Body</span>
          <span className="eyebrow eyebrow--muted tnum">{CLUB.tenure}</span>
        </div>

        <div className="page-head__title-row">
          <Reveal as="h1" className="h-page">
            Patrons
          </Reveal>
          <Reveal as="p" className="lede" delay={0.06}>
            {patronsBody.note}
          </Reveal>
        </div>
      </header>

      <section className="section section--tight" aria-label="Patrons Body positions">
        <ul className="index-list">
          {patronsBody.members.map((member, index) => (
            <li key={member.slug}>
              <PersonRow
                member={member}
                num={`0${index + 1}`}
                meta={member.nameIsPending ? 'Awaiting name' : member.body.toUpperCase()}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="section section--tight">
        <Link className="cta-row" to="/present-body">
          <span className="cta-row__label">Present Body</span>
          <span className="cta-row__arrow" aria-hidden="true">
            <Arrow />
          </span>
        </Link>
      </section>
    </div>
  );
}
