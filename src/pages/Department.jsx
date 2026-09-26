import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Reveal from '../components/Reveal.jsx';
import Arrow from '../components/Arrow.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import DepartmentSection from '../components/DepartmentSection.jsx';
import NotFound from './NotFound.jsx';
import { CLUB } from '../data/site.js';
import { getDepartment, getDepartmentNeighbours } from '../data/hierarchy.js';

/** One hierarchy team, with its positions linking to identity pages. */
export default function Department({ slug }) {
  const department = getDepartment(slug);

  if (!department) {
    return (
      <NotFound
        message="Team not found"
        hint="The requested UPC team could not be found in the current 2026–27 hierarchy."
        backTo="/hierarchy"
        backLabel="Return to hierarchy"
      />
    );
  }

  const { previous, next } = getDepartmentNeighbours(department.slug);

  return (
    <div className="shell">
      <Seo
        title={`${department.name} Team, 2026–27`}
        description={`The ${department.name} team of the UCP Photography Club, 2026–27.`}
      />

      <Breadcrumb
        items={[
          { label: 'Hierarchy', to: '/hierarchy' },
          { label: department.name }
        ]}
      />

      <header className="page-head">
        <div className="page-head__meta">
          <span className="eyebrow eyebrow--red tnum">{department.index}</span>
          <span className="eyebrow eyebrow--muted tnum">{CLUB.tenure}</span>
        </div>

        <div className="page-head__title-row">
          <Reveal as="h1" className="h-page">
            {department.name}
          </Reveal>

          <Reveal className="dept-intro" delay={0.06}>
            <p className="lede">{department.intro}</p>
            {department.introIsPlaceholder ? (
              <p className="person__bio-note label">
                Placeholder introduction. Awaiting approved copy.
              </p>
            ) : null}
          </Reveal>
        </div>
      </header>

      <section className="section section--tight">
        <DepartmentSection department={department} />
      </section>

      <nav className="dept-nav" aria-label="Other teams">
        {previous ? (
          <Link className="dept-nav__row" to={previous.route}>
            <Arrow direction="left" />
            <span>
              <span className="tnum">{previous.index}</span> / {previous.name}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}

        {next ? (
          <Link className="dept-nav__row" to={next.route}>
            <span>{next.name}</span>
            <span className="tnum">{next.index}</span>
            <Arrow />
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </nav>

      <section className="section section--tight">
        <Link className="cta-row" to="/hierarchy">
          <span className="cta-row__label">All teams</span>
          <span className="cta-row__arrow" aria-hidden="true">
            <Arrow />
          </span>
        </Link>
      </section>
    </div>
  );
}
