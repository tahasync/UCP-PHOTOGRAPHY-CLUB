/**
 * UCP Photography Club — 2026–27
 * The five hierarchy teams, in the order used by the club's own document.
 *
 * `intro` copy is a clearly-marked placeholder: replace it and set
 * `introIsPlaceholder: false` once the club approves the final wording.
 */

import { membersByDepartment } from './members.js';

export const departments = [
  {
    slug: 'operations',
    index: '01',
    name: 'Operations',
    route: '/operations',
    // TODO: Replace with the approved Operations team introduction.
    intro:
      'The Operations team keeps the club running, coordinating logistics, resources and event execution across the 2026–27 tenure.',
    introIsPlaceholder: true
  },
  {
    slug: 'editing',
    index: '02',
    name: 'Editing',
    route: '/editing',
    // TODO: Replace with the approved Editing team introduction.
    intro:
      'The Editing team supports the club’s visual post-production, maintaining the creative quality and consistency of photography and event media throughout the tenure.',
    introIsPlaceholder: true
  },
  {
    slug: 'comms',
    index: '03',
    name: 'Communication And Publication',
    route: '/comms',
    // TODO: Replace with the approved Communication And Publication introduction.
    intro:
      'The Communication And Publication team handles the club’s written voice. It covers publications, announcements and the communication that connects UPC with its members.',
    introIsPlaceholder: true
  },
  {
    slug: 'social-media',
    index: '04',
    name: 'Social Media',
    route: '/social-media',
    // TODO: Replace with the approved Social Media team introduction.
    intro:
      'The Social Media team plans and publishes the club’s photography across its channels, growing how UPC’s work is seen during the tenure.',
    introIsPlaceholder: true
  },
  {
    slug: 'creatives',
    index: '05',
    name: 'Graphics and Art And Craft',
    route: '/creatives',
    // TODO: Replace with the approved Graphics and Art And Craft introduction.
    intro:
      'The Graphics and Art And Craft team shapes the club’s visual and material design, covering graphics, art and craft for campaigns, events and the tenure’s identity.',
    introIsPlaceholder: true
  }
];

/** A department plus its members, ready to render. */
export const hierarchy = departments.map((department) => ({
  ...department,
  members: membersByDepartment(department.slug)
}));

export const getDepartment = (slug) =>
  hierarchy.find((department) => department.slug === slug) || null;

/** Neighbouring teams — powers the "next team" control on department pages. */
export const getDepartmentNeighbours = (slug) => {
  const i = departments.findIndex((department) => department.slug === slug);
  if (i === -1) return { previous: null, next: null };
  return {
    previous: i > 0 ? departments[i - 1] : null,
    next: i < departments.length - 1 ? departments[i + 1] : null
  };
};

export const departmentRoutes = departments.map((d) => d.slug);
export const teamCount = departments.length;
