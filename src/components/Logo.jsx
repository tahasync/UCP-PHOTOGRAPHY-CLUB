import { BRANDING, asset } from '../data/site.js';

/**
 * Official club logo. Components never hard-code the file path — replace
 * `public/images/branding/upc-logo.png` (or point BRANDING.logo at a vector
 * version) and every instance updates.
 */
export default function Logo({
  className = '',
  width = 1400,
  height = 719,
  decorative = false,
  alt,
  eager = true
}) {
  return (
    <img
      className={className}
      src={asset(BRANDING.logo)}
      alt={decorative ? '' : alt || BRANDING.logoAlt}
      aria-hidden={decorative || undefined}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
