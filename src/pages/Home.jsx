import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Seo from '../components/Seo.jsx';
import Logo from '../components/Logo.jsx';
import Arrow from '../components/Arrow.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { CLUB } from '../data/site.js';
import { EASE } from '../lib/motion.js';
import { presentBodyMembers, hierarchyMembers, patronMembers } from '../data/members.js';
import { teamCount, departments } from '../data/hierarchy.js';

const pad = (value) => String(value).padStart(2, '0');

/** Editorial cover + directory index + one black manifesto band. */
export default function Home() {
  const reduceMotion = useReducedMotion();

  const appointedPositions = presentBodyMembers.length + hierarchyMembers.length;

  const titleVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: '0.35em' },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
  };

  return (
    <>
      <Seo
        title="UCP Photography Club, 2026–27"
        description="UCP Photography Club Executive Body and Leadership, 2026–27"
      />

      <section className="cover">
        <div className="cover__top">
          <div className="shell cover__top-inner">
            <span className="eyebrow">{CLUB.name}</span>
            <span className="eyebrow eyebrow--muted tnum">{CLUB.tenure}</span>
          </div>
        </div>

        <div className="shell cover__main">
          <motion.h1
            className="display display--cover cover__title"
            initial={reduceMotion ? undefined : 'hidden'}
            animate={reduceMotion ? undefined : 'visible'}
            variants={reduceMotion ? undefined : titleVariants}
          >
            {CLUB.coverLines.map((line) => (
              <motion.span key={line} variants={reduceMotion ? undefined : lineVariants}>
                {line}
              </motion.span>
            ))}
          </motion.h1>

          <div className="cover__aside">
            <Reveal delay={0.2}>
              <Logo className="cover__logo" />
            </Reveal>

            <Reveal as="p" className="cover__statement" delay={0.28}>
              {CLUB.statement}
            </Reveal>

            <Reveal as="p" className="small" delay={0.34}>
              The current digital directory of the UCP Photography Club Executive Body,
              2026–27.
            </Reveal>
          </div>
        </div>

        <div className="shell cover__bottom">
          <span className="eyebrow eyebrow--muted cover__scroll">
            Scroll
            <span className="cover__scroll-track" aria-hidden="true" />
          </span>
          <span className="eyebrow eyebrow--muted">Executive Body · 2026–27</span>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            label="Explore"
            title="The 2026–27 body"
            meta={`${appointedPositions} appointed positions`}
          />

          <div className="bento">
            <Link className="tile" to="/present-body">
              <span className="tile__num">01</span>
              <span>
                <span className="tile__title">Present Body</span>
                <span className="tile__sub">President &amp; Vice President</span>
              </span>
              <span className="tile__meta">
                {pad(presentBodyMembers.length)} positions
                <Arrow />
              </span>
            </Link>

            <Link className="tile tile--accent" to="/patrons">
              <span className="tile__num">02</span>
              <span>
                <span className="tile__title">Patrons Body</span>
                <span className="tile__sub">Patron &amp; Co-Patron</span>
              </span>
              <span className="tile__meta">
                {pad(patronMembers.length)} positions
                <Arrow />
              </span>
            </Link>

            <Link className="tile" to="/hierarchy">
              <span className="tile__num">03</span>
              <span>
                <span className="tile__title">Hierarchy</span>
                <span className="tile__sub">
                  {departments.map((department) => department.name).join(' · ')}
                </span>
              </span>
              <span className="tile__meta">
                {pad(teamCount)} teams
                <Arrow />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="manifesto">
        <div className="shell">
          <Reveal as="p" className="manifesto__text">
            The current executive body and hierarchy of <em>UPC</em>.
          </Reveal>

          <Reveal as="p" className="manifesto__note" delay={0.08}>
            Every position listed on this site links to that person’s digital identity
            page, the destination behind their printed UPC card. Nothing from earlier
            tenures appears here.
          </Reveal>

          <div className="stat-grid">
            <Reveal>
              <span className="stat__value tnum">{pad(presentBodyMembers.length)}</span>
              <span className="stat__label">Present Body</span>
            </Reveal>
            <Reveal delay={0.06}>
              <span className="stat__value tnum">{pad(teamCount)}</span>
              <span className="stat__label">Hierarchy Teams</span>
            </Reveal>
            <Reveal delay={0.12}>
              <span className="stat__value tnum">{pad(appointedPositions)}</span>
              <span className="stat__label">Appointed Positions</span>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <Link className="cta-row" to="/hierarchy">
            <span className="cta-row__label">Start with the hierarchy</span>
            <span className="cta-row__arrow" aria-hidden="true">
              <Arrow />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
