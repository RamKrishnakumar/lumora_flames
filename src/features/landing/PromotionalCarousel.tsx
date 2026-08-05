import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSET_IMAGES } from '../../data/assets';
import { 
  PromotionalCarouselTemplate1,  
} from '../landing/promoCarousalTemplate1';
import type { PromoSlide } from '../landing/promoCarousalTemplate1';

/**
 * Master Promotional Slide Data Array
 */
const PROMO_SLIDES_DATA: PromoSlide[] = [
  {
    id: 'diwali-launch',
    tagline: 'Exclusive Festive Release',
    title: 'Illuminating Sacred',
    highlightText: 'Celebrations',
    description: 'Handcrafted brass urlis and botanical-infused floral diyas created for memorable evenings.',
    bgImage: ASSET_IMAGES.promotional_one.first,
    ctaText: 'Explore Festive Urli Collection',
    targetCollectionId: 'festive-urlis',
  },
  {
    id: 'sculptural-mimic',
    tagline: 'Artisanal Sculpture Series',
    title: 'Gourmet Desserts &',
    highlightText: 'Smoothie Wax Art',
    description: 'Playful yet sophisticated designs mimicking fine delicacies and refreshing smoothies.',
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

interface PromotionalCarouselProps {
  /** Optional custom navigation override if needed; defaults to navigate('/category/:id') */
  onNavigateCollection?: (collectionId: string) => void;
  /** Template style selector - allows switching between Template 1, Template 2, etc. */
  templateStyle?: 'template1' | 'template2';
}

/**
 * PromotionalCarousel encapsulates slide data AND navigation handling internally.
 */
export const PromotionalCarousel: React.FC<PromotionalCarouselProps> = ({ 
  onNavigateCollection,
  templateStyle = 'template1'
}) => {
  const navigate = useNavigate();

  // Handle navigation internally unless an external handler is explicitly passed
  const handleNavigation = (collectionId: string) => {
    if (onNavigateCollection) {
      onNavigateCollection(collectionId);
    } else {
      navigate(`/category/${collectionId}`);
    }
  };

  switch (templateStyle) {
    case 'template1':
    default:
      return (
        <PromotionalCarouselTemplate1
          slides={PROMO_SLIDES_DATA}
          onNavigateCollection={handleNavigation}
          autoSlideInterval={7000}
        />
      );
  }
};

/* Future template expansion example:
    case 'template2':
      return (
        <PromotionalCarouselTemplate2
          slides={PROMO_SLIDES_DATA}
          onNavigateCollection={onNavigateCollection}
        />
      );
    */