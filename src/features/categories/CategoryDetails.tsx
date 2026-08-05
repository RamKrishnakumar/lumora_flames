import React, { useRef } from 'react';
import type { Category } from '../../types/category';
import { ArrowLeft, CheckCircle, Sparkles, Send } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Props for CategoryDetail component.
 */
interface CategoryDetailProps {
  /** The selected category object to display. */
  category: Category;
  /** Function to navigate back to all collections. */
  onBack: () => void;
  /** Function to open custom order inquiry for this category. */
  onOrderCustom: (categoryTitle: string) => void;
}

/**
 * CategoryDetail displays detailed information, subcategories, 
 * example specifications, and GSAP animations for a single collection.
 */
export const CategoryDetail: React.FC<CategoryDetailProps> = ({
  category,
  onBack,
  onOrderCustom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Staggered entrance animation for subcategory cards
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      '.detail-hero',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 }
    )
    .fromTo(
      '.subcategory-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
      '-=0.3'
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="space-y-12 pt-4 pb-20">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Collections
      </button>

      {/* Hero Banner with Background Image */}
      <div className="detail-hero relative rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[420px] flex items-end p-8 sm:p-12 border border-stone-200 dark:border-stone-800 shadow-xl">
        <img
          src={category.heroImage}
          alt={category.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> {category.tagline}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            {category.title}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Subcategories Breakdown Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
          Available Varieties ({category.subCategories.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.subCategories.map((sub) => (
            <div
              key={sub.id}
              className="subcategory-card bg-stone-100/80 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4 backdrop-blur-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {sub.name}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-light">
                  {sub.description}
                </p>

                {/* Example Pills */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                    Examples / Variations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sub.examples.map((ex, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-stone-950 text-stone-800 dark:text-stone-200 border border-stone-300/60 dark:border-stone-800"
                      >
                        <CheckCircle className="w-3 h-3 text-amber-500" />
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOrderCustom(category.title)}
                className="w-full mt-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium text-xs hover:bg-amber-500 dark:hover:bg-amber-400 hover:text-stone-950 dark:hover:text-stone-950 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Order Custom {sub.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};