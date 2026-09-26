import { motion, useReducedMotion } from 'framer-motion';
import { EASE, DURATION } from '../lib/motion.js';

/** Page shell used by every route: fade + short rise, no long waits. */
export default function PageTransition({ children, className = '' }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.main
      id="main"
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: DURATION.base, ease: EASE }}
    >
      {children}
    </motion.main>
  );
}
