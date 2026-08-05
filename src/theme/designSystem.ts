/**
 * Master Design System Tokens for Lumora Flames
 * Establishes consistent luxury typography, spacing, and glassmorphism.
 */
export const DESIGN_TOKENS = {
  layout: {
    maxWidth: 'max-w-[1600px]',
    paddingX: 'px-6 sm:px-10 lg:px-16',
    headerOffset: 'pt-28 sm:pt-32',
  },
  typography: {
    heroTitle: 'text-5xl sm:text-7xl lg:text-8xl font-extralight tracking-tight leading-[1.05]',
    sectionTitle: 'text-3xl sm:text-5xl font-light tracking-tight',
    body: 'text-sm sm:text-base font-light leading-relaxed',
    eyebrow: 'text-xs font-semibold tracking-[0.2em] uppercase text-amber-500',
  },
  glass: {
    card: 'bg-white/70 dark:bg-stone-900/40 backdrop-blur-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xl',
    floatingBtn: 'bg-white/20 dark:bg-stone-950/30 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]',
  },
} as const;