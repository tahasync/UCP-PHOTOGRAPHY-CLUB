/**
 * Shared motion tokens.
 * Restrained by design: fast, ease-out, never bouncy.
 */

export const EASE = [0.22, 1, 0.36, 1];

export const DURATION = {
  fast: 0.2,
  base: 0.32,
  slow: 0.5,
  reveal: 0.7
};

/** Standard fade + rise used for sections entering the viewport. */
export const fadeUp = (delay = 0, distance = 18) => ({
  initial: { opacity: 0, y: distance },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8% 0px -8% 0px' },
  transition: { duration: DURATION.slow, ease: EASE, delay }
});

/** Parent/child pair for staggering lists without animating each row by hand. */
export const listParent = (stagger = 0.05, delayChildren = 0.05) => ({
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-6% 0px -6% 0px' },
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } }
  }
});

export const listItem = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE } }
};
