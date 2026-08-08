import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { CANDLE_CATEGORIES } from '../../data/categories';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../theme/designSystem';
import { EASE } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

/** Props for {@link CollectionsStoryView}. */
interface CollectionsStoryViewProps {
  /** Invoked with a collection id when its glass button is activated. */
  onOpenSubCategory: (categoryId: string) => void;
}

/**
 * Scroll animation assigned to each collection section, by position.
 *
 * Every collection gets a different entrance so no two sections resolve the same
 * way — the brief explicitly rules out repeating one effect six times.
 */
type StoryMotion = 'clip' | 'parallax' | 'scale' | 'slide' | 'zoom' | 'tilt';

const STORY_MOTIONS: StoryMotion[] = ['clip', 'parallax', 'scale', 'slide', 'zoom', 'tilt'];

/**
 * CollectionsStoryView is the collections page: six pinned full-viewport
 * sections, each a cinematic moment for one collection, with a frosted glass CTA
 * that holds in place for the length of its section and is then replaced by the
 * next.
 *
 * ## How the button handoff works
 *
 * Each section pins for one viewport of scroll, so its button is naturally
 * stationary while that section is on screen. The handoff is a cross-fade driven
 * by the same scrubbed timeline: the outgoing button fades over the final ~15% of
 * its section as the incoming one arrives, so buttons dissolve into each other
 * rather than popping.
 *
 * With reduced motion preferred, nothing pins and no section animates — the six
 * collections render as a plain stacked list with their CTAs inline.
 */
export const CollectionsStoryView: React.FC<CollectionsStoryViewProps> = ({
  onOpenSubCategory,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const sections = gsap.utils.toArray<HTMLElement>('.collection-viewport-section');

      sections.forEach((section, index) => {
        const bg = section.querySelector('.sec-bg');
        const title = section.querySelector('.sec-title');
        const tagline = section.querySelector('.sec-tagline');
        const body = section.querySelector('.sec-body');
        const cta = section.querySelector('.sec-cta');
        const motion = STORY_MOTIONS[index % STORY_MOTIONS.length];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            pin: true,
            pinSpacing: true,
          },
        });

        // Shared slow push on the photograph, under every variant.
        tl.to(bg, { scale: 1.18, yPercent: 6, ease: EASE.scrub }, 0);

        switch (motion) {
          case 'clip':
            tl.fromTo(
              title,
              { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 0 },
              {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                opacity: 1,
                ease: EASE.enter,
              },
              0
            );
            break;
          case 'parallax':
            tl.fromTo(title, { y: 120, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out' }, 0);
            break;
          case 'scale':
            tl.fromTo(
              title,
              { scale: 0.7, opacity: 0 },
              { scale: 1, opacity: 1, ease: 'back.out(1.7)' },
              0
            );
            break;
          case 'slide':
            tl.fromTo(title, { x: -100, opacity: 0 }, { x: 0, opacity: 1, ease: EASE.enter }, 0);
            break;
          case 'zoom':
            // Blur is expensive to composite; kept short and paired with depth.
            tl.fromTo(section, { filter: 'blur(10px)' }, { filter: 'blur(0px)', duration: 0.5 }, 0);
            tl.fromTo(title, { z: -200, opacity: 0 }, { z: 0, opacity: 1 }, 0);
            break;
          case 'tilt':
            tl.fromTo(title, { rotateX: 45, opacity: 0 }, { rotateX: 0, opacity: 1 }, 0);
            break;
        }

        tl.fromTo(tagline, { y: 25, opacity: 0 }, { y: 0, opacity: 1 }, 0.15)
          .fromTo(body, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, 0.25)
          // The CTA arrives early and holds, then releases at the very end of the
          // section so the next section's button takes over mid-fade.
          .fromTo(cta, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 }, 0.2)
          .to(cta, { opacity: 0, duration: 0.15 }, 0.85);
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {CANDLE_CATEGORIES.map((category, index) => (
        <section
          key={category.id}
          aria-labelledby={`story-${category.id}`}
          className={cn(
            'collection-viewport-section relative flex w-full flex-col justify-end overflow-hidden',
            // Reduced motion drops the viewport lock so content can simply flow.
            prefersReducedMotion ? 'min-h-[85vh] py-20' : 'h-screen',
            'px-6 pb-16 sm:px-12 sm:pb-20 lg:px-16'
          )}
        >
          {/* Photograph + scrim */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={category.heroImage}
              alt={`${category.title} — ${category.tagline}`}
              /* First section is above the fold; the rest load on approach. */
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="sec-bg h-full w-full object-cover brightness-[0.65] dark:brightness-[0.45]"
            />
            <div className={cn('absolute inset-0', DESIGN_TOKENS.overlay.scrimSide)} />
            <div className={cn('absolute inset-0', DESIGN_TOKENS.overlay.scrimBottom)} />
          </div>

          {/* Narrative + CTA. Stacked on phones, side-by-side from `lg`. */}
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-2xl space-y-4">
              <span className="sec-tagline inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/20 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Collection {String(index + 1).padStart(2, '0')} • {category.tagline}
              </span>

              <h2
                id={`story-${category.id}`}
                className="sec-title text-4xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl"
              >
                {category.title}
              </h2>

              <p className="sec-body max-w-lg text-sm font-light leading-relaxed text-stone-300 sm:text-base">
                {category.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenSubCategory(category.id)}
              className={cn(
                'sec-cta group flex shrink-0 items-center gap-3 rounded-full border border-white/40 px-7 py-4 text-white transition-all duration-300 hover:bg-white/30 sm:px-8 sm:py-5 dark:hover:bg-white/20',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950',
                DESIGN_TOKENS.glass.floatingBtn,
                DESIGN_TOKENS.typography.button
              )}
            >
              <span>Explore {category.subCategories.length} varieties</span>
              <ArrowUpRight className="h-4 w-4 text-amber-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </button>
          </div>
        </section>
      ))}
    </div>
  );
};
