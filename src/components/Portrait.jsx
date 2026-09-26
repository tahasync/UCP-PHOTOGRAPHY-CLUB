import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { asset } from '../data/site.js';
import { EASE } from '../lib/motion.js';
import ImagePlaceholder from './ImagePlaceholder.jsx';

/**
 * Editorial portrait: large rectangular crop, never a circular avatar.
 * Falls back to a neutral panel if the file is missing, and reveals with a
 * short vertical wipe instead of a flashy animation.
 */
export default function Portrait({
  member,
  ratio = '4x5',
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  className = ''
}) {
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  const alt = member.imagePlaceholder
    ? `Placeholder portrait for ${member.name}, ${member.position}.`
    : `Portrait of ${member.name}, ${member.position} of UCP Photography Club, 2026–27.`;

  const showFallback = failed || !member.image;

  return (
    <figure className={`portrait portrait--${ratio} ${className}`.trim()}>
      {showFallback ? (
        <ImagePlaceholder label={alt} />
      ) : (
        <picture>
          {member.imageWebp ? (
            <source type="image/webp" srcSet={asset(member.imageWebp)} />
          ) : null}
          <img
            src={asset(member.image)}
            alt={alt}
            width={1200}
            height={1500}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            fetchpriority={priority ? 'high' : undefined}
            decoding="async"
            onError={() => setFailed(true)}
          />
        </picture>
      )}

      {!reduceMotion ? (
        <motion.span
          className="portrait__veil"
          aria-hidden="true"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.08 }}
        />
      ) : null}
    </figure>
  );
}
