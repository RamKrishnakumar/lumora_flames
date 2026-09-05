# CLAUDE.md

Lumora Flames — marketing & catalog site for a handcrafted artisanal candle brand (festive urlis and diyas, bespoke fragrance blends, food-mimicking wax sculptures, and raw materials for DIY candle makers). No cart, no checkout, and no inquiry form; the conversion path is a direct message, via the WhatsApp and Instagram links at `/contact`.

React 19 + Vite 8 + Tailwind v4 + GSAP. No backend. Tests cover one thing only — the WhatsApp deep link — so treat manual verification as the real safety net.

## Which doc to read when

Read the relevant doc **before** writing code — don't infer conventions from a single nearby file.

| Task | Read |
| --- | --- |
| Building or restyling a promotional carousel; needing design concepts for one | [`docs/promoCarousal.md`](docs/promoCarousal.md) |
| **Writing any code at all** — the JSDoc standard, the DRY rules, naming, motion, accessibility, and how a change is verified | [`docs/architecture.md#coding-rules`](docs/architecture.md#coding-rules) |
| Adding a route, component, or feature; deciding where a new file belongs | [`docs/architecture.md#where-a-new-file-goes`](docs/architecture.md#where-a-new-file-goes) |
| Understanding how a screen, CTA, or piece of content connects to the rest | [`docs/architecture.md#navigation-tree`](docs/architecture.md#navigation-tree) |
| Anything touching how content is edited or published, or the admin-panel plan | [`docs/architecture.md#the-publishing-constraint`](docs/architecture.md#the-publishing-constraint) |
| Any visual work — colour, type, spacing, motion, glass surfaces | [`docs/design-system.md`](docs/design-system.md) |

For a small change inside one existing component, matching that file's surrounding style is enough. For anything new, or anything visual, read the docs first.

## Running things

**Node v12 is the machine default and breaks every script** with a bare `Unexpected token ?`. Use Node 24:

```bash
export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH"
```

```bash
npm run dev           # vite dev server
npm run build         # tsc -b && vite build
npm run lint          # eslint
npm run test          # vitest run
npm run format:check  # prettier --check .
```

**Both deploy workflows gate on all four of `lint`, `format:check`, `test` and `build`** — a failure in any one of them means no deploy, so run them before pushing, not just `build`.

`npm run test` is a deliberately narrow suite, not a safety net. It asserts the WhatsApp deep link in `src/data/contact.ts` and nothing else, because that link is the site's entire conversion path and it fails *silently*: a malformed number makes `wa.me` open an "invalid number" screen rather than throwing, so a typo still looks like a working button. Nothing renders a component or asserts a layout.

So verification is still manual — see [`docs/architecture.md#verifying-a-change`](docs/architecture.md#verifying-a-change) for the full checklist.

## Hard rules

- **Animation is GSAP**, always inside `useGSAP(() => {...}, { scope: ref, dependencies: [...] })`. Never `useEffect` + raw gsap. Never add framer-motion or another animation library.
- **Amber (`amber-500`/`amber-400`) is the only accent colour**, over a `stone-50`/`stone-950` base. Don't introduce a second accent hue.
- **Use `DESIGN_TOKENS`** (`src/theme/designSystem.ts`) for layout, typography, and glass surfaces. Add a token instead of duplicating a class string a fourth time.
- **Every colour utility needs its `dark:` counterpart.** Dark mode is class-based via `ThemeProvider`; read it with `useTheme()`, never from `localStorage` or the DOM.
- **Named exports** for components, with JSDoc on the component and its props.
- **Images must be imported** in `src/data/assets.ts`, never referenced as `'src/data/images/...'` strings — string paths silently 404 in production builds.
- **Tailwind v4 is CSS-first.** There is no `tailwind.config.js`; theme changes go in the `@theme` block in `src/index.css`. Don't add global `h1`/`h2`/`p` rules there — typography belongs to `DESIGN_TOKENS`.
- **Don't create a second version of an existing component.** Wire up or fix the one that exists; if two are genuinely needed, ask which is canonical.
- **`CANDLE_CATEGORIES` is the source of truth.** Don't rename ids and don't change the hierarchy — ids are URL slugs and are referenced by promo slides. Every slide's `targetCollectionId` is checked against it on import by `assertTargetsResolve()` in `src/data/promotions.ts`, which throws in dev only; a new dataset must be added to that list or its ids go unchecked. An unknown slug redirects to `/collections`, so a broken CTA still *looks* like it worked — this is why the check exists rather than another comment.
- **Cross-cutting groupings are not categories.** "Gifting" lives in `data/promotions.ts` and maps onto existing ids. Don't add it to `CANDLE_CATEGORIES`.
- **No cards-and-grids for content.** Collections and varieties are told as full-bleed scroll moments, not repeated tiles. Each of the six collections gets its *own* treatment, not the same effect six times.
- **Every animated component needs a reduced-motion branch** — skip the pin, skip the autoplay, `clearProps` so nothing is stranded invisible. Animate transforms and opacity, never layout properties.
- **There is no backend, and `/contact` collects nothing.** The inquiry form, its OTP verification and the `VerificationProvider` seam were all deleted deliberately — a form needing a server, a database and a verified number was more infrastructure than the inquiry volume justifies. Enquiries arrive as WhatsApp or Instagram messages. Don't reintroduce a form, a fetch to an API, or a lead store without agreeing it first; the site is a static build and staying that way is the point.
- **`data/contact.ts` is the only source of handles, numbers and studio facts.** It appears in `Footer`, `AboutStory` and `ContactChannels`, and a number that is right in one and stale in another is worse than no number. Unfilled values use the `PLACEHOLDER` sentinel and are hidden from the page rather than rendered; `assertContactConfigured()` warns about them in dev only.
- **lucide-react v1 has no brand icons** (no Instagram/Facebook/YouTube/LinkedIn). Use a generic glyph with an `aria-label`, or add `simple-icons` deliberately.
- **`Draggable`/`InertiaPlugin` are free (GSAP 3.13+) but must be dynamically imported.** They're ~117 KB of source; a static import in `PromoCarouselTemplate3` took the landing chunk from 22 KB to 88 KB. Guard the async gap with a `cancelled` flag so a Draggable created after teardown still gets killed. Check the built chunk sizes after touching a GSAP plugin import.
- **The home page is full-bleed** — `/` and `/collections` opt out of `PageShell` and contain per section. Adding a section means keeping the alternating image-led / type-led rhythm; see [`docs/architecture.md`](docs/architecture.md#home-page-composition).

## Known gaps

- The four `STUDIO` facts in `src/data/contact.ts` (reply window, hours, city, bespoke lead time) are still the `PLACEHOLDER` sentinel, so the studio panel on `/contact` renders empty and is skipped. Filling them in is a copy task, not a code one.
- Enquiries are not recorded anywhere — they live in the studio's WhatsApp and Instagram inboxes. There is no log, no lead list, and no analytics on the conversion path. Accepted deliberately; see the hard rule above before proposing a fix.
- Source photos are 2–3 MB PNGs and dominate the bundle (~19 MB of assets against a 411 KB entry chunk). Converting to `.webp` is the single biggest available performance win; routes and below-fold images are already split and lazy.
- No SEO/meta handling. `index.html` still has the default `lumora_flames` title.
- Social links in `Footer` point at platform roots, not real brand profiles.
- Individual product pages don't exist yet; `SubCategoryShowcase` is the leaf of the flow.
