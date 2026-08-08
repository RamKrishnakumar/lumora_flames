# Design System

Lumora Flames is a luxury artisanal candle brand. The visual target is **quiet luxury**: warm firelight against neutral stone, airy type, generous space. Restraint is the point — when in doubt, remove rather than add.

## Tokens

Defined in [`src/theme/designSystem.ts`](../src/theme/designSystem.ts) as `DESIGN_TOKENS`. Use them instead of retyping class strings; extend the token file rather than inventing a one-off variant.

```ts
layout.maxWidth       // max-w-[1600px]
layout.paddingX       // px-6 sm:px-10 lg:px-16
layout.headerOffset   // pt-28 sm:pt-32   ← required on any page under the fixed navbar

typography.heroTitle      // text-5xl → text-8xl, font-extralight
typography.sectionTitle   // text-3xl → text-5xl, font-light
typography.body           // text-sm sm:text-base font-light
typography.eyebrow        // text-xs font-semibold tracking-[0.2em] uppercase text-amber-500

glass.card         // frosted panel: content surfaces, forms
glass.floatingBtn  // heavier blur + shadow: navbar pill, floating CTAs
```

## Colour

| Role | Value |
| --- | --- |
| Accent | `amber-500` (primary), `amber-400` (hover / dark-mode text) |
| Light base | `stone-50` bg, `stone-900` text |
| Dark base | `stone-950` bg, `stone-100` text |
| Muted copy | `stone-600` / `dark:stone-400` |
| Borders | `stone-200` / `dark:stone-800` |

**Amber is the only accent colour.** It stands in for candlelight and carries every CTA, active state, and emphasis. Introducing a second accent hue breaks the brand.

Text over photography always needs a scrim — `bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent`. Product photos are bright.

## Type

The identity comes from contrast between **airy display type** and **tight uppercase labels**:

- Display: `font-extralight` / `font-light`, `tracking-tight`, generous `leading`.
- Headlines commonly split two-tone: a light phrase plus a `font-semibold text-amber-500` phrase.
- Labels/eyebrows: `text-xs font-semibold uppercase tracking-widest`.
- Body: `font-light leading-relaxed`.

Buttons use `text-xs font-semibold uppercase tracking-wider` — never sentence-case.

## Shape & surface

- Radii: `rounded-3xl` for cards, `rounded-[2.5rem]` for large showcases, `rounded-full` for pills, CTAs, and icon buttons.
- Glass: `backdrop-blur-xl`/`2xl` over `/70`–`/40` alpha fills with a hairline border.
- Elevation via `shadow-lg`/`shadow-2xl` rather than heavy borders.

## Motion

GSAP only, always inside `useGSAP` with a `scope`.

Named eases, durations, stagger, and the reveal helpers live in [`lib/animations.ts`](../src/lib/animations.ts) (`EASE`, `DURATION`, `STAGGER`, `revealUp`, `wipeIn`, `kenBurns`, `flicker`, `settleInstantly`). Use those rather than retyping ease strings.

- Entrances: `EASE.enter` (`power3.out`), 0.5–0.8s, staggered `STAGGER` (0.09s).
- Exits: `EASE.exit` (`power2.in`), ~0.22s — always shorter than the entrance.
- Ambient loops: `EASE.ambient` (`sine.inOut`) with `repeat: -1, yoyo: true`.
- Hover: 0.6s `power2.out` scale (see `CollectionShowcase`).
- Scroll: `ScrollTrigger` with `scrub: 0.8–1`; use `pin` sparingly — at most one pinned section per page. `CollectionsStoryView` is the exception: it pins each of six sections in sequence, which reads as one continuous pin.
- Flicker: short 0.15s randomised yoyo tweens — use `flicker()` (see `InteractiveCandleCanvas`).

**Animate transforms and opacity, never layout.** To parallax an image, scrub `yPercent` on an oversized element (`h-[118%] -translate-y-[8%]`) rather than animating `top` or `height`; to draw a timeline rule, scrub `scaleY` with `origin-top` rather than `height`.

Gate anything decorative behind `useReducedMotion()`, and give it a real fallback: skip the pin, skip the autoplay, and `gsap.set(targets, { clearProps: 'all' })` (or `settleInstantly`) so nothing is stranded at `opacity: 0`.

## Checklist for new UI

- Renders correctly in light **and** dark mode.
- Holds up at 375px width.
- Uses `DESIGN_TOKENS` for layout/typography/glass.
- Pages under the fixed navbar apply `layout.headerOffset`.
- Interactive elements have `aria-label`s where the purpose isn't in visible text.
- Decorative motion respects reduced-motion.
