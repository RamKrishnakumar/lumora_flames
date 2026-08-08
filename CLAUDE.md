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

## Known gaps

- The OTP step in `ContactFormWorkflow` is mocked — code `123456`, with a `TODO` marking where a real Supabase/Firebase call goes. No inquiry is persisted anywhere.
- Source photos are 2–3 MB PNGs and dominate the bundle. Converting to `.webp` and lazy-loading below-fold images is the single biggest available performance win.
- No error boundaries, no loading states, no SEO/meta handling. `index.html` still has the default `lumora_flames` title.
