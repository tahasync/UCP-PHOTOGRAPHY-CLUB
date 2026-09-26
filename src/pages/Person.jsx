import Seo from '../components/Seo.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import PersonHero from '../components/PersonHero.jsx';
import NotFound from './NotFound.jsx';
import { CLUB } from '../data/site.js';
import { getMember } from '../data/members.js';
import { getDepartment } from '../data/hierarchy.js';

/** Breadcrumb context so a QR visitor always knows where they landed. */
const buildCrumb = (member) => {
  if (member.group === 'present-body') {
    return [{ label: 'Present Body', to: '/present-body' }, { label: member.position }];
  }

  if (member.group === 'patrons') {
    return [{ label: 'Patrons', to: '/patrons' }, { label: member.position }];
  }

  const department = getDepartment(member.departmentSlug);
  return [
    { label: 'Hierarchy', to: '/hierarchy' },
    department
      ? { label: department.name, to: department.route }
      : { label: member.body },
    { label: member.position }
  ];
};

const bodyLabel = (member) => {
  if (member.group === 'present-body') return 'the President Body';
  if (member.group === 'patrons') return 'the Patrons Body';
  const department = getDepartment(member.departmentSlug);
  return department ? department.name : member.body;
};

/**
 * Digital identity page — the destination behind a printed UPC card.
 */
export default function Person({ slug }) {
  const member = getMember(slug);

  if (!member) {
    return (
      <NotFound
        message="Profile not found"
        hint="The requested UPC profile could not be found in the current 2026–27 hierarchy."
        backTo="/hierarchy"
        backLabel="Return to hierarchy"
      />
    );
  }

  return (
    <div className="shell">
      <Seo
        title={`${member.name}, ${member.position}`}
        description={`${member.name}, ${member.position}. ${CLUB.name}, ${CLUB.tenure}.`}
        image={member.imagePlaceholder ? undefined : member.image}
      />

      <Breadcrumb items={buildCrumb(member)} />

      <PersonHero
        member={member}
        relatedLabel={bodyLabel(member)}
        browseTo="/hierarchy"
        browseLabel="Explore UPC hierarchy"
      />
    </div>
  );
}
