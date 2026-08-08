import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSET_IMAGES } from '../../data/assets';
import { PromotionalCarouselTemplate1 } from './PromoCarouselTemplate1';
import type { PromoSlide } from './PromoCarouselTemplate1';

/**
 * The live promotional placements, in display order.
 *
 * Each `targetCollectionId` must match an id in `CANDLE_CATEGORIES` — the CTA
 * routes to `/category/:id`, so a typo lands the visitor on a redirect instead of
 * the collection. Images come from `ASSET_IMAGES` rather than string paths, which
 * would 404 in a production build.
 */
const PROMO_SLIDES_DATA: PromoSlide[] = [
  {
    id: 'diwali-launch',
    tagline: 'Exclusive Festive Release',
    title: 'Illuminating Sacred',
    highlightText: 'Celebrations',
    description:
      'Handcrafted brass urlis and botanical-infused floral diyas created for memorable evenings.',
    bgImage: ASSET_IMAGES.promotional_one.first,
    ctaText: 'Explore Festive Urli Collection',
    targetCollectionId: 'festive-urlis',
  },
  {
    id: 'sculptural-mimic',
    tagline: 'Artisanal Sculpture Series',
    title: 'Gourmet Desserts &',
    highlightText: 'Smoothie Wax Art',
    description:
      'Playful yet sophisticated designs mimicking fine delicacies and refreshing smoothies.',
    bgImage: ASSET_IMAGES.promotional_one.second,
    ctaText: 'Discover Sculptural Art',
    targetCollectionId: 'sculptural-food',
  },
  {
    id: 'bespoke-fragrance',
    tagline: 'Personalized Concierge',
    title: 'Bespoke Blends &',
    highlightText: 'Custom Labels',
    description: 'Custom scents poured into frosted jars with photo-embedded wax keepsakes.',
    bgImage: ASSET_IMAGES.promotional_one.third,
    ctaText: 'Design Custom Blend',
    targetCollectionId: 'bespoke-personalized',
  },
];

/** Props for {@link PromotionalCarousel}. */
interface PromotionalCarouselProps {
  /**
   * Overrides the default `navigate('/category/:id')` behaviour. Useful when a
   * host page wants to intercept the transition (for example to run an exit
   * animation first).
   */
  onNavigateCollection?: (collectionId: string) => void;
}

/**
 * PromotionalCarousel owns the campaign slide data and the CTA's navigation, so
 * host pages can drop it in with no props.
 *
 * The presentation lives in {@link PromotionalCarouselTemplate1}. When a second
 * layout is needed, add a `templateStyle` prop here and branch on it — see
 * `docs/promoCarousal.md` for the template concepts. Keeping the data in this
 * wrapper means a new template only has to implement the visuals.
 */
export const PromotionalCarousel: React.FC<PromotionalCarouselProps> = ({
  onNavigateCollection,
}) => {
  const navigate = useNavigate();

  const handleNavigation = (collectionId: string) => {
    if (onNavigateCollection) {
      onNavigateCollection(collectionId);
      return;
    }
    navigate(`/category/${collectionId}`);
  };

  return (
    <PromotionalCarouselTemplate1
      slides={PROMO_SLIDES_DATA}
      onNavigateCollection={handleNavigation}
      autoSlideInterval={7000}
    />
  );
};
