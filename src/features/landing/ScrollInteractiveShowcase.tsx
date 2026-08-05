import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Category } from '../../types/category'; // Ensure your Category type is imported
import { InteractiveCandleCanvas } from '../../components/canvas/InteractiveCandleCanvas';
import { Flame, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollInteractiveShowcaseProps {
  /** The currently selected category object passed from App.tsx */
  selectedCategory?: Category;
  /** Navigation callback when a category/subcategory action is clicked */
  onSelectCategory: (categoryId: string) => void;
}

/**
 * ScrollInteractiveShowcase locks viewport on scroll to rotate 3D candles,
 * dynamically shift background light themes, and showcase subcategories.
 */
export const ScrollInteractiveShowcase: React.FC<ScrollInteractiveShowcaseProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [flameLit, setFlameLit] = useState(false);

  // Fallback to first collection if selectedCategory is undefined
  const category = selectedCategory;
  const subCategories = category?.subCategories || [];

  useGSAP(() => {
    if (!subCategories.length) return;

    const totalSubs = subCategories.length;

    // Pinning and Scroll-Driven Progress Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: 'top top',
        end: `+=${totalSubs * 100}%`,
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          // Trigger flame ignition past initial scroll threshold
          if (self.progress > 0.05 && !flameLit) {
            setFlameLit(true);
          } else if (self.progress <= 0.05 && flameLit) {
            setFlameLit(false);
          }

          // Calculate active subcategory index based on scroll position
          const rawIndex = Math.floor(self.progress * totalSubs);
          const clampedIndex = Math.min(rawIndex, totalSubs - 1);
          setActiveSubIndex(clampedIndex);
        },
      },
    });

    // Theme shifting animation: Smoothly transition to dark background
    tl.to(sectionRef.current, {
      backgroundColor: '#0c0a09', // Dark stone 950 color
      duration: 0.5,
    });

  }, { scope: triggerRef, dependencies: [selectedCategory] });

  if (!category || subCategories.length === 0) {
    return null;
  }

  const currentSub = subCategories[activeSubIndex] || subCategories[0];

  return (
    <div ref={triggerRef} className="relative w-full min-h-screen overflow-hidden">
      <div
        ref={sectionRef}
        className="w-full min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-8 transition-colors duration-700 bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100"
      >
        {/* Header Indicator */}
        <div className="text-center space-y-2 mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Flame className={`w-4 h-4 ${flameLit ? 'text-amber-500 animate-pulse' : 'text-stone-400'}`} />
            {flameLit ? 'Interactive Experience • Flame Lit' : 'Scroll Down to Ignite'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight">
            {category.title}
          </h2>
        </div>

        {/* Center Canvas & Dynamic Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl w-full">
          {/* Left Column: Interactive 3D Candle Canvas */}
          <div className="flex justify-center items-center relative">
            <InteractiveCandleCanvas flameIntensity={flameLit ? 1 : 0} />
          </div>

          {/* Right Column: Dynamic Subcategory Card Shift */}
          <div className="space-y-6 bg-stone-100/80 dark:bg-stone-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Variety {activeSubIndex + 1} of {subCategories.length}
              </span>
              <div className="flex gap-1.5">
                {subCategories.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeSubIndex ? 'w-6 bg-amber-500' : 'w-2 bg-stone-300 dark:bg-stone-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100">
                {currentSub.name}
              </h3>
              <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed font-light">
                {currentSub.description}
              </p>
            </div>

            {/* Subcategory Example Formats */}
            {currentSub.examples && currentSub.examples.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Popular Formats:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentSub.examples.map((ex, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-800 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => onSelectCategory(category.id)}
              className="w-full mt-4 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Explore All {category.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};