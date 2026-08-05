// import React, { useRef, useState, useEffect } from 'react';
// import { ArrowRight, Flame } from 'lucide-react';
// import gsap from 'gsap';
// import { useGSAP } from '@gsap/react';
// import { DESIGN_TOKENS } from '../../theme/designSystem';
// import { ASSET_IMAGES } from '../../data/assets';

// interface PromoSlide {
//   id: string;
//   tagline: string;
//   title: string;
//   highlightText: string;
//   description: string;
//   bgImage: string;
//   ctaText: string;
//   targetCollectionId: string;
// }

// const PROMO_SLIDES: PromoSlide[] = [
//   {
//     id: 'diwali-launch',
//     tagline: 'Exclusive Festive Release',
//     title: 'Illuminating Sacred',
//     highlightText: 'Celebrations',
//     description: 'Handcrafted brass urlis and botanical-infused floral diyas created for memorable evenings.',
//     bgImage: ASSET_IMAGES.promotional_one.first,
//     ctaText: 'Explore Festive Urli Collection',
//     targetCollectionId: 'festive-urlis',
//   },
//   {
//     id: 'sculptural-mimic',
//     tagline: 'Artisanal Sculpture Series',
//     title: 'Gourmet Desserts &',
//     highlightText: 'Smoothie Wax Art',
//     description: 'Playful yet sophisticated designs mimicking fine delicacies and refreshing smoothies.',
//     bgImage: ASSET_IMAGES.promotional_one.second,
//     ctaText: 'Discover Sculptural Art',
//     targetCollectionId: 'sculptural-food',
//   },
//   {
//     id: 'bespoke-fragrance',
//     tagline: 'Personalized Concierge',
//     title: 'Bespoke Blends &',
//     highlightText: 'Custom Labels',
//     description: 'Custom scents poured into frosted jars with photo-embedded wax keepsakes.',
//     bgImage: ASSET_IMAGES.promotional_one.third,
//     ctaText: 'Design Custom Blend',
//     targetCollectionId: 'bespoke-personalized',
//   },
// ];

// interface PromotionalCarouselProps {
//   onNavigateCollection: (collectionId: string) => void;
// }

// export const PromotionalCarousel: React.FC<PromotionalCarouselProps> = ({ onNavigateCollection }) => {
//   const [activeIdx, setActiveIdx] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const slide = PROMO_SLIDES[activeIdx];

//   useGSAP(() => {
//     const tl = gsap.timeline();

//     tl.fromTo(
//       '.carousel-bg',
//       { scale: 1.15, filter: 'blur(10px)' },
//       { scale: 1.0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }
//     )
//       .fromTo(
//         '.carousel-eyebrow',
//         { y: 20, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.6 },
//         '-=0.8'
//       )
//       .fromTo(
//         '.carousel-title',
//         { y: 40, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
//         '-=0.5'
//       )
//       .fromTo(
//         '.carousel-desc',
//         { y: 20, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.6 },
//         '-=0.4'
//       );
//   }, { scope: containerRef, dependencies: [activeIdx] });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveIdx((prev) => (prev + 1) % PROMO_SLIDES.length);
//     }, 7000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className={`relative w-full h-[75vh] sm:h-[85vh] rounded-[2.5rem] overflow-hidden border border-stone-200/50 dark:border-stone-800/50 shadow-2xl flex items-end ${DESIGN_TOKENS.layout.paddingX} py-12 sm:py-16`}
//     >
//       <img
//         key={slide.id}
//         src={slide.bgImage}
//         alt={slide.title}
//         className="carousel-bg absolute inset-0 w-full h-full object-cover"
//       />
      
//       <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

//       <div className="relative z-10 max-w-3xl space-y-6">
//         <span className="carousel-eyebrow inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
//           <Flame className="w-3.5 h-3.5 text-amber-400" /> {slide.tagline}
//         </span>

//         <h1 className="carousel-title text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-tight">
//           {slide.title} <span className="font-semibold text-amber-400 italic">{slide.highlightText}</span>
//         </h1>

//         <p className="carousel-desc text-stone-300 text-base sm:text-lg font-light leading-relaxed max-w-xl">
//           {slide.description}
//         </p>

//         <div className="pt-2 flex flex-wrap items-center gap-4">
//           <button
//             onClick={() => onNavigateCollection(slide.targetCollectionId)}
//             className="px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-3 shadow-lg active:scale-95"
//           >
//             <span>{slide.ctaText}</span>
//             <ArrowRight className="w-4 h-4" />
//           </button>

//           <div className="flex items-center gap-2 ml-4">
//             {PROMO_SLIDES.map((s, idx) => (
//               <button
//                 key={s.id}
//                 onClick={() => setActiveIdx(idx)}
//                 aria-label={`Go to slide ${idx + 1}`}
//                 className={`h-2 rounded-full transition-all duration-500 ${
//                   idx === activeIdx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { DESIGN_TOKENS } from '../../theme/designSystem';

export interface PromoSlide {
  id: string;
  tagline: string;
  title: string;
  highlightText: string;
  description: string;
  bgImage: string;
  ctaText: string;
  targetCollectionId: string;
}

export interface PromotionalCarouselTemplate1Props {
  /** Array of promotional slides to render dynamically */
  slides: PromoSlide[];
  /** Callback fired when slide CTA is clicked */
  onNavigateCollection: (collectionId: string) => void;
  /** Auto-slide interval in milliseconds (default: 7000ms) */
  autoSlideInterval?: number;
}

export const PromotionalCarouselTemplate1: React.FC<PromotionalCarouselTemplate1Props> = ({
  slides,
  onNavigateCollection,
  autoSlideInterval = 7000,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const slide = slides[activeIdx] || slides[0];

  useGSAP(() => {
    if (!slide) return;

    const tl = gsap.timeline();

    tl.fromTo(
      '.carousel-bg',
      { scale: 1.15, filter: 'blur(10px)' },
      { scale: 1.0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }
    )
      .fromTo(
        '.carousel-eyebrow',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.8'
      )
      .fromTo(
        '.carousel-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(
        '.carousel-desc',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4'
      );
  }, { scope: containerRef, dependencies: [activeIdx, slides] });

  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [slides, autoSlideInterval]);

  if (!slide) return null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[75vh] sm:h-[85vh] rounded-[2.5rem] overflow-hidden border border-stone-200/50 dark:border-stone-800/50 shadow-2xl flex items-end ${DESIGN_TOKENS.layout.paddingX} py-12 sm:py-16`}
    >
      <img
        key={slide.id}
        src={slide.bgImage}
        alt={slide.title}
        className="carousel-bg absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

      <div className="relative z-10 max-w-3xl space-y-6">
        <span className="carousel-eyebrow inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
          <Flame className="w-3.5 h-3.5 text-amber-400" /> {slide.tagline}
        </span>

        <h1 className="carousel-title text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-tight">
          {slide.title} <span className="font-semibold text-amber-400 italic">{slide.highlightText}</span>
        </h1>

        <p className="carousel-desc text-stone-300 text-base sm:text-lg font-light leading-relaxed max-w-xl">
          {slide.description}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onNavigateCollection(slide.targetCollectionId)}
            className="px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-3 shadow-lg active:scale-95"
          >
            <span>{slide.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 ml-4">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${
                  idx === activeIdx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};