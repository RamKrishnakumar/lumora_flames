# Architecture

## Stack

React 19 (with React Compiler) · Vite 8 · Tailwind CSS v4 · react-router-dom v7 · GSAP 3 + `@gsap/react` · lucide-react · TypeScript 6.

Tailwind v4 is configured **CSS-first** — there is no `tailwind.config.js`. The `@theme` block and the `dark` variant live in [`src/index.css`](../src/index.css). The React Compiler runs via `babel-plugin-react-compiler` in [`vite.config.ts`](../vite.config.ts), so manual `useMemo`/`useCallback` is usually unnecessary.

## Directory layout

```
src/
├── App.tsx                 # Router, page wrappers, providers
├── main.tsx                # createRoot entry
├── index.css               # Tailwind import, @theme, dark variant, base layer
├── theme/designSystem.ts   # DESIGN_TOKENS — shared class strings
├── types/
│   ├── category.ts         # Category / SubCategory domain model
│   └── promotion.ts        # PromoSlide / ReasonSlide / GiftingSlide
├── data/
│   ├── categories.ts       # CANDLE_CATEGORIES — the single content source
│   ├── promotions.ts       # OFFER / REASON / GIFTING slides + DEV id assertion
│   ├── assets.ts           # ASSET_IMAGES — imported (hashed) image registry
│   └── images/             # Source photography
├── components/             # Reusable, presentational
│   ├── layout/             # Navbar, Footer, PageTransition, ErrorBoundary
│   ├── ui/                 # CollectionShowcase, AmbientFlameGlow, EmberField,
│   │                       # RouteFallback
│   └── canvas/InteractiveCandleCanvas.tsx
├── features/               # Route-level compositions
│   ├── landing/            # LandingHero, HeroChamber, CollectionIndexRail,
│   │                       # CampaignShowcase, PromotionalCarousel,
│   │                       # PromoCarouselTemplate1/2/3
│   ├── categories/         # CollectionsStoryView, SubCategoryShowcase
│   ├── about/AboutStory.tsx
│   └── contact/ContactFormWorkflow.tsx
├── context/                # ThemeContext, ThemeProvider, barrel index
├── hooks/useReducedMotion.ts
└── lib/
    ├── utils.ts            # cn()
    ├── animations.ts       # EASE / DURATION / STAGGER + reveal helpers
    └── verification.ts     # OTP provider seam (see "Inquiry verification")
```

`components/` holds pieces reusable across routes; `features/` holds route-level compositions. A component that fetches, owns route state, or is used by exactly one page belongs in `features/`.

## Routes

All defined in [`App.tsx`](../src/App.tsx). Every page component is `React.lazy`-loaded, because the data module imports the collection photography — an eagerly imported route drags megabytes of PNG into the entry chunk.

