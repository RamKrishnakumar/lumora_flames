import React from 'react';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../theme/designSystem';

/**
 * RouteFallback is the `Suspense` fallback shown while a lazily-loaded route
 * chunk downloads.
 *
 * A branded skeleton rather than a spinner: it reserves the shape of the page
 * about to appear, so the transition reads as content arriving instead of a
 * layout jump. Sized to fill the viewport so the footer doesn't ride up.
 *
 * `animate-pulse` is a CSS animation, not GSAP — the GSAP rule covers
 * choreographed motion, and a placeholder shimmer would be wasteful to script.
 * It is wrapped in `motion-safe:` so it stops under reduced-motion preferences.
 */
export const RouteFallback: React.FC = () => (
  <div
    role="status"
    aria-label="Loading page"
    className={cn(
      'mx-auto min-h-screen pb-24',
      DESIGN_TOKENS.layout.maxWidth,
      DESIGN_TOKENS.layout.paddingX,
      DESIGN_TOKENS.layout.headerOffset
    )}
  >
    <div className="motion-safe:animate-pulse space-y-8">
      {/* Eyebrow */}
      <div className="h-4 w-40 rounded-full bg-stone-200 dark:bg-stone-800" />

      {/* Headline, three descending lines */}
      <div className="space-y-4">
        <div className="h-12 w-3/4 rounded-2xl bg-stone-200 dark:bg-stone-800 sm:h-16" />
        <div className="h-12 w-1/2 rounded-2xl bg-stone-200 dark:bg-stone-800 sm:h-16" />
      </div>

      {/* Body copy */}
      <div className="space-y-3">
        <div className="h-4 w-full max-w-2xl rounded-full bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-5/6 max-w-xl rounded-full bg-stone-200 dark:bg-stone-800" />
      </div>

      {/* Large media block */}
      <div className="h-[45vh] w-full rounded-[2.5rem] bg-stone-200 dark:bg-stone-800" />
    </div>
  </div>
);
