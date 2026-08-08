# CLAUDE.md

Lumora Flames — marketing & catalog site for a handcrafted artisanal candle brand (festive urlis and diyas, bespoke fragrance blends, food-mimicking wax sculptures, and raw materials for DIY candle makers). No cart or checkout; the conversion path is the "Bespoke Concierge" inquiry form at `/contact`.

React 19 + Vite 8 + Tailwind v4 + GSAP. No backend, no tests.

## Which doc to read when

Read the relevant doc **before** writing code — don't infer conventions from a single nearby file.

| Task | Read |
| --- | --- |
| Building or restyling a promotional carousel; needing design concepts for one | [`docs/promoCarousal.md`](docs/promoCarousal.md) |
| Adding a route, component, or feature; deciding where a file belongs; changing data flow or theming | [`docs/architecture.md`](docs/architecture.md) |
| Any visual work — colour, type, spacing, motion, glass surfaces | [`docs/design-system.md`](docs/design-system.md) |

For a small change inside one existing component, matching that file's surrounding style is enough. For anything new, or anything visual, read the docs first.

## Running things

**Node v12 is the machine default and breaks every script** with a bare `Unexpected token ?`. Use Node 24:

```bash
export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH"
```

```bash
npm run dev      # vite dev server
npm run build    # tsc -b && vite build
npm run lint     # eslint
```

There is no test suite — verify changes by running `npm run dev` and checking the affected routes in both light and dark mode.

## Hard rules

- **Animation is GSAP**, always inside `useGSAP(() => {...}, { scope: ref, dependencies: [...] })`. Never `useEffect` + raw gsap. Never add framer-motion or another animation library.
- **Amber (`amber-500`/`amber-400`) is the only accent colour**, over a `stone-50`/`stone-950` base. Don't introduce a second accent hue.
- **Use `DESIGN_TOKENS`** (`src/theme/designSystem.ts`) for layout, typography, and glass surfaces. Add a token instead of duplicating a class string a fourth time.
- **Every colour utility needs its `dark:` counterpart.** Dark mode is class-based via `ThemeProvider`; read it with `useTheme()`, never from `localStorage` or the DOM.
- **Named exports** for components, with JSDoc on the component and its props.
- **Images must be imported** in `src/data/assets.ts`, never referenced as `'src/data/images/...'` strings — string paths silently 404 in production builds.
- **Tailwind v4 is CSS-first.** There is no `tailwind.config.js`; theme changes go in the `@theme` block in `src/index.css`. Don't add global `h1`/`h2`/`p` rules there — typography belongs to `DESIGN_TOKENS`.
- **Don't create a second version of an existing component.** Wire up or fix the one that exists; if two are genuinely needed, ask which is canonical.
- **`CANDLE_CATEGORIES` is the source of truth.** Don't rename ids and don't change the hierarchy — ids are URL slugs and are referenced by promo slides.
- **No cards-and-grids for content.** Collections and varieties are told as full-bleed scroll moments, not repeated tiles. Each of the six collections gets its *own* treatment, not the same effect six times.
- **Every animated component needs a reduced-motion branch** — skip the pin, skip the autoplay, `clearProps` so nothing is stranded invisible. Animate transforms and opacity, never layout properties.
- **Nothing is persisted before OTP verification.** `lib/verification.ts` owns both the code check and the write in one call so the ordering can't be bypassed; add backends by implementing `VerificationProvider`, not by calling out from the form.
- **lucide-react v1 has no brand icons** (no Instagram/Facebook/YouTube/LinkedIn). Use a generic glyph with an `aria-label`, or add `simple-icons` deliberately.

## Known gaps

- The OTP provider is a mock — code `123456`, persists nothing. The seam is `verificationProvider` in `src/lib/verification.ts`; swap it for a Supabase/Firebase implementation of the same interface and no component changes.
- Source photos are 2–3 MB PNGs and dominate the bundle (~19 MB of assets against a 411 KB entry chunk). Converting to `.webp` is the single biggest available performance win; routes and below-fold images are already split and lazy.
- No SEO/meta handling. `index.html` still has the default `lumora_flames` title.
- Social links in `Footer` point at platform roots, not real brand profiles.
- Individual product pages don't exist yet; `SubCategoryShowcase` is the leaf of the flow.
