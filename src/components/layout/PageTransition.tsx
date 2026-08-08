import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE } from '../../lib/animations';

/** Props for {@link PageTransition}. */
interface PageTransitionProps {
  /** The routed page content. */
  children: React.ReactNode;
}

/**
 * PageTransition fades and lifts the routed content on every navigation, so
 * routes resolve as one continuous experience instead of snapping between
 * unrelated screens.
 *
 * Two things happen on each route change, in this order:
 *
 * 1. **Scroll to top.** Without it, navigating from deep in a long page lands
 *    mid-way down the next one. Done imperatively rather than with a smooth
 *    behaviour so it completes before the entrance animation is visible.
 * 2. **`ScrollTrigger.refresh()`.** Pinned sections on the incoming page measure
 *    themselves at creation; if the outgoing page's height was still in effect,
 *    every trigger on the new page computes against stale bounds. This is the
 *    fix for pins that appear to activate at the wrong scroll position.
 *
 * Only the enter half is animated. A true exit transition would require holding
 * the outgoing tree mounted, which React Router doesn't do by default — a
 * cross-fade of ~0.5s reads as smooth without that complexity.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      window.scrollTo(0, 0);

      if (prefersReducedMotion) {
        gsap.set(containerRef.current, { clearProps: 'all' });
        ScrollTrigger.refresh();
        return;
      }

      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: EASE.enter,
          // Clear the inline transform once done: a lingering `transform` on an
          // ancestor creates a containing block that breaks `position: fixed`
          // descendants and confuses ScrollTrigger's pin measurements.
          clearProps: 'transform',
          onComplete: () => ScrollTrigger.refresh(),
        }
      );
    },
    { dependencies: [pathname, prefersReducedMotion] }
  );

  return <div ref={containerRef}>{children}</div>;
};
