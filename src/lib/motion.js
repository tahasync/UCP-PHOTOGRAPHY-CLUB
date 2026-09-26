/**
 * Shared motion tokens.
 * Butter-smooth, editorial easing curve and refined durations.
 */

// Smooth exponential ease-out curve (feels silky and luxury)
export const EASE = [0.16, 1, 0.3, 1];

export const DURATION = {
  fast: 0.25,
  base: 0.45,
  slow: 0.65,
  reveal: 0.85
};

/** Standard fade + gentle float used for sections entering the viewport. */
export const fadeUp = (delay = 0, distance = 20) => ({
  initial: { opacity: 0, y: distance },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-6% 0px -6% 0px' },
  transition: { duration: DURATION.slow, ease: EASE, delay }
});

/** Parent/child pair for staggering lists without animating each row by hand. */
export const listParent = (stagger = 0.06, delayChildren = 0.05) => ({
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-6% 0px -6% 0px' },
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } }
  }
});

export const listItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE } }
};

