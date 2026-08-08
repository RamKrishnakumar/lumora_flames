# Promotional Carousel — Design & Creative Guide

A playbook for building new promotional carousel templates for Lumora Flames. Read this before designing a carousel variant, then pick or remix a concept rather than defaulting to "image + heading + button."

---

## 1. How the carousel is wired

The carousel uses a **data-in / template-out** split. Respect it — it's the whole reason new templates are cheap to add.

| File | Role |
| --- | --- |
| [`PromotionalCarousel.tsx`](../src/features/landing/PromotionalCarousel.tsx) | **Smart container.** Owns `PROMO_SLIDES_DATA`, owns navigation (`navigate('/category/:id')`), and switches on the `templateStyle` prop. |
| [`PromoCarouselTemplate1.tsx`](../src/features/landing/PromoCarouselTemplate1.tsx) | **Dumb presentational template.** Receives `slides`, `onNavigateCollection`, `autoSlideInterval`. Knows nothing about routing or data sourcing. |

### The slide contract

```ts
export interface PromoSlide {
  id: string;                  // stable key + GSAP re-trigger key
  tagline: string;             // small eyebrow, e.g. "Exclusive Festive Release"
  title: string;               // light-weight first half of the headline
  highlightText: string;       // amber italic emphasis half
  description: string;         // 1–2 sentence body
  bgImage: string;             // imported asset from data/assets.ts
  ctaText: string;
  targetCollectionId: string;  // must match an id in data/categories.ts
}
```

`title` + `highlightText` exist as separate fields on purpose: the visual signature is a `font-light` phrase colliding with a `font-semibold italic text-amber-400` phrase. Keep that two-tone split in every template.

### Adding a template — the only correct way

1. Create `src/features/landing/PromoCarouselTemplate2.tsx`, exporting a component with the **same props interface** as Template1.
2. Add a `case 'template2':` to the switch in `PromotionalCarousel.tsx`.
3. Widen the `templateStyle` union type.

Never fork `PromotionalCarousel` and never hardcode slide data inside a template. A template that can't render an arbitrary `slides` array is a bug.

---

## 2. The brand's visual grammar

Non-negotiables — these make a new template feel like Lumora rather than a generic hero:

- **Palette.** `stone-50`/`stone-950` base, **amber-500/400 as the only accent.** No purple, teal, or multi-hue gradients. Amber is firelight; everything else is wax and shadow.
- **Type.** Display copy is `font-extralight`/`font-light` with `tracking-tight`. Eyebrows are `text-xs font-semibold uppercase tracking-widest`. The contrast between airy headlines and tight caps labels *is* the typographic identity.
- **Shape.** Generous radii — `rounded-[2.5rem]` for the carousel shell, `rounded-full` for pills and CTAs.
- **Surface.** Glassmorphism via `DESIGN_TOKENS.glass.card` / `.floatingBtn`. Always pair a scrim (`bg-gradient-to-t from-stone-950`) under text over photography — the product photos are bright and will eat white text.
- **Motion.** GSAP only, inside `useGSAP(() => {...}, { scope: ref, dependencies: [activeIdx] })`. Signature easing is `power3.out` for entrances and `sine.inOut` for anything ambient/looping.
- **Light is the metaphor.** The strongest ideas below animate *illumination* — glow, flicker, bloom, warmth spreading — not just position. When choosing between "slide it" and "light it," light it.

---

## 3. Concept library

Nine directions, roughly ordered from safest to most ambitious. Each is a starting point to remix, not a spec to copy literally.

### A. Ken Burns Ember *(current Template1, refined)*
Full-bleed photo with a slow 8s `scale: 1.0 → 1.08` drift while copy staggers up from below. Add a barely-perceptible warm vignette that pulses on a 4s `sine.inOut` yoyo, as if a candle were just off-frame.
**Best for:** a dependable default that never fights the product photo.

### B. Split Diptych
Viewport halves: image left, copy on a solid stone panel right. On transition, the image half wipes vertically while the text half wipes horizontally — two axes crossing reads as deliberate editorial design.
**Best for:** long descriptions and specs; the most readable option.

