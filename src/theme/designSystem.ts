/**
 * Master Design System Tokens for Lumora Flames
 * Establishes consistent luxury typography, spacing, and glassmorphism.
 */
export const DESIGN_TOKENS = {
  layout: {
    maxWidth: 'max-w-[1600px]',
    paddingX: 'px-6 sm:px-10 lg:px-16',
    headerOffset: 'pt-28 sm:pt-32',
    /**
     * Vertical rhythm between major editorial sections. Deliberately large —
     * whitespace is what separates a luxury layout from a catalogue page.
     */
    sectionGap: 'space-y-28 sm:space-y-36 lg:space-y-48',
    /**
     * Max width + gutters as one string, for sections inside a full-bleed page.
     * The home page's hero and typographic band run edge-to-edge, so the page
     * itself can't apply gutters — each contained section opts in with this.
     */
    contained: 'mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16',
  },
  typography: {
    heroTitle: 'text-5xl sm:text-7xl lg:text-8xl font-extralight tracking-tight leading-[1.05]',
    sectionTitle: 'text-3xl sm:text-5xl font-light tracking-tight',
    /**
     * Oversized statement type for a full-bleed band where the words *are* the
     * visual — larger and looser than `heroTitle`, which shares its screen with
     * an eyebrow, body copy, and a CTA.
     */
    displayBand: 'text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight leading-[1.12]',
    /** Editorial headline for a single collection or subcategory panel. */
    panelTitle: 'text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.08]',
    body: 'text-sm sm:text-base font-light leading-relaxed',
    eyebrow: 'text-xs font-semibold tracking-[0.2em] uppercase text-amber-500',
    /** Uppercase label for buttons and pills. Never sentence-case. */
    button: 'text-xs font-semibold uppercase tracking-wider',
  },
  glass: {
    card: 'bg-white/70 dark:bg-stone-900/40 backdrop-blur-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-2xl',
    floatingBtn: 'bg-white/20 dark:bg-stone-950/30 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]',
    /** Lighter frosted surface for chips and inline pills over photography. */
    chip: 'bg-white/10 dark:bg-stone-900/40 backdrop-blur-md border border-white/20 dark:border-white/10',
  },
  overlay: {
    /** Bottom-up scrim. Required under any text sitting over photography. */
    scrimBottom: 'bg-gradient-to-t from-stone-950 via-stone-950/55 to-transparent',
    /** Left-to-right scrim for side-by-side editorial layouts. */
    scrimSide: 'bg-gradient-to-r from-stone-950/90 via-stone-950/40 to-transparent',
    /**
     * Amber light pool cast from low-centre — the hero's "this room is lit"
     * layer. A gradient rather than a blurred circle, so the falloff is smooth
     * at any viewport size.
     */
    scrimRadial:
      'bg-[radial-gradient(60%_50%_at_50%_85%,rgba(245,158,11,0.28),rgba(245,158,11,0.08)_45%,transparent_72%)]',
  },
} as const;
