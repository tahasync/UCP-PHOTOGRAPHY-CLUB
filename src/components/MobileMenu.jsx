import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../lib/motion.js';
import { NAV_ITEMS } from '../data/navigation.js';
import { CLUB } from '../data/site.js';

/**
 * Full-screen mobile menu: large type, black canvas, restrained stagger.
 * Handles Escape, body scroll lock and keeps Tab focus inside the panel.
 */
export default function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null);
  const firstLinkRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;

    document.body.classList.add('is-locked');
    const focusTimer = window.setTimeout(() => firstLinkRef.current?.focus(), 40);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('is-locked');
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          ref={panelRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.001 : 0.25, ease: EASE }}
        >
          <ul className="mobile-menu__list">
            {NAV_ITEMS.map((item, index) => (
              <motion.li
                key={item.to}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0.001 : 0.4,
                  ease: EASE,
                  delay: reduceMotion ? 0 : 0.05 + index * 0.06
                }}
              >
                <Link
                  className="mobile-menu__link"
                  to={item.to}
                  onClick={onClose}
                  ref={index === 0 ? firstLinkRef : undefined}
                >
                  <span className="mobile-menu__num" aria-hidden="true">
                    {`0${index + 1}`}
                  </span>
                  <span>{item.menuLabel}</span>
                </Link>
              </motion.li>
            ))}
          </ul>

          <p className="mobile-menu__foot">
            <span>{CLUB.name}</span>
            <span>{CLUB.tenure}</span>
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
