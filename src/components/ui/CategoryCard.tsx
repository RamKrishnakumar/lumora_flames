import React, { useRef } from 'react';
import type { Category } from '../../types/category';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Props for the CategoryCard component.
 */
interface CategoryCardProps {
  /** The category domain model containing title, hero image, and subcategories. */
  category: Category;
  /** Callback function triggered when a user clicks to inspect a category. */
  onSelectCategory: (categoryId: string) => void;
}

/**
 * CategoryCard renders an individual luxury category card with subtle GSAP hover animations
 * and displays the count of available subcategories.
 */
export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelectCategory }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // GSAP Smooth Hover Zoom Effect
  useGSAP(() => {
    const card = cardRef.current;
    const img = imageRef.current;

    if (!card || !img) return;

    const handleMouseEnter = () => {
      gsap.to(img, { scale: 1.08, duration: 0.6, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(img, { scale: 1.0, duration: 0.6, ease: 'power2.out' });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-3xl bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80 shadow-md transition-all duration-500 flex flex-col justify-between h-[480px] sm:h-[520px] p-8 sm:p-10 cursor-pointer"
      onClick={() => onSelectCategory(category.id)}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={imageRef}
          src={category.heroImage}
          alt={category.title}
          className="w-full h-full object-cover opacity-85 dark:opacity-45 transition-opacity duration-500 group-hover:opacity-95 dark:group-hover:opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
      </div>

      {/* Top Meta Badges */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/80 dark:bg-stone-900/80 backdrop-blur-md text-stone-900 dark:text-stone-100 border border-stone-300/50 dark:border-stone-700/50 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Collection
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-900/70 dark:bg-stone-950/70 backdrop-blur-md text-stone-200 border border-stone-700/50">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          {category.subCategories.length} Varieties
        </span>
      </div>

      {/* Bottom Content & Call to Action */}
      <div className="relative z-10 space-y-3">
        <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
          {category.tagline}
        </p>
        
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          {category.title}
        </h3>

        <p className="text-sm text-stone-300 line-clamp-2 font-light leading-relaxed">
          {category.description}
        </p>

        {/* Subcategories Preview Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {category.subCategories.map((sub) => (
            <span
              key={sub.id}
              className="text-[10px] font-medium px-2.5 py-0.5 rounded-md bg-white/10 dark:bg-stone-800/60 backdrop-blur-sm text-stone-200 border border-white/10"
            >
              {sub.name}
            </span>
          ))}
        </div>

        <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </div>
    </div>
  );
};