import React, { useState, useRef } from 'react';
import { CANDLE_CATEGORIES } from '../../data/categories';
import { CategoryCard } from '../../components/ui/CategoryCard';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Props for CollectionsView component.
 */
interface CollectionsViewProps {
  /** Handler invoked when selecting a specific collection card. */
  onSelectCategory: (categoryId: string) => void;
}

/**
 * CollectionsView provides a focused gallery layout with search filtering
 * and custom entrance micro-animations.
 */
export const CollectionsView: React.FC<CollectionsViewProps> = ({ onSelectCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter collections by search query against title or subcategories
  const filteredCategories = CANDLE_CATEGORIES.filter((category) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = category.title.toLowerCase().includes(query);
    const subMatch = category.subCategories.some(
      (sub) => sub.name.toLowerCase().includes(query) || sub.description.toLowerCase().includes(query)
    );
    return titleMatch || subMatch;
  });

  // Stagger animation on render
  useGSAP(() => {
    gsap.fromTo(
      '.collection-card-wrapper',
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
  }, { scope: containerRef, dependencies: [searchQuery] });

  return (
    <div ref={containerRef} className="space-y-10 pt-4 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 dark:border-stone-800 pb-8">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-500">
            <Sparkles className="w-3.5 h-3.5" /> Full Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-stone-900 dark:text-stone-100">
            <span className='text-stone-900 dark:text-stone-100'>Explore All</span> <span className="font-semibold text-amber-500">Collections</span>
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm font-light leading-relaxed">
            Browse our complete repertoire of bespoke blends, sculpted food-mimicking wax art, frosted jars, and traditional festive urlis.
          </p>
        </div>

        {/* Live Search & Filter Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search scents, labels, jars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
          />
          <SlidersHorizontal className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-stone-400" />
        </div>
      </div>

      {/* Grid Display */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <div key={category.id} className="collection-card-wrapper">
              <CategoryCard
                category={category}
                onSelectCategory={onSelectCategory}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-3">
          <p className="text-stone-500 text-base">No candle collections match "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-semibold uppercase tracking-wider text-amber-500 hover:underline"
          >
            Clear Search Filter
          </button>
        </div>
      )}
    </div>
  );
};