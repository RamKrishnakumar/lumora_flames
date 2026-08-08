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
├── types/category.ts       # Category / SubCategory domain model
├── data/
│   ├── categories.ts       # CANDLE_CATEGORIES — the single content source
│   ├── assets.ts           # ASSET_IMAGES — imported (hashed) image registry
│   └── images/             # Source photography
├── components/             # Reusable, presentational
│   ├── layout/Navbar.tsx
│   ├── ui/CategoryCard.tsx, AmbientFlameGlow.tsx
│   └── canvas/InteractiveCandleCanvas.tsx
├── features/               # Route-level compositions
│   ├── landing/            # LandingHero, PromotionalCarousel, PromoCarouselTemplate1,
│   │                       # ScrollInteractiveShowcase
│   ├── categories/         # CollectionsStoryView, CollectionsView, CategoryDetail
│   └── contact/ContactFormWorkflow.tsx
├── context/                # ThemeContext, ThemeProvider, barrel index
├── hooks/useReducedMotion.ts
└── lib/utils.ts            # cn()
```

`components/` holds pieces reusable across routes; `features/` holds route-level compositions. A component that fetches, owns route state, or is used by exactly one page belongs in `features/`.

## Routes

All defined in [`App.tsx`](../src/App.tsx):

| Path | Component | Notes |
| --- | --- | --- |
| `/` | `LandingHero` | Headline + promo carousel + collections grid |
| `/collections` | `CollectionsStoryView` | Scroll-pinned, one full viewport per collection |
| `/catalog` | `CollectionsView` | Searchable card grid |
| `/category/:categoryId` | `ScrollInteractiveShowcase` | Scroll-scrubbed subcategory walkthrough |
| `/category/:categoryId/details` | `CategoryDetail` | Subcategory breakdown + order CTAs |
| `/contact` | `ContactFormWorkflow` | 3-step FORM → OTP_VERIFY → SUCCESS |
| `*` | redirect to `/` | |

Unknown `:categoryId` values redirect to `/catalog` rather than silently falling back to the first collection.

## Data flow

Everything renders from `CANDLE_CATEGORIES` in [`data/categories.ts`](../src/data/categories.ts), typed by `Category`/`SubCategory` in [`types/category.ts`](../src/types/category.ts). There is no backend and no API layer. To add a collection, append to that array — all six routes pick it up automatically.

Category `id` values are slugs used directly in URLs. `PromoSlide.targetCollectionId` must match one of them or the CTA dead-ends at a redirect.

## Theming

`ThemeProvider` ([`context/ThemeProvider.tsx`](../src/context/ThemeProvider.tsx)) owns the theme, toggles a `.dark` class on `<html>`, and persists to `localStorage` under `lumora-theme`. Consume it with `useTheme()` from the `context` barrel — never read the class or localStorage directly.

Because the variant is `@custom-variant dark (&:where(.dark, .dark *))`, every colour utility needs an explicit `dark:` counterpart.

## Conventions

- **Named exports only** for components: `export const Thing: React.FC<ThingProps>`. Default exports are reserved for `App`.
- **JSDoc** on each component and on each prop in its interface — match the existing density.
- **`DESIGN_TOKENS`** for layout, typography, and glass surfaces instead of retyping class strings. Add a token rather than duplicating a fourth variation.
- **`cn()`** from `lib/utils.ts` for any conditional or merged class list.
- **GSAP inside `useGSAP`**, always scoped: `useGSAP(() => {...}, { scope: ref, dependencies: [...] })`. Never `useEffect` + raw gsap; never framer-motion. Call `gsap.registerPlugin(ScrollTrigger)` at module top level in files that pin or scrub.
- **`useReducedMotion()`** to gate decorative animation.
- No test framework is set up; verify changes by running the app.
