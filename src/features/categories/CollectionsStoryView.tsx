import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CANDLE_CATEGORIES } from '../../data/categories';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { DESIGN_TOKENS } from '../../theme/designSystem';

gsap.registerPlugin(ScrollTrigger);

interface CollectionsStoryViewProps {
  onOpenSubCategory: (categoryId: string) => void;
}

/**
 * Unique GSAP animation style presets for each collection section.
 */
const ANIMATION_PRESET = [
  { name: 'Image Reveal Clip', type: 'clip' },
  { name: 'Split Text Parallax', type: 'parallax' },
  { name: '3D Layer Scale Depth', type: 'scale' },
  { name: 'Horizontal Slide Mask', type: 'slide' },
  { name: 'Zoom Depth Focus', type: 'zoom' },
  { name: 'Pinned Rotation Tilt', type: 'tilt' },
];

export const CollectionsStoryView: React.FC<CollectionsStoryViewProps> = ({ onOpenSubCategory }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.collection-viewport-section');

    sections.forEach((sec, idx) => {
      const bg = sec.querySelector('.sec-bg');
      const title = sec.querySelector('.sec-title');
      const tagline = sec.querySelector('.sec-tagline');
      
      // Determine animation preset for current section
      const preset = ANIMATION_PRESET[idx % ANIMATION_PRESET.length];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          pin: true,
          pinSpacing: true,
        },
      });

      // Background Parallax Zoom Across All Presets
      tl.to(bg, { scale: 1.2, yPercent: 8, ease: 'none' }, 0);

      // Apply specific motion behavior based on ANIMATION_PRESET
      switch (preset.type) {
        case 'clip':
          tl.fromTo(title, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 0 }, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', opacity: 1, ease: 'power3.out' }, 0);
          break;
        case 'parallax':
          tl.fromTo(title, { y: 120, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out' }, 0);
          break;
        case 'scale':
          tl.fromTo(title, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, ease: 'back.out(1.7)' }, 0);
          break;
        case 'slide':
          tl.fromTo(title, { x: -100, opacity: 0 }, { x: 0, opacity: 1, ease: 'power3.out' }, 0);
          break;
        case 'zoom':
          tl.fromTo(sec, { filter: 'blur(10px)' }, { filter: 'blur(0px)', duration: 0.5 }, 0);
          tl.fromTo(title, { z: -200, opacity: 0 }, { z: 0, opacity: 1 }, 0);
          break;
        case 'tilt':
          tl.fromTo(title, { rotateX: 45, opacity: 0 }, { rotateX: 0, opacity: 1 }, 0);
          break;
      }

      tl.fromTo(tagline, { y: 25, opacity: 0 }, { y: 0, opacity: 1 }, 0.2);
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full">
      {CANDLE_CATEGORIES.map((cat, idx) => (
        <section
          key={cat.id}
          className="collection-viewport-section relative w-full h-screen overflow-hidden flex items-center justify-between px-8 sm:px-16"
        >
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={cat.heroImage}
              alt={cat.title}
              className="sec-bg w-full h-full object-cover filter brightness-[0.7] dark:brightness-[0.45] transition-all"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/40 to-transparent" />
          </div>

          {/* Left Text Narrative Block */}
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="sec-tagline inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Collection 0{idx + 1} • {cat.tagline}
            </span>

            <h2 className="sec-title text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight">
              {cat.title}
            </h2>

            <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed max-w-lg">
              {cat.description}
            </p>
          </div>

          {/* Floating Luxury Glassmorphism Button */}
          <div className="relative z-10 self-end mb-16 sm:mb-20">
            <button
              onClick={() => onOpenSubCategory(cat.id)}
              className={`${DESIGN_TOKENS.glass.floatingBtn} px-8 py-5 rounded-full text-white font-medium text-xs sm:text-sm uppercase tracking-widest hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 flex items-center gap-3 group border border-white/40 shadow-2xl`}
            >
              <span>Explore Sub Categories</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </section>
      ))}
    </div>
  );
};