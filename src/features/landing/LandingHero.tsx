import React, { useRef } from 'react';
import { CANDLE_CATEGORIES } from '../../data/categories';
import { CollectionShowcase, type ShowcaseVariant } from '../../components/ui/CollectionShowcase';
import { HeroChamber } from './HeroChamber';
import { PromotionalCarousel } from './PromotionalCarousel';
import { CollectionIndexRail } from './CollectionIndexRail';
import { CampaignShowcase } from './CampaignShowcase';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../theme/designSystem';

/**
 * Collections given a full editorial spread on the home page.
 *
 * Only three, deliberately. The home page previously rendered all six — the same
 * six, in the same order, that `/collections` already tells as pinned full-screen
 * moments. Home now *teases* and `/collections` delivers, which also keeps three
 * multi-megabyte photographs off the landing chunk.
 *
 * These ids must exist in `CANDLE_CATEGORIES`; unknown ids are skipped rather
 * than rendering an empty spread.
 */
const FEATURED_COLLECTION_IDS = [
  'traditional-festive',
  'sculptural-decorative',
  'bespoke-personalized',
] as const;

/**
 * Layout treatment per featured spread. Three different variants for three
 * blocks, so no two consecutive spreads resolve the same way.
 */
const FEATURED_VARIANTS: ShowcaseVariant[] = ['fullBleed', 'offsetFrame', 'splitReveal'];

/** Props for {@link LandingHero}. */
export interface LandingHeroProps {
  /** Handler invoked with a collection id when a showcase or row is activated. */
  onSelectCategory: (categoryId: string) => void;
  /** Navigates to the full collections story at `/collections`. */
  onOpenCollectionsStory: () => void;
}

/**
 * Applies the site's max width and gutters to one section.
 *
 * The home page is full-bleed at the page level — the hero, the typographic band,
 * and the gifting ribbon all run edge-to-edge — so containment is opted into per
 * section rather than imposed by a page wrapper.
 */
const Contained: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn(DESIGN_TOKENS.layout.contained, className)}>{children}</div>;

/**
 * LandingHero composes the home page as seven distinct screens:
 *
 * 1. {@link HeroChamber} — centred display type in a candle-lit chamber.
 * 2. Offers carousel — full-bleed photography, autoplaying.
 * 3. Three featured {@link CollectionShowcase} spreads.
 * 4. Reasons band — oversized type, scroll-driven, no imagery.
 * 5. Gifting ribbon — drifting occasion cards.
 * 6. {@link CollectionIndexRail} — all six collections as a type-led contents page.
 * 7. {@link CampaignShowcase} — the campaign and collaboration wall.
 *
 * The rhythm alternates image-led and type-led screens so no two consecutive
 * sections resolve alike, and screens 1, 4 and 7 ship no photography at all —
 * which is what lets the page grow from four sections to seven without getting
 * heavier.
 *
 * This component is composition only. Every screen owns its own motion and its
 * own reduced-motion branch.
 */
export const LandingHero: React.FC<LandingHeroProps> = ({
  onSelectCategory,
  onOpenCollectionsStory,
}) => {
  const offersRef = useRef<HTMLDivElement>(null);

  const featured = FEATURED_COLLECTION_IDS.map((id) =>
    CANDLE_CATEGORIES.find((category) => category.id === id)
  ).filter((category): category is NonNullable<typeof category> => Boolean(category));

  /** Scroll cue target: the offers carousel, i.e. the next screen down. */
  const scrollToOffers = () => {
    offersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="pb-24">
      {/* 1 — Hero */}
      <HeroChamber onScrollCue={scrollToOffers} />

      <div className={DESIGN_TOKENS.layout.sectionGap}>
        {/* 2 — Offers. Contained so the rounded frame reads as a frame. */}
        <div ref={offersRef} className="scroll-mt-24">
          <Contained>
            <PromotionalCarousel placement="offers" />
          </Contained>
        </div>

        {/* 3 — Featured collections */}
        <Contained>
          <section
            aria-labelledby="featured-heading"
            className="space-y-16 sm:space-y-24 lg:space-y-32"
          >
            <div className="max-w-2xl space-y-4">
              <span className={DESIGN_TOKENS.typography.eyebrow}>Currently featured</span>
              <h2 id="featured-heading" className={DESIGN_TOKENS.typography.sectionTitle}>
                <span className="text-stone-900 dark:text-stone-100">Three pours worth</span>{' '}
                <span className="font-semibold text-amber-500">lingering over</span>
              </h2>
            </div>

            {featured.map((category, idx) => (
              <CollectionShowcase
                key={category.id}
                category={category}
                index={idx + 1}
                variant={FEATURED_VARIANTS[idx % FEATURED_VARIANTS.length]}
                flipped={idx % 2 === 1}
                onSelect={onSelectCategory}
                eager={idx === 0}
              />
            ))}
          </section>
        </Contained>

        {/* 4 — Reasons band. Full-bleed and self-pinning; owns its own gutters. */}
        <PromotionalCarousel placement="reasons" />

        {/* 5 — Gifting ribbon. Full-bleed so cards can drift off both edges. */}
        <PromotionalCarousel placement="gifting" />

        {/* 6 — All six collections */}
        <CollectionIndexRail
          onSelectCategory={onSelectCategory}
          onOpenStory={onOpenCollectionsStory}
        />

        {/* 7 — Campaigns */}
        <Contained>
          <CampaignShowcase />
        </Contained>
      </div>
    </div>
  );
};
