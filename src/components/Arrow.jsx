/**
 * Inline arrow glyph.
 * Drawn as SVG rather than typed as →/↗ so the arrows stay crisp and match
 * Inter's editorial weight in every browser (those code points are outside
 * the font's Latin subset).
 */
const PATHS = {
  right: 'M2.5 8h11M9.2 3.6 13.6 8l-4.4 4.4',
  left: 'M13.5 8h-11M6.8 3.6 2.4 8l4.4 4.4',
  'up-right': 'M4.8 11.2 11.4 4.6M6.6 4.6h4.8v4.8',
  down: 'M8 2.5v11M3.6 9.2 8 13.6l4.4-4.4'
};

export default function Arrow({ direction = 'right', className = '' }) {
  const path = PATHS[direction] || PATHS.right;

  return (
    <svg
      className={`arrow ${className}`.trim()}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
