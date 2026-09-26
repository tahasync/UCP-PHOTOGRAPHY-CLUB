import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Reveal from '../components/Reveal.jsx';
import Arrow from '../components/Arrow.jsx';
import HierarchySection from '../components/HierarchySection.jsx';
import { CLUB } from '../data/site.js';
import { departments, teamCount } from '../data/hierarchy.js';

/** The 2026–27 hierarchy: five teams, each linking to its positions. */
export default function Hierarchy() {
  return (
    <div className="shell">
      <Seo
        title="Hierarchy — 2026–27"
        description={`The ${teamCount} teams of the UCP Photography Club hierarchy for 2026–27: ${departments
          .map((department) => department.name)
          .join(', ')}.`}
      />

      <header className="page-head">
        <div className="page-head__meta">
          <span className="eyebrow eyebrow--red">Hierarchy</span>
          <span className="eyebrow eyebrow--muted tnum">{CLUB.tenure}</span>
        </div>

        <div className="page-head__title-row">
          <Reveal as="h1" className="h-page">
            Hierarchy
          </Reveal>
          <Reveal as="p" className="lede" delay={0.06}>
            The 2026–27 hierarchy is organised into {teamCount} teams, each led by a
            director and reporting alongside the President Body.
          </Reveal>
        </div>
      </header>

      <section className="structure" aria-labelledby="hierarchy-structure">
        <h2 className="label" id="hierarchy-structure">
          Structure
        </h2>

        <ul className="structure__chain">
          <li className="structure__node structure__node--accent">President Body</li>
          <li className="structure__sep" aria-hidden="true">
            <Arrow />
          </li>
          <li className="structure__node">{teamCount} Teams</li>
          <li className="structure__sep" aria-hidden="true">
            <Arrow />
          </li>
          <li className="structure__node">Positions</li>
        </ul>

        <div className="structure__teams">
          {departments.map((department) => (
            <Link
              key={department.slug}
              className="structure__team"
              to={department.route}
            >
              <span className="tnum">{department.index}</span> / {department.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--tight" aria-label="Teams">
        <HierarchySection />
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
