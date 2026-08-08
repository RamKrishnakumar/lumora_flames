# Promotional Carousel — Design & Creative Guide

A playbook for building new promotional carousel templates for Lumora Flames. Read this before designing a carousel variant, then pick or remix a concept rather than defaulting to "image + heading + button."

---

## 1. How the carousel is wired

The carousel uses a **data-in / template-out** split. Respect it — it's the whole reason new templates are cheap to add.

| File | Role |
| --- | --- |
| [`data/promotions.ts`](../src/data/promotions.ts) | **The content.** `OFFER_SLIDES`, `REASON_SLIDES`, `GIFTING_SLIDES`, plus the DEV-time assertion that every `targetCollectionId` resolves. |
| [`types/promotion.ts`](../src/types/promotion.ts) | **The contracts.** `PromoSlide`, `ReasonSlide`, `GiftingSlide` — one per placement, over a shared `PromotionBase`. |
| [`PromotionalCarousel.tsx`](../src/features/landing/PromotionalCarousel.tsx) | **Smart container.** Takes a `placement`, selects dataset + template, and owns navigation (`navigate('/category/:id')`). |
| [`PromoCarouselTemplate1.tsx`](../src/features/landing/PromoCarouselTemplate1.tsx) | **Photographic slideshow** (concept A). Autoplay, one slide at a time. Serves `offers`. |
| [`PromoCarouselTemplate2.tsx`](../src/features/landing/PromoCarouselTemplate2.tsx) | **Typographic band** (concepts G + H). Pinned, scroll-driven, no imagery. Serves `reasons`. |
| [`PromoCarouselTemplate3.tsx`](../src/features/landing/PromoCarouselTemplate3.tsx) | **Drifting ribbon** (concept F). Several cards at once, drag-to-scrub. Serves `gifting`. |

All three templates are **dumb** — each receives `slides`, `onNavigateCollection`, and a `label`, and knows nothing about routing or where content comes from.

### The three placements

`PromotionalCarousel` takes one prop, `placement`, and the home page names all three:

| `placement` | Dataset | Template | Job |
| --- | --- | --- | --- |
| `offers` | `OFFER_SLIDES` | 1 | Reasons to act now — editorial urgency, no percentages. |
| `reasons` | `REASON_SLIDES` | 2 | Why own a candle at all. |
| `gifting` | `GIFTING_SLIDES` | 3 | Occasions, each mapping onto an existing collection. |

They read as three different things because they *are* three different formats, distributed through the page rather than stacked. Three sliders in a row would read as a page that couldn't decide what to say. See [Home page composition](architecture.md#home-page-composition) for where each one sits in the scroll.

### The slide contracts

Three interfaces rather than one permissive shape, because Template1 genuinely requires a photograph and Template2 genuinely has none. A single optional-`bgImage` interface would push "does this slide have an image?" checks into every template.

```ts
interface PromotionBase {
  id: string;
  targetCollectionId: string;   // must be a real id in data/categories.ts
}

interface PromoSlide extends PromotionBase {    // offers
  tagline: string; title: string; highlightText: string;
  description: string; bgImage: string; ctaText: string;
}

interface ReasonSlide extends PromotionBase {   // reasons
  lead: string; highlight: string; trail: string;
  support: string; ctaText: string;
}

interface GiftingSlide extends PromotionBase {  // gifting
  occasion: string; title: string; body: string; image: string;
}
```

Every one keeps a **two-tone split** — `title`/`highlightText`, `lead`/`highlight`/`trail` — because the visual signature is a `font-light` phrase colliding with a `font-semibold text-amber-400` phrase. Keep it in any new template.

### `targetCollectionId` is validated, not just documented

`assertTargetsResolve()` in `data/promotions.ts` checks every slide across all three datasets against `CANDLE_CATEGORIES` and throws in development, listing the placement, the slide id, the bad target, and the valid ids. It's guarded by `import.meta.env.DEV`, so it costs nothing shipped.

This exists because a JSDoc comment saying "must match an id" did not prevent two of the original three slides from pointing at `festive-urlis` and `sculptural-food` — neither of which exists. Both bounced through the unknown-slug redirect to `/collections`, so the carousel *looked* like it worked. A silent failure that resembles success needs a mechanism, not a comment.

### Adding a fourth placement

1. Add the dataset to `data/promotions.ts` and its interface to `types/promotion.ts`, extending `PromotionBase`.
2. Add the dataset to the `assertTargetsResolve()` list — otherwise its ids are unchecked.
3. Create `PromoCarouselTemplate4.tsx` taking `slides` / `onNavigateCollection` / `label`.
4. Add the member to `PromoPlacement` and one `case` in `PromotionalCarousel`.

The switch has no `default`, deliberately: a new union member with no branch is a TypeScript error rather than a slide silently rendering as Template1.

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

**A, F, G and H are now built** (as Templates 1, 3, and 2 — Template2 remixes G's scroll mechanic with H's typography). B, C, D, E and I are still unused. Prefer an unused concept for a new placement: the point of the split is that each placement looks like itself.

### A. Ken Burns Ember *(built — Template1, `offers`)*
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

