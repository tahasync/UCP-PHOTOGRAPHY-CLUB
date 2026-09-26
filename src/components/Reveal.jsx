import { motion, useReducedMotion } from 'framer-motion';
import { EASE, DURATION } from '../lib/motion.js';

/**
 * Fade + rise on first scroll into view.
 * Collapses to a plain element when the visitor prefers reduced motion.
 */
export default function Reveal({
  as = 'div',
  delay = 0,
  distance = 18,
  className,
  children,
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as] || motion.div;

  if (reduceMotion) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
      transition={{ duration: DURATION.slow, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
