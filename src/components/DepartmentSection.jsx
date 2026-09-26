import PersonRow from './PersonRow.jsx';

/**
 * The positions inside one team, each linking to that person's identity page.
 */
export default function DepartmentSection({ department }) {
  return (
    <section aria-labelledby={`team-${department.slug}`}>
      <h2 className="visually-hidden" id={`team-${department.slug}`}>
        {department.name} positions
      </h2>

      <ul className="index-list">
        {department.members.map((member, index) => (
          <li key={member.slug}>
            <PersonRow member={member} num={`0${index + 1}`} showPreview />
          </li>
        ))}
      </ul>
    </section>
  );
}
