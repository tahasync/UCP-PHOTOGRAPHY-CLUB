import { CLUB } from '../data/site.js';

/**
 * Suspense fallback. No spinner — just the club mark, tenure and a red-less
 * black rule that draws itself.
 */
export default function BrandLoading() {
  return (
    <div className="brand-loading shell" role="status" aria-live="polite">
      <span className="eyebrow">{CLUB.name}</span>
      <span className="brand-loading__rule" aria-hidden="true" />
      <span className="eyebrow eyebrow--muted">{CLUB.tenure}</span>
      <span className="visually-hidden">Loading</span>
    </div>
  );
}
