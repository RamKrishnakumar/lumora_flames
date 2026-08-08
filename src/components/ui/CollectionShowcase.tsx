import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import type { Category } from '../../types/category';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../theme/designSystem';
import { EASE, DURATION, settleInstantly } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

/**
 * Layout treatment for a showcase block.
 *
 * The landing page assigns a different variant to each collection so no two
 * blocks scroll alike — the brief calls for six showcases that each feel
 * distinct, not one card repeated six times.
 *
 * - `editorial` — tall portrait image beside a text column; the calm default.
 * - `fullBleed` — edge-to-edge image with copy overlaid on a scrim.
 * - `offsetFrame` — image inset within an offset frame, copy overlapping it.
 * - `splitReveal` — image and copy wipe in from opposing axes.
 */
export type ShowcaseVariant = 'editorial' | 'fullBleed' | 'offsetFrame' | 'splitReveal';

/** Props for {@link CollectionShowcase}. */
export interface CollectionShowcaseProps {
  /** The collection to present. */
  category: Category;
  /** Ordinal shown as the section index, e.g. `01`. 1-based. */
  index: number;
  /** Layout treatment. See {@link ShowcaseVariant}. */
  variant: ShowcaseVariant;
  /**
   * Mirrors the layout horizontally. Alternating this down the page keeps a
   * column of blocks from marching in lockstep.
   */
  flipped?: boolean;
  /** Invoked with the collection id when the block is activated. */
  onSelect: (categoryId: string) => void;
  /**
   * Skips `loading="lazy"` on the image. Set on the first block only — the
   * topmost image is above the fold and lazy-loading it delays first paint.
   */
  eager?: boolean;
}

/** Image aspect and framing per variant. */
const VARIANT_FRAME: Record<ShowcaseVariant, string> = {
  editorial: 'aspect-[3/4] rounded-[2rem]',
  fullBleed: 'aspect-[4/5] sm:aspect-[16/10] rounded-[2.5rem]',
  offsetFrame: 'aspect-square rounded-[2rem]',
  splitReveal: 'aspect-[4/5] rounded-[2rem]',
};

/**
 * CollectionShowcase presents one collection as an editorial scroll moment.
 *
 * Each instance scroll-reveals with parallax on the photograph and a
 * variant-specific entrance on the copy. It replaces the uniform card grid the
 * landing page used to render, so the six collections read as six deliberate
 * spreads rather than six database rows.
 *
 * The whole block is a single `<button>`: the image, copy, and CTA are one
 * target, which gives a large tap area on touch devices and one stop in the tab
 * order instead of three competing ones.
 */