### F. Horizontal Marquee Ribbon *(built — Template3, `gifting`)*
Abandon one-slide-at-a-time: a continuously drifting row of tall portrait cards, pausing on hover, drag-to-scrub. Draws on `CollectionsStoryView`'s ScrollTrigger patterns.
**Best for:** browsing many collections; feels boutique and catalog-like.

### G. Scroll-Scrubbed Pin *(built — Template2, `reasons`)*
Pin the carousel and drive slide index from scroll progress instead of a timer — the exact mechanic used by [`SubCategoryShowcase.tsx`](../src/features/categories/SubCategoryShowcase.tsx). The user's scroll *is* the transition. Copy its `activeIndexRef` guard: updating state on every scroll frame re-renders continuously, so mirror the index in a ref and only `setState` when it actually changes.
**Best for:** a full-viewport home page centrepiece. Use at most once per page.

### H. Typographic Hero *(built — remixed into Template2)*
Photo demoted to a low-opacity textural background; an oversized `text-8xl font-extralight` headline carries the slide, with per-word stagger on entry. Fragrance names become the visual.
**Best for:** bespoke/custom-blend storytelling where scent, not shape, is the product.

### I. Layered Parallax Depth
Separate background, mid-ground product, and foreground copy into three layers moving at different rates on pointer-move (and on transition). Gives a shallow-diorama depth without three.js.
**Best for:** sculptural and food-mimicking collections where form deserves dimension.

---

## 4. Ideas for slide content

**Offers carry urgency without numbers.** No percentages, no strikethrough pricing — there is no pricing model in the codebase, and the brand's register doesn't shout figures. Scarcity comes from the making: a limited pour, a concierge lead time, a season that ends. The three live slides are the festive edit, bespoke commission lead times, and a new sculpture series.

**Reasons are claims, not features.** "Fragrance is the fastest route to memory," not "premium soy wax blend." Template2 has no imagery to hide behind, so a weak line has nowhere to go.

**Gifting leads with the moment, not the object** — and each occasion resolves to a real collection. Still unused and worth a slide:

- **Festival countdown** — "11 days to Diwali," urlis and floral diyas. Real urgency, but it needs a date source; hardcoding one guarantees it goes stale.
- **Scent-pairing story** — two fragrance notes set against each other visually ("Rose meets Sandalwood") for custom blends. Concept B or H.
- **Behind-the-pour** — hands, molten wax, workshop texture. Sells "handcrafted" better than a finished product shot, and there is no photography for it yet.
- **Photo-embedded keepsake** — the most emotional SKU in the catalogue and still under-sold.

---

## 5. Requirements for any template

Treat these as a checklist before calling a template done.

- **Accessibility.** Gate decorative motion behind `useReducedMotion()` (`src/hooks/useReducedMotion.ts`) — when it's set, autoplay must not start at all. Controls need `aria-label`s and 44×44 hit areas. Anything that advances or drifts on its own must pause on pointer-over, on keyboard focus inside the frame (use `onFocus`/`onBlur`, which bubble, not `focus`/`blur`), and when the tab is hidden. Give the region an `aria-label` and `aria-roledescription="carousel"` — three placements share the home page, so identical labels are indistinguishable in a landmark list. Template1 implements the full autoplay case; copy its structure.
- **WCAG 2.2.2 attaches to time, not to carousels.** Content that moves for more than five seconds needs a visible pause/play toggle — Template1 has one. Template2 moves only when the visitor scrolls, so it needs none; Template3 drifts continuously but pauses on hover, focus and drag, and stops entirely under reduced motion. Design the mechanism first, then apply the rule to what you built.
- **Both themes.** Verify in light *and* dark — the photos are bright, so light-mode white text over them is the usual failure. Use the `dark:` variants and a scrim.
- **Responsive.** Layout must hold at 375px. Test that headline sizes step down (`DESIGN_TOKENS.typography.displayBand` covers the oversized case) and side-by-side layouts stack.
- **Empty and single-slide states.** Bail early — `if (total === 0) return null`, and skip the auto-advance timer when `slides.length <= 1`. All three templates do this.
- **Cleanup.** `clearInterval` in the `useEffect` return; `kill()` any Draggable; key GSAP timelines off `activeIdx` via `dependencies`. If a plugin is loaded with a dynamic `import()`, guard the async gap with a `cancelled` flag — the effect can be torn down before it resolves, and the instance created afterwards would never be killed.
- **Scroll-driven index.** GSAP builds `onUpdate` closures once, so mirror the index in a ref and only `setState` when it actually changes. Reading state directly there is stale *and* re-renders on every scroll frame. Templates 2 and 3 and [`SubCategoryShowcase`](../src/features/categories/SubCategoryShowcase.tsx) all use this guard.
- **Duplicate DOM is not content.** A seamless marquee renders its set twice; the copy needs `aria-hidden` and `tabIndex={-1}` so nobody reads or tabs each card twice.
- **Image weight.** Source photos are 2–3 MB PNGs. Prefer `.webp`. Note that `key={slide.id}` remounts the slide, so only the active `<img>` is ever mounted in Template1 — use `loading="eager"` on the first and warm the *next* slide with `new Image()` rather than marking them all lazy and stalling every transition. See the note in [CLAUDE.md](../CLAUDE.md).
