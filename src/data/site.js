/**
 * Site-wide constants: club identity, tenure, branding paths and the
 * content status flags used while official material is still pending.
 *
 * NOTE: only touch CLUB / TENURE when the club asks for it — the tenure string
 * appears on every printed card's QR destination page.
 */

export const CLUB = {
  name: 'UCP Photography Club',
  shortName: 'UPC',
  // Rendered as two editorial lines on covers and headings.
  coverLines: ['UCP', 'Photography', 'Club'],
  statement: 'Capture. Create. Connect.',
  description:
    'UCP Photography Club Executive Body and Leadership, 2026–27',
  // Tenure is written with an en dash, matching the club's own documents.
  tenure: '2026–27'
};

/** Branding assets (replace the files, not the components). */
export const BRANDING = {
  // Official club logo supplied by the club (raster). Drop a vector version at
  // the same path to upgrade it — nothing else needs to change.
  logo: '/images/branding/upc-logo.png',
  logoAlt: 'UCP Photography Club logo',
  favicon: '/images/branding/favicon.svg',
  ogImage: '/images/branding/og-cover.jpg'
};

/**
 * Content still awaiting official material.
 * Development only — the production UI derives its labels from member data
 * (e.g. `imagePlaceholder: true`), never from these flags.
 */
export const CONTENT_STATUS = {
  photos: 'placeholder',
  bios: 'placeholder',
  socialLinks: 'pending',
  patrons: 'pending',
  logo: 'supplied'
};

/** Build a public/ asset URL that survives a GitHub Pages base path. */
export const asset = (p) =>
  `${import.meta.env.BASE_URL}${String(p || '').replace(/^\//, '')}`;
