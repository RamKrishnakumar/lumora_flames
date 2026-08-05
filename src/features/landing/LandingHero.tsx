// import React, { useRef } from 'react';
// import { CANDLE_CATEGORIES } from '../../data/categories';
// import { CategoryCard } from '../../components/ui/CategoryCard';
// import { Flame, Sparkles } from 'lucide-react';
// import gsap from 'gsap';
// import { useGSAP } from '@gsap/react';

// /**
//  * Props for LandingHero component.
//  */
// interface LandingHeroProps {
//   /** Handler invoked when a user clicks an individual category card. */
//   onSelectCategory: (categoryId: string) => void;
// }

// /**
//  * LandingHero displays the hero introduction banner and orchestrates 
//  * the staggered entrance animations for all candle collections.
//  */
// export const LandingHero: React.FC<LandingHeroProps> = ({ onSelectCategory }) => {
//   const heroRef = useRef<HTMLDivElement>(null);

//   // Staggered scroll-in entrance animation
//   useGSAP(() => {
//     const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

//     tl.fromTo(
//       '.hero-title',
//       { y: 30, opacity: 0 },
//       { y: 0, opacity: 1, duration: 0.8 }
//     )
//     .fromTo(
//       '.hero-subtitle',
//       { y: 20, opacity: 0 },
//       { y: 0, opacity: 1, duration: 0.6 },
//       '-=0.4'
//     )
//     .fromTo(
//       '.category-card-item',
//       { y: 40, opacity: 0 },
//       { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 },
//       '-=0.2'
//     );
//   }, { scope: heroRef });

//   return (
//     <div ref={heroRef} className="space-y-20 pt-8 pb-16">
//       {/* Hero Headline Banner */}
//       <section className="text-center space-y-6 max-w-3xl mx-auto">
//         <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
//           <Flame className="w-3.5 h-3.5 text-amber-500" /> Handcrafted Artisanal Luxury
//         </span>

//         <h1 className="text-4xl sm:text-6xl font-extralight tracking-tight leading-tight">
//           <span className="text-stone-900 dark:text-stone-100">Crafted to</span> <span className="font-semibold text-amber-500">Illuminate</span> <span className="text-stone-900 dark:text-stone-100">Your World</span>.
//         </h1>

//         <p className="hero-subtitle text-stone-600 dark:text-stone-400 text-base sm:text-lg font-light leading-relaxed">
//           From custom fragrance blends and frosted glass jars to playful food-mimicking sculptures and festive urlis—discover artisanal soy wax crafted for quiet luxury.
//         </p>
//       </section>

//       {/* Category Grid Section */}
//       <section className="space-y-8">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
//           <div>
//             <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight  flex items-center gap-2">
//               <Sparkles className="w-5 h-5 text-amber-500" /> <span className='text-stone-900 dark:text-stone-100'>Featured Collections</span>
//             </h2>
//             <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1">
//               Select any collection to inspect specific customized candle offerings[cite: 1].
//             </p>
//           </div>
//         </div>

//         {/* Categories Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {CANDLE_CATEGORIES.map((category) => (
//             <div key={category.id} className="category-card-item">
//               <CategoryCard
//                 category={category}
//                 onSelectCategory={onSelectCategory}
//               />
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };


import React, { useRef } from 'react';
import { CANDLE_CATEGORIES } from '../../data/categories';
import { CategoryCard } from '../../components/ui/CategoryCard';
import { ScrollInteractiveShowcase } from './ScrollInteractiveShowcase';
import { Flame, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface LandingHeroProps {
  onSelectCategory: (categoryId: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onSelectCategory }) => {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      '.hero-title',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo(
      '.hero-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.4'
    );
  }, { scope: heroRef });

  return (
    <div ref={heroRef} className="space-y-16 pt-4 pb-16">
      {/* Hero Headline Banner */}
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Flame className="w-3.5 h-3.5 text-amber-500" /> Handcrafted Artisanal Luxury
        </span>

        <h1 className="hero-title text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight leading-tight">
          <span className="text-stone-900 dark:text-stone-100">Crafted to</span>{' '}
          <span className="font-semibold text-amber-500">Illuminate</span>{' '}
          <span className="text-stone-900 dark:text-stone-100">Your World</span>.
        </h1>

        <p className="hero-subtitle text-stone-600 dark:text-stone-400 text-base sm:text-xl font-light leading-relaxed max-w-2xl mx-auto">
          From custom fragrance blends and frosted glass jars to playful food-mimicking sculptures and festive urlis—discover artisanal soy wax crafted for quiet luxury.
        </p>
      </section>

      {/* 3D Scroll-Driven Candle Showcase */}
      <section className="-mx-4 sm:-mx-8 lg:-mx-12">
        <ScrollInteractiveShowcase onSelectCategory={onSelectCategory} />
      </section>

      {/* Standard Collections Grid */}
      <section className="space-y-8 pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />{' '}
              <span className="text-stone-900 dark:text-stone-100">Featured Collections</span>
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1">
              Select any collection to inspect specific customized candle offerings[cite: 1].
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CANDLE_CATEGORIES.map((category) => (
            <div key={category.id} className="category-card-item">
              <CategoryCard
                category={category}
                onSelectCategory={onSelectCategory}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};