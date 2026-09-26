/**
 * Primary navigation items.
 * `match` lists the route prefixes that should mark an item as current —
 * department pages live at the top level, so Hierarchy claims them too.
 */
export const NAV_ITEMS = [
  {
    to: '/present-body',
    label: 'Present Body',
    menuLabel: 'Present Body',
    match: ['/present-body']
  },
  {
    to: '/patrons',
    label: 'Patrons',
    menuLabel: 'Patrons Body',
    match: ['/patrons']
  },
  {
    to: '/hierarchy',
    label: 'Hierarchy',
    menuLabel: 'Hierarchy',
    match: [
      '/hierarchy',
      '/operations',
      '/editing',
      '/comms',
      '/social-media',
      '/creatives'
    ]
  }
];

/** True when `pathname` belongs to the nav item. */
export const isNavItemActive = (item, pathname) =>
  item.match.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
