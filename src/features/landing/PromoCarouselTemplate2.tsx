import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import type { ReasonSlide } from '../../types/promotion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../theme/designSystem';
import { EASE, DURATION } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

/** Props for {@link PromoCarouselTemplate2}. */
export interface PromoCarouselTemplate2Props {
  /** Statements to cycle through, in order. Renders nothing when empty. */
  slides: ReasonSlide[];
  /** Fired with `targetCollectionId` when a statement's CTA is activated. */
  onNavigateCollection: (collectionId: string) => void;
  /** Accessible name for the region. */
  label?: string;
}

/**
 * PromoCarouselTemplate2 is the typographic band: oversized statement type where
 * each claim occupies the same space, advanced by scroll rather than a timer.
 *
 * ## Why scroll and not autoplay
 *
 * Long-form copy on a timer is hostile — it can vanish mid-sentence. Here the
 * visitor's scroll *is* the transition, so a statement holds exactly as long as
 * they want it. That also sidesteps WCAG 2.2.2 entirely: nothing moves on its
 * own, so there is nothing to pause.
 *
 * ## Scroll mechanics
 *
 * The section pins for `slides.length × 100vh`, and the active index is derived
 * from scroll progress. Progress is committed to React state **only when the
 * index actually changes** — writing on every scroll frame would re-render the
 * tree continuously. The comparison value lives in a ref, not state, because
 * GSAP builds the `onUpdate` closure once and would otherwise capture a stale
 * index forever.
 *
 * Deliberately carries no photography: it sits between two image-heavy screens
 * and its job is to give the eye somewhere quiet to rest.
 *
 * With reduced motion preferred nothing pins — every statement renders as a
 * plain stacked list, which is also the keyboard-friendliest form.
 */
