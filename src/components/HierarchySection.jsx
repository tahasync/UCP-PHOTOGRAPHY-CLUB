import { Link } from 'react-router-dom';
import Arrow from './Arrow.jsx';
import { hierarchy } from '../data/hierarchy.js';

/**
 * The hierarchy directory: 01 / OPERATIONS … 05 / GRAPHICS AND ART AND CRAFT.
 * Large typographic rows rather than cards.
 */
export default function HierarchySection({ showMembers = true }) {
  return (
    <ul className="index-list">
      {hierarchy.map((department) => (
        <li key={department.slug}>
          <Link
            className="index-row"
            to={department.route}
            aria-label={`${department.name} team, ${department.members.length} positions`}
          >
            <span className="index-row__num tnum" aria-hidden="true">
              {department.index}
            </span>

            <span className="index-row__body">
              <span className="index-row__title">{department.name}</span>
              {showMembers ? (
                <span className="index-row__sub">
                  {department.members.map((member) => member.name).join(' · ')}
                </span>
              ) : null}
            </span>

            <span className="index-row__meta">
              <span>{`${department.members.length} positions`}</span>
              <span className="index-row__arrow" aria-hidden="true">
                <Arrow />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