### C. Wax-Melt Reveal
Transition via an animated `clipPath` that flows downward with an irregular, organic lower edge, like warm wax spreading. GSAP can tween `clipPath` polygon points directly.
**Best for:** a signature moment nobody will mistake for a stock slider. Highest craft-to-effort ratio here.

### D. Flame-Lit Spotlight
Slide starts near-black. A radial-gradient "light pool" blooms from the CTA outward, revealing the photo as though a wick just caught. Pair with `InteractiveCandleCanvas`'s flicker vocabulary.
**Best for:** the festive/Diwali story. Emotionally the strongest concept in this list.

### E. Stacked Card Deck
Slides as physical cards, next two peeking behind with `scale: 0.95`, `y: 24`, reduced opacity. Advancing throws the top card away and promotes the stack. Add subtle `rotateZ` (1–2°) so the pile reads as hand-placed.
**Best for:** signalling "there are more collections" without a separate grid.

### F. Horizontal Marquee Ribbon
Abandon one-slide-at-a-time: a continuously drifting row of tall portrait cards, pausing on hover, drag-to-scrub. Draws on `CollectionsStoryView`'s ScrollTrigger patterns.
**Best for:** browsing many collections; feels boutique and catalog-like.

### G. Scroll-Scrubbed Pin
Pin the carousel and drive slide index from scroll progress instead of a timer — the exact mechanic already in [`ScrollInteractiveShowcase.tsx`](../src/features/landing/ScrollInteractiveShowcase.tsx). The user's scroll *is* the transition.
**Best for:** a full-viewport home page centrepiece. Use at most once per page.

### H. Typographic Hero
Photo demoted to a low-opacity textural background; an oversized `text-8xl font-extralight` headline carries the slide, with per-word stagger on entry. Fragrance names become the visual.
**Best for:** bespoke/custom-blend storytelling where scent, not shape, is the product.

### I. Layered Parallax Depth
Separate background, mid-ground product, and foreground copy into three layers moving at different rates on pointer-move (and on transition). Gives a shallow-diorama depth without three.js.
**Best for:** sculptural and food-mimicking collections where form deserves dimension.

---

## 4. Ideas for slide content

The current three slides lean on desserts/beverages imagery. Higher-conviction angles drawn from `CANDLE_CATEGORIES`:

- **Festival countdown** — "11 days to Diwali," urlis and floral diyas, real urgency.
- **Scent-pairing story** — pair two fragrance notes visually ("Rose meets Sandalwood") for custom blends.
- **Behind-the-pour** — hands, molten wax, workshop texture. Sells "handcrafted" better than a finished product shot.
- **Gifting occasion** — wedding favours, corporate hampers, keepsakes; leads with the *moment*, not the object.
- **DIY starter** — the `raw-materials` collection is a genuinely different audience (makers, not buyers) and deserves its own slide voice.
- **Photo-embedded keepsake** — the most emotional SKU in the catalogue and currently under-sold.

---

## 5. Requirements for any template

Treat these as a checklist before calling a template done.

- **Accessibility.** Gate decorative motion behind `useReducedMotion()` (`src/hooks/useReducedMotion.ts`). Dot/arrow controls need `aria-label`s. Auto-advance must pause on hover and on keyboard focus. Every image needs a real `alt`.
- **Both themes.** Verify in light *and* dark — the photos are bright, so light-mode white text over them is the usual failure. Use the `dark:` variants and a scrim.
- **Responsive.** Layout must hold at 375px. Test that headline sizes step down (`text-4xl sm:text-6xl lg:text-7xl`) and side-by-side layouts stack.
- **Empty and single-slide states.** Follow Template1: bail with `if (!slide) return null` and skip the auto-advance timer when `slides.length <= 1`.
- **Interval cleanup.** Always `clearInterval` in the `useEffect` return, and key the GSAP timeline off `activeIdx` via `dependencies`.
- **Image weight.** Source photos are 2–3 MB PNGs. Prefer `.webp` and add `loading="lazy"` on non-first slides. See the note in [CLAUDE.md](../CLAUDE.md).
