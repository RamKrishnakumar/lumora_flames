import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ChevronDown, Flame } from 'lucide-react';
import { CANDLE_CATEGORIES } from '../../data/categories';
import { InteractiveCandleCanvas } from '../../components/canvas/InteractiveCandleCanvas';
import { EmberField } from '../../components/ui/EmberField';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../theme/designSystem';
import { EASE, DURATION, settleInstantly } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

/**
 * Visual identity for the hero's candle: the urli from Traditional & Festive.
 *
 * Looked up from `CANDLE_CATEGORIES` rather than hardcoded, so retoning that
 * collection's wax updates the hero too. Falls through to `undefined` if the
 * lookup misses, and `InteractiveCandleCanvas` renders its neutral jar — the
 * hero must never blank out over a content edit.
 */
const HERO_VISUAL = CANDLE_CATEGORIES.find((c) => c.id === 'traditional-festive')
  ?.subCategories.find((s) => s.id === 'urli-diya')?.visual;

/** Props for {@link HeroChamber}. */
export interface HeroChamberProps {
  /** Scrolls the page to the section below the hero, from the scroll cue. */
  onScrollCue?: () => void;
}

/**
 * HeroChamber is the home page's opening screen: centred display type standing
 * in a dark chamber lit by a single candle.
 *
 * ## Why it is built this way
 *
 * The hero was previously type on a flat background, which for a brand whose
 * entire metaphor is light meant the first screen was unlit. Rather than add a
 * 3D library or another multi-megabyte photograph — imagery is already the
 * app's dominant payload — this composes four cheap layers:
 *
 * 1. a radial amber light pool that breathes, the *cast light*;
 * 2. {@link EmberField}, sparks rising as though a flame burns off-frame;
 * 3. {@link InteractiveCandleCanvas}, the existing procedural candle, scaled up
 *    and cropped by the bottom edge so it reads as being in the room with you;
 * 4. the headline, genuinely centred in a column.
 *
 * Total added image weight: zero.
 *
 * ## Motion
 *
 * Everything animates transform and opacity only. On scroll the type drifts up
 * and the light pool dims, so leaving the hero reads as the candle being carried
 * out of the room. On desktop, pointer movement parallaxes the candle and pool
 * against each other for shallow depth.
 *
 * With reduced motion preferred: no embers, no breathing, no parallax, no scroll
 * fade. The candle still renders lit and the pool still glows, so the screen is
 * a lit chamber even when perfectly still.
 */
