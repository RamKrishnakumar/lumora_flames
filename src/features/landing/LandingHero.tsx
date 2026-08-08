import React, { useRef } from 'react';
import { Flame } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CANDLE_CATEGORIES } from '../../data/categories';
import { CollectionShowcase, type ShowcaseVariant } from '../../components/ui/CollectionShowcase';
import { PromotionalCarousel } from './PromotionalCarousel';
import { CampaignShowcase } from './CampaignShowcase';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../theme/designSystem';
import { EASE, DURATION, settleInstantly } from '../../lib/animations';

/**
 * Layout treatment assigned to each collection showcase, by position.
 *
 * Deliberately non-repeating across the first four so no two consecutive blocks
 * scroll alike; the sequence then cycles. Combined with the alternating `flipped`
 * flag below, each of the six collections gets a distinct spread.
 */
const SHOWCASE_VARIANTS: ShowcaseVariant[] = [
  'fullBleed',
  'editorial',
  'offsetFrame',
  'splitReveal',
  'editorial',
  'fullBleed',
];

/** Props for {@link LandingHero}. */
interface LandingHeroProps {
  /** Handler invoked with a collection id when a showcase is activated. */
  onSelectCategory: (categoryId: string) => void;
}

/**
 * LandingHero is the home page composition: a typographic opening statement, the
 * promotional carousel, six editorial collection showcases, and the campaign
 * wall.
 *
 * The collections were previously a uniform `CategoryCard` grid — the same
 * component and layout the catalogue page used. They are now
 * {@link CollectionShowcase} blocks, each with its own layout variant and
 * scroll-reveal, so the page reads as a sequence of spreads rather than a
 * database listing.
 */
export const LandingHero: React.FC<LandingHeroProps> = ({ onSelectCategory }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        settleInstantly(['.hero-eyebrow', '.hero-line', '.hero-subtitle']);
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE.enter } });

      tl.fromTo('.hero-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: DURATION.fast })
        // Per-line stagger rather than one block fade: the headline assembles
        // itself, which is the single most "premium" beat on the page.
        .fromTo(
          '.hero-line',
          { y: 46, opacity: 0 },
          { y: 0, opacity: 1, duration: DURATION.slow, stagger: 0.12 },
          '-=0.1'
        )
        .fromTo(
          '.hero-subtitle',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: DURATION.base },
          '-=0.5'
        );
    },
    { scope: heroRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div ref={heroRef} className={cn(DESIGN_TOKENS.layout.sectionGap, 'pb-24 pt-6')}>
      {/* Opening statement. Type-led, no photography — the first impression is
          the brand's voice, and the carousel below carries the imagery. */}
      <section className="max-w-5xl space-y-8">
        <span className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
          <Flame className="h-3.5 w-3.5 text-amber-500" /> Handcrafted Artisanal Luxury
        </span>

        <h1 className={cn(DESIGN_TOKENS.typography.heroTitle, 'text-stone-900 dark:text-stone-100')}>
          {/* Each line is its own element with `overflow-hidden`, so the stagger
              reads as type rising out of the page rather than fading in place. */}
          <span className="hero-line block overflow-hidden">Crafted to</span>
          <span className="hero-line block overflow-hidden font-light italic text-amber-500">
            illuminate
          </span>
          <span className="hero-line block overflow-hidden">your world.</span>
        </h1>

        <p
          className={cn(
            'hero-subtitle max-w-2xl text-base font-light leading-relaxed text-stone-600 dark:text-stone-400 sm:text-xl'
          )}
        >
          From custom fragrance blends and frosted glass jars to playful food-mimicking sculptures
          and festive urlis — artisanal soy wax, poured by hand for quiet luxury.
        </p>
      </section>

      <section aria-label="Featured promotions">
        <PromotionalCarousel />
      </section>

      {/* Six collections, six distinct editorial spreads. */}
      <section aria-labelledby="collections-heading" className="space-y-16 sm:space-y-24 lg:space-y-32">
        <div className="max-w-2xl space-y-4">
          <span className={DESIGN_TOKENS.typography.eyebrow}>Six collections</span>
          <h2 id="collections-heading" className={DESIGN_TOKENS.typography.sectionTitle}>
            <span className="text-stone-900 dark:text-stone-100">Every flame begins as</span>{' '}
            <span className="font-semibold text-amber-500">an intention</span>
          </h2>
        </div>

        {CANDLE_CATEGORIES.map((category, idx) => (
          <CollectionShowcase
            key={category.id}
            category={category}
            index={idx + 1}
            variant={SHOWCASE_VARIANTS[idx % SHOWCASE_VARIANTS.length]}
            flipped={idx % 2 === 1}
            onSelect={onSelectCategory}
            eager={idx === 0}
          />
        ))}
      </section>

      <CampaignShowcase />
    </div>
  );
};
