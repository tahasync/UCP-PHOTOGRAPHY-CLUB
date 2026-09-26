/**
 * Neutral panel shown while an official portrait is missing or fails to load.
 * Never a broken image box, never a stock photo of a real person.
 */
export default function ImagePlaceholder({ label = 'Portrait pending' }) {
  return (
    <div className="image-placeholder" role="img" aria-label={label}>
      <span className="image-placeholder__mark" aria-hidden="true" />
      <span className="image-placeholder__text">UPC · 2026–27</span>
    </div>
  );
}