export const HeroChamber: React.FC<HeroChamberProps> = ({ onScrollCue }) => {
  const rootRef = useRef<HTMLElement>(null);
  const candleRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        settleInstantly(['.hero-eyebrow', '.hero-line', '.hero-subtitle', '.hero-cue']);
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE.enter } });

      // The chamber lights first, then the type arrives into it — the order is
      // the point, and it's why the pool is on the same timeline as the copy.
      tl.fromTo(
        poolRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'sine.out' }
      )
        .fromTo(
          candleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.4 },
          0.15
        )
        .fromTo(
          '.hero-eyebrow',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: DURATION.fast },
          0.5
        )
        // Per-line stagger rather than one block fade: the headline assembles
        // itself, which is the single most "premium" beat on the page.
        .fromTo(
          '.hero-line',
          { y: 46, opacity: 0 },
          { y: 0, opacity: 1, duration: DURATION.slow, stagger: 0.12 },
          0.65
        )
        .fromTo(
          '.hero-subtitle',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: DURATION.base },
          '-=0.45'
        )
        .fromTo('.hero-cue', { opacity: 0 }, { opacity: 1, duration: DURATION.base }, '-=0.2');

      // The pool breathes, as a real flame's cast light does.
      gsap.to(poolRef.current, {
        opacity: 0.72,
        scale: 1.06,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: EASE.ambient,
        delay: 1.5,
      });

      // Leaving the hero: type lifts away and the light goes with it.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        })
        .to('.hero-fade', { yPercent: -28, opacity: 0, ease: EASE.scrub }, 0)
        .to(poolRef.current, { opacity: 0.15, ease: EASE.scrub }, 0);
    },
    { scope: rootRef, dependencies: [prefersReducedMotion] }
  );

  // Pointer parallax. Separate from the entrance so the two never fight over the
  // same tween, and pointer-driven so it costs nothing until the mouse moves.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      // `(pointer: fine)` rather than a width query: the target is "has a mouse",
      // and a touch device that happens to be wide still shouldn't run this.
      if (!window.matchMedia('(pointer: fine)').matches) return;

      const root = rootRef.current;
      if (!root) return;

      // `quickTo` reuses one tween per property instead of allocating a new one
      // per pointer event — the difference is visible on a 120Hz trackpad.
      const candleX = gsap.quickTo(candleRef.current, 'x', { duration: 0.9, ease: 'power2.out' });
      const candleY = gsap.quickTo(candleRef.current, 'y', { duration: 0.9, ease: 'power2.out' });
      const poolX = gsap.quickTo(poolRef.current, 'x', { duration: 1.3, ease: 'power2.out' });

      const onPointerMove = (event: PointerEvent) => {
        const { width, height } = root.getBoundingClientRect();
        // Normalised to −1…1 around centre.
        const nx = (event.clientX / width) * 2 - 1;
        const ny = (event.clientY / height) * 2 - 1;

        candleX(nx * 8);
        candleY(ny * 6);
        // The pool trails further than the candle, which is what creates depth.
        poolX(nx * 18);
      };

      root.addEventListener('pointermove', onPointerMove);
      return () => root.removeEventListener('pointermove', onPointerMove);
    },
    { scope: rootRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      ref={rootRef}
      aria-label="Lumora Flames"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden"
    >
      {/* Layer 1 — the chamber. Deepens the base so the amber reads as light
          rather than as a coloured panel, in both themes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-100 via-stone-50 to-amber-50/40 dark:from-stone-950 dark:via-stone-950 dark:to-stone-900"
      />

      {/* Layer 2 — cast light. */}
      <div
        ref={poolRef}
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0', DESIGN_TOKENS.overlay.scrimRadial)}
      />

      {/* Layer 3 — embers. Renders nothing under reduced motion. */}
      <EmberField count={14} className="bottom-0 top-auto h-2/3" />

      {/* Layer 4 — the candle. Cropped by the section's bottom edge so it feels
          present in the room instead of pasted on. `scale` on a wrapper rather
          than new geometry, so the existing canvas is reused untouched. */}
      <div
        ref={candleRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[26%] scale-[1.15] opacity-90 sm:scale-[1.45] lg:scale-[1.7]"
      >
        <InteractiveCandleCanvas flameIntensity={1} visual={HERO_VISUAL} label="Lumora" />
      </div>

      {/* Type. Sits above the candle's flame, which is why the column is capped
          and pushed up off the vertical centre. */}
      <div
        className={cn(
          'hero-fade relative z-10 flex flex-col items-center text-center',
          DESIGN_TOKENS.layout.contained,
          'max-w-4xl gap-7 pb-40 pt-28 sm:gap-9 sm:pb-48 sm:pt-32'
        )}
      >
        <span className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 backdrop-blur-md dark:text-amber-300">
          <Flame className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
          Handcrafted Artisanal Luxury
        </span>

        <h1
          className={cn(
            DESIGN_TOKENS.typography.heroTitle,
            'text-stone-900 dark:text-stone-50'
          )}
        >
          {/* Each line is its own block so the stagger reads as type rising out
              of the page rather than fading in place. */}
          <span className="hero-line block">Crafted to</span>
          <span className="hero-line block font-light italic text-amber-500">illuminate</span>
          <span className="hero-line block">your world.</span>
        </h1>

        <p className="hero-subtitle max-w-2xl text-base font-light leading-relaxed text-stone-600 dark:text-stone-300 sm:text-lg">
          Custom fragrance blends, frosted glass jars, playful wax sculpture, and festive urlis —
          natural soy wax, poured by hand for quiet luxury.
        </p>
      </div>

      {/* Scroll cue. A real button when a handler is supplied, so it works from
          the keyboard rather than being decoration that only looks clickable. */}
      {onScrollCue ? (
        <button
          type="button"
          onClick={onScrollCue}
          className={cn(
            'hero-cue absolute bottom-6 left-1/2 z-10 -translate-x-1/2 inline-flex h-11 items-center gap-2 rounded-full px-4',
            'text-stone-500 transition-colors hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
            DESIGN_TOKENS.typography.button
          )}
        >
          Scroll to explore
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            'hero-cue absolute bottom-8 left-1/2 z-10 -translate-x-1/2 inline-flex items-center gap-2 text-stone-500 dark:text-stone-400',
            DESIGN_TOKENS.typography.button
          )}
        >
          Scroll to explore
          <ChevronDown className="h-4 w-4" />
        </span>
      )}
    </section>
  );
};