export const CollectionShowcase: React.FC<CollectionShowcaseProps> = ({
  category,
  index,
  variant,
  flipped = false,
  onSelect,
  eager = false,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        settleInstantly(['.showcase-copy > *', imageRef.current]);
        return;
      }

      // Parallax drift on the photograph, scrubbed by scroll position. `yPercent`
      // on the oversized image avoids animating layout properties.
      gsap.fromTo(
        imageRef.current,
        { yPercent: -8, scale: 1.12 },
        {
          yPercent: 8,
          scale: 1.12,
          ease: EASE.scrub,
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      // Copy entrance, played once when the block comes into view.
      const tl = gsap.timeline({
        defaults: { ease: EASE.enter },
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
      });

      if (variant === 'splitReveal') {
        // Copy wipes from one edge while the frame wipes from the opposite —
        // two crossing axes read as deliberate editorial design.
        tl.fromTo(
          imageRef.current?.parentElement ?? [],
          { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
          { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: DURATION.slow },
          0
        ).fromTo(
          '.showcase-copy > *',
          { x: flipped ? 40 : -40, opacity: 0 },
          { x: 0, opacity: 1, duration: DURATION.base, stagger: 0.08 },
          0.25
        );
      } else if (variant === 'offsetFrame') {
        tl.fromTo(
          imageRef.current?.parentElement ?? [],
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: DURATION.slow },
          0
        ).fromTo(
          '.showcase-copy > *',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: DURATION.base, stagger: 0.08 },
          0.3
        );
      } else {
        tl.fromTo(
          '.showcase-copy > *',
          { y: 34, opacity: 0 },
          { y: 0, opacity: 1, duration: DURATION.base, stagger: 0.09 },
          0
        );
      }
    },
    { scope: rootRef, dependencies: [prefersReducedMotion, variant, flipped] }
  );

  const isOverlaid = variant === 'fullBleed';

  /** Photograph plus its scrim. Shared by every variant. */
  const frame = (
    <div className={cn('relative overflow-hidden', VARIANT_FRAME[variant])}>
      <img
        ref={imageRef}
        src={category.heroImage}
        alt={`${category.title} — ${category.tagline}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        /* Oversized so the parallax drift never exposes an edge. */
        className="absolute inset-0 h-[118%] w-full -translate-y-[8%] object-cover"
      />
      <div
        className={cn(
          'absolute inset-0',
          isOverlaid ? DESIGN_TOKENS.overlay.scrimBottom : 'bg-stone-950/15 dark:bg-stone-950/35'
        )}
      />
    </div>
  );

  /** Eyebrow, title, description, and CTA affordance. */
  const copy = (
    <div className={cn('showcase-copy space-y-5', isOverlaid && 'max-w-2xl')}>
      <span
        className={cn(
          'flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em]',
          isOverlaid ? 'text-amber-300' : 'text-amber-500'
        )}
      >
        <span className="tabular-nums">{String(index).padStart(2, '0')}</span>
        <span className="h-px w-10 bg-current opacity-40" aria-hidden="true" />
        {category.tagline}
      </span>

      <h3
        className={cn(
          DESIGN_TOKENS.typography.panelTitle,
          isOverlaid ? 'text-white' : 'text-stone-900 dark:text-stone-100'
        )}
      >
        {category.title}
      </h3>

      <p
        className={cn(
          DESIGN_TOKENS.typography.body,
          'max-w-xl',
          isOverlaid ? 'text-stone-300' : 'text-stone-600 dark:text-stone-400'
        )}
      >
        {category.description}
      </p>

      <span
        className={cn(
          'inline-flex items-center gap-2.5 pt-1 transition-colors',
          DESIGN_TOKENS.typography.button,
          isOverlaid
            ? 'text-amber-300 group-hover:text-amber-200'
            : 'text-amber-500 group-hover:text-amber-400'
        )}
      >
        Explore {category.subCategories.length} Varieties
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </span>
    </div>
  );

  return (
    <div ref={rootRef}>
      <button
        type="button"
        onClick={() => onSelect(category.id)}
        className="group block w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-8 focus-visible:ring-offset-stone-50 dark:focus-visible:ring-offset-stone-950 rounded-[2.5rem]"
      >
        {isOverlaid ? (
          <div className="relative">
            {frame}
            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-12 lg:p-16">{copy}</div>
          </div>
        ) : variant === 'offsetFrame' ? (
          /* Copy overlaps the frame's inner corner, so the two blocks interlock
             instead of sitting in tidy adjacent columns. */
          <div
            className={cn(
              'grid items-center gap-8 lg:grid-cols-12 lg:gap-0',
              flipped && 'lg:[direction:rtl] lg:*:[direction:ltr]'
            )}
          >
            <div className="lg:col-span-7">{frame}</div>
            <div className="lg:col-span-5 lg:-ml-16 lg:rounded-[2rem] lg:p-10 lg:backdrop-blur-xl lg:bg-white/60 lg:dark:bg-stone-950/50 lg:border lg:border-stone-200/70 lg:dark:border-stone-800/70 lg:shadow-2xl">
              {copy}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20',
              flipped && 'lg:[direction:rtl] lg:*:[direction:ltr]'
            )}
          >
            {frame}
            {copy}
          </div>
        )}
      </button>
    </div>
  );
};
