import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import PersonRow from '../components/PersonRow.jsx';
import Arrow from '../components/Arrow.jsx';
import Reveal from '../components/Reveal.jsx';
import { CLUB } from '../data/site.js';
import { presentBodyMembers } from '../data/members.js';

/** President and Vice President — large typography, no cards. */
export default function PresentBody() {
  return (
    <div className="shell">
      <Seo
        title="Present Body — 2026–27"
        description="The President and Vice President of the UCP Photography Club, Executive Body 2026–27."
      />

      <header className="page-head">
        <div className="page-head__meta">
          <span className="eyebrow eyebrow--red">President Body</span>
          <span className="eyebrow eyebrow--muted tnum">{CLUB.tenure}</span>
        </div>

        <div className="page-head__title-row">
          <Reveal as="h1" className="h-page">
            Present Body
          </Reveal>
          <Reveal as="p" className="lede" delay={0.06}>
            The executive leadership of the UCP Photography Club for the 2026–27 tenure,
            working alongside the club’s five hierarchy teams.
          </Reveal>
        </div>
      </header>

      <section className="section section--tight" aria-label="Present Body positions">
        <ul className="index-list">
          {presentBodyMembers.map((member, index) => (
            <li key={member.slug}>
              <PersonRow
                member={member}
                num={`0${index + 1}`}
                meta={member.body.toUpperCase()}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="section section--tight">
        <Link className="cta-row" to="/hierarchy">
          <span className="cta-row__label">Explore UPC hierarchy</span>
          <span className="cta-row__arrow" aria-hidden="true">
            <Arrow />
          </span>
        </Link>
      </section>
    </div>
  );
}