export const PromoCarouselTemplate2: React.FC<PromoCarouselTemplate2Props> = ({
  slides,
  onNavigateCollection,
  label = 'Why choose a candle',
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [activeIdx, setActiveIdx] = useState(0);
  /** Mirrors `activeIdx` for the ScrollTrigger closure. See the JSDoc above. */
  const activeIdxRef = useRef(0);

  const total = slides.length;

  useGSAP(
    () => {
      if (prefersReducedMotion || total === 0) return;

      const trigger = ScrollTrigger.create({
        trigger: stageRef.current,
        start: 'top top',
        // One viewport per statement gives each one room to be read.
        end: `+=${total * 100}%`,
        pin: true,
        snap: total > 1 ? { snapTo: 1 / (total - 1), duration: 0.3, ease: EASE.enter } : undefined,
        onUpdate: (self) => {
          // `progress` hits exactly 1 at the end, which would index past the
          // last statement — clamp rather than let it overflow.
          const next = Math.min(Math.floor(self.progress * total), total - 1);
          if (next !== activeIdxRef.current) {
            activeIdxRef.current = next;
            setActiveIdx(next);
          }
        },
      });

      return () => trigger.kill();
    },
    { scope: stageRef, dependencies: [total, prefersReducedMotion] }
  );

  // Word-level stagger on each change. Keyed off `activeIdx` rather than driven
  // from the scroll timeline, so it plays identically for scroll, snap, and the
  // progress-rail buttons.
  useGSAP(
    () => {
      if (prefersReducedMotion || !copyRef.current) return;

      gsap.fromTo(
        '.band-word',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: DURATION.base,
          stagger: 0.045,
          ease: EASE.enter,
        }
      );

      gsap.fromTo(
        ['.band-support', '.band-cta'],
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: DURATION.base, stagger: 0.08, ease: EASE.enter, delay: 0.2 }
      );
    },
    { scope: copyRef, dependencies: [activeIdx, prefersReducedMotion] }
  );

  if (total === 0) return null;

  const active = slides[activeIdx] ?? slides[0];
  if (!active) return null;

  /**
   * Splits a phrase into per-word spans for the stagger.
   *
   * Each word gets an `overflow-hidden` wrapper so its inner span can slide up
   * from behind a hard edge — the words appear to rise out of the page rather
   * than fading in place. The trailing space is inside the wrapper, so copy can
   * still be selected and read as a sentence.
   */
  const words = (phrase: string, accent = false) =>
    phrase
      .split(' ')
      .filter(Boolean)
      .map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span
            className={cn(
              'band-word inline-block',
              accent && 'font-light italic text-amber-500 dark:text-amber-400'
            )}
          >
            {word}
            {' '}
          </span>
        </span>
      ));

  /** One statement, with its supporting line and CTA. Shared by both layouts. */
  const renderStatement = (slide: ReasonSlide, index: number, attachRef: boolean) => (
    <div ref={attachRef ? copyRef : undefined} className="space-y-8">
      <p className={cn(DESIGN_TOKENS.typography.displayBand, 'text-stone-900 dark:text-stone-50')}>
        {words(slide.lead)}
        {words(slide.highlight, true)}
        {slide.trail.trim() && words(slide.trail)}
      </p>

      <p className="band-support max-w-xl text-base font-light leading-relaxed text-stone-600 dark:text-stone-400">
        {slide.support}
      </p>

      <button
        type="button"
        onClick={() => onNavigateCollection(slide.targetCollectionId)}
        className={cn(
          'band-cta group inline-flex items-center gap-3 rounded-full border border-stone-300 px-6 py-3.5 text-stone-900 transition-colors',
          'hover:border-amber-500 hover:text-amber-600 dark:border-stone-700 dark:text-stone-100 dark:hover:border-amber-400 dark:hover:text-amber-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-50 dark:focus-visible:ring-offset-stone-950',
          DESIGN_TOKENS.typography.button
        )}
      >
        {slide.ctaText}
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </button>

      <span className="sr-only">
        Reason {index + 1} of {total}
      </span>
    </div>
  );

  const heading = (
    <div className="space-y-3">
      <span className={DESIGN_TOKENS.typography.eyebrow}>Why a candle</span>
    </div>
  );

  // Reduced motion: no pin, no scroll hijack — every statement stacked plainly.
  if (prefersReducedMotion) {
    return (
      <section
        aria-label={label}
        className={cn(DESIGN_TOKENS.layout.contained, 'space-y-16 py-20')}
      >
        {heading}
        {slides.map((slide, index) => (
          <div key={slide.id} className="border-t border-stone-200 pt-12 dark:border-stone-800">
            {renderStatement(slide, index, false)}
          </div>
        ))}
      </section>
    );
  }

  return (
    <div ref={stageRef} className="relative w-full overflow-hidden">
      <section
        aria-label={label}
        /* Only the pinned branch is a carousel — one statement occupies the space
           at a time and the dots move between them. The reduced-motion branch
           above is a plain list, where the role description would be a lie. */
        aria-roledescription="carousel"
        className={cn(
          DESIGN_TOKENS.layout.contained,
          'flex min-h-[100svh] flex-col justify-center gap-10 py-24'
        )}
      >
        {heading}

        {/*
          Announce the statement politely as it changes. Scoped to the copy so
          the progress rail isn't re-read on every advance.
        */}
        <div aria-live="polite" aria-atomic="true">
          {renderStatement(active, activeIdx, true)}
        </div>

        {/* Progress rail. Also a control: clicking jumps to a statement, so the
            copy is reachable without scrubbing the whole band. */}
        <nav aria-label="Reasons" className="flex items-center gap-2.5">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`${slide.lead} ${slide.highlight}`.trim()}
              aria-current={index === activeIdx}
              onClick={() => {
                activeIdxRef.current = index;
                setActiveIdx(index);
              }}
              className="group flex h-11 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full px-0.5"
            >
              <span
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  index === activeIdx
                    ? 'w-12 bg-amber-500'
                    : 'w-5 bg-stone-300 group-hover:bg-amber-500/50 dark:bg-stone-700'
                )}
              />
            </button>
          ))}
          <span className="ml-3 text-xs font-light tabular-nums text-stone-500 dark:text-stone-400">
            {String(activeIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </nav>
      </section>
    </div>
  );
};