| Path | Component | Notes |
| --- | --- | --- |
| `/` | `LandingHero` | Seven screens — see [Home page composition](#home-page-composition) |
| `/collections` | `CollectionsStoryView` | Scroll-pinned, one full viewport per collection, a different GSAP treatment each |
| `/category/:categoryId` | `SubCategoryShowcase` | Pinned scroll-through of one collection's varieties, driving `InteractiveCandleCanvas` |
| `/about` | `AboutStory` | Brand story, scrubbed process timeline, pillars |
| `/contact` | `ContactFormWorkflow` | 3-step FORM → OTP_VERIFY → SUCCESS |
| `*` | redirect to `/` | |

Retired paths still resolve so old links don't 404: `/catalog` and `/category/:categoryId/details` both redirect to `/collections`. Unknown `:categoryId` values also redirect to `/collections` rather than silently falling back to the first collection.

The router tree is `ErrorBoundary > ThemeProvider > Router`, with `PageTransition` wrapping the `Suspense` boundary (fallback: `RouteFallback`) and `Footer` rendered once below it. `PageTransition` resets scroll, plays the enter tween, and calls `ScrollTrigger.refresh()` on completion — pinned routes measure wrong without it.

**Flow:** Landing → Collections → Sub Categories → Contact/Inquiry. Individual product pages are a future step; `SubCategoryShowcase` is currently the leaf.

`PageShell` (max width, gutters, `headerOffset`) wraps `/about` and is applied loosely on `/contact`. `/` and `/collections` **opt out** — both are full-bleed and self-pinning, and a page-level wrapper would cage a `100svh` hero. They apply containment per section instead.

## Home page composition

[`LandingHero`](../src/features/landing/LandingHero.tsx) is composition only — seven screens, each owning its own motion and its own reduced-motion branch.

| # | Screen | Component | Format | Images |
| --- | --- | --- | --- | --- |
| 1 | Hero | `HeroChamber` | Centred display type in a lit chamber | 0 |
| 2 | Offers | `PromotionalCarousel placement="offers"` | Photographic slideshow, autoplay | 3 |
| 3 | Featured | 3 × `CollectionShowcase` | Editorial spreads, a different variant each | 3 |
| 4 | Why candles | `PromotionalCarousel placement="reasons"` | Pinned typographic band | 0 |
| 5 | Gifting | `PromotionalCarousel placement="gifting"` | Drifting ribbon, drag-to-scrub | 4 |
| 6 | All six | `CollectionIndexRail` | Type-led index, one swapping `<img>` | 6 |
| 7 | Campaigns | `CampaignShowcase` | Uneven 12-column mosaic | 0 |

Two rules hold this together, and both are easy to break by adding "one more section":

- **No two consecutive screens resolve the same way.** Image-led and type-led alternate. Screens 1, 4 and 7 ship zero image bytes, which is what let the page grow from four sections to seven without getting heavier.
- **Home teases; `/collections` delivers.** Screen 3 features exactly three collections, named in `FEATURED_COLLECTION_IDS` and resolved against `CANDLE_CATEGORIES` (unknown ids are skipped, not rendered empty). Screen 6 indexes all six as type rows and links onward. Home previously mapped all six through `CollectionShowcase` — the same six, in the same order, that `/collections` already tells as pinned viewports. Don't reintroduce that.

`HeroChamber` layers a chamber gradient, a breathing radial light pool, `EmberField` (14 seeded rising sparks), and `InteractiveCandleCanvas` cropped by the bottom edge. Its hero visual is *looked up* from `CANDLE_CATEGORIES` rather than hardcoded, so the signature product stays in sync with the data.

`Draggable` and `InertiaPlugin` (used by Template3) ship free with GSAP as of 3.13, but together are ~117 KB of source. They are **dynamically imported** — statically importing them put all of it on the landing page's critical path for a drag affordance on the fifth screen, taking the landing chunk from 22 KB to 88 KB. The drift, hover-pause, and click-through all work without them.

## Inquiry verification

[`lib/verification.ts`](../src/lib/verification.ts) defines a `VerificationProvider` interface with two calls: `requestCode(draft, channel)` and `confirmAndPersist(session, code, draft)`. The provider owns **both** the code check and the write, so an inquiry cannot be persisted before its one-time code is verified — the ordering is structural, not a convention a caller has to remember.

`mockVerificationProvider` is wired in today: it accepts `123456`, persists nothing, and `IS_MOCK_VERIFICATION` lets the UI say so. Swapping in Supabase or Firebase means implementing the interface and reassigning `verificationProvider`; no component changes.

`channel` is `'email' | 'phone'`, so either delivery method can be implemented without touching the form.

## Data flow

Everything renders from `CANDLE_CATEGORIES` in [`data/categories.ts`](../src/data/categories.ts), typed by `Category`/`SubCategory` in [`types/category.ts`](../src/types/category.ts). There is no backend and no API layer. To add a collection, append to that array — every route picks it up automatically.

`CANDLE_CATEGORIES` is the source of truth: **do not rename ids and do not change the hierarchy.** Ids are slugs used directly in URLs and referenced by every promotional slide's `targetCollectionId`; renaming one breaks live links and dead-ends the CTA at a redirect.

[`data/promotions.ts`](../src/data/promotions.ts) is the second content module, holding the three promotional datasets. It validates every `targetCollectionId` against `CANDLE_CATEGORIES` on import and throws in development, behind `import.meta.env.DEV`. This is a hard requirement rather than a nicety: an unknown slug redirects to `/collections`, so a broken CTA still *navigates* and still looks like it worked. Two of the original three slides were wrong for exactly this reason. Add a new dataset to that assertion's list or its ids go unchecked.

Cross-cutting groupings like *gifting* live in `promotions.ts` and **map onto** existing category ids (weddings → `bespoke-personalized`, corporate → `container-jar`). They must not become `CANDLE_CATEGORIES` entries.

Each `SubCategory` carries an optional `visual: CandleVisual` (`vessel`, `waxFrom`, `waxTo`, `labelNote`) that drives `InteractiveCandleCanvas`. The wax tones are neutrals — glass, cream, wax — so the amber-only accent rule still holds.

## Theming

`ThemeProvider` ([`context/ThemeProvider.tsx`](../src/context/ThemeProvider.tsx)) owns the theme, toggles a `.dark` class on `<html>`, and persists to `localStorage` under `lumora-theme`. Consume it with `useTheme()` from the `context` barrel — never read the class or localStorage directly.

Because the variant is `@custom-variant dark (&:where(.dark, .dark *))`, every colour utility needs an explicit `dark:` counterpart.

## Conventions

- **Named exports only** for components: `export const Thing: React.FC<ThingProps>`. Default exports are reserved for `App`.
- **JSDoc** on each component and on each prop in its interface — match the existing density.
- **`DESIGN_TOKENS`** for layout, typography, and glass surfaces instead of retyping class strings. Add a token rather than duplicating a fourth variation.
- **`cn()`** from `lib/utils.ts` for any conditional or merged class list.
- **GSAP inside `useGSAP`**, always scoped: `useGSAP(() => {...}, { scope: ref, dependencies: [...] })`. Never `useEffect` + raw gsap; never framer-motion. Call `gsap.registerPlugin(ScrollTrigger)` at module top level in files that pin or scrub.
- **Shared motion vocabulary** in [`lib/animations.ts`](../src/lib/animations.ts): `EASE`, `DURATION`, `STAGGER`, plus `revealUp`, `wipeIn`, `kenBurns`, `flicker`, `settleInstantly`. Reach for these before hand-rolling an ease string.
- **`useReducedMotion()`** to gate decorative animation. Every animated component needs a reduced-motion branch: skip pinning, skip autoplay, and `gsap.set(..., { clearProps: 'all' })` so nothing is left mid-tween.
- **Animate transforms and opacity, not layout.** Scrub `yPercent`/`scaleY` on an oversized element rather than `top`/`height`.
- **No cards-and-grids for content.** Collections and varieties are told as full-bleed scroll moments (`CollectionShowcase`, `CollectionsStoryView`, `SubCategoryShowcase`), not repeated tiles.
- **Don't add a parallel version of an existing component** — improve the one that exists. If two really are needed, ask which is canonical.
- No test framework is set up; verify changes by running the app in both light and dark mode, at phone, tablet, and desktop widths.
