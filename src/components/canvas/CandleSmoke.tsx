import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Puff count, exported because the animator needs it: `HeroChamber` tapers rise
 * distance and swell along a puff's position in the emission order, which is
 * meaningless without knowing how many there are.
 *
 * Smoke has to be *continuous* or it reads as a handful of blobs
 * flying in formation, and continuity here is a density problem: puffs are
 * emitted one after another, so the count sets how much of the column is
 * occupied at once. Twelve left visible gaps between them and a hole where the
 * plume left the wick. Twenty overlaps enough that neighbours merge into one
 * body, which is also why each puff's alpha is so low.
 */
export const SMOKE_PUFF_COUNT = 20;

/**
 * Three puff footprints, cycled by index. Real smoke is not made of one
 * repeated particle, and all-identical puffs is exactly what made the first
 * version read as machined. Each is slightly taller than wide so that GSAP's
 * `rotate` has something to bite on — rotating a perfect circle is invisible.
 */
const PUFF_SIZES = ['h-4 w-3 -ml-[6px]', 'h-5 w-3.5 -ml-[7px]', 'h-6 w-4 -ml-2', 'h-5 w-4 -ml-2'];

/** Props for {@link CandleSmoke}. */
export interface CandleSmokeProps {
  /** Extra classes for the anchor node — position the wick here. */
  className?: string;
}

/**
 * CandleSmoke renders the plume that rises when a candle is blown out, inert at
 * `opacity: 0` until a parent plays it.
 *
 * ## Shape: a stem and a plume, not wisps
 *
 * The first version was three tall rounded bars that grew and drifted, and it
 * looked like three cylinders sliding upward — because that is what it was. A
 * blown-out wick does something more specific: it releases one thin, coherent
 * thread that holds its line for a couple of centimetres, then loses to
 * turbulence and breaks into puffs that curl, swell and thin out.
 *
 * So there are two kinds of element here. One `.flame-smoke-stem` — narrow,
 * vertical, gradient-faded at both ends — is the thread, and it lives less than
 * a second. Twelve `.flame-smoke-puff`s are the break-up, each a soft radial
 * blob on its own size, delay, sway and rotation. The plume's silhouette is an
 * emergent thing, never authored: it is whatever twelve independently drifting
 * puffs happen to add up to, which is why it doesn't repeat.
 *
 * `HeroChamber` owns the motion; see its `smoke()`.
 *
 * ## Why this is not part of `CandleFlame`
 *
 * It used to be, nested at the flame's base, which got the geometry for free —
 * and made the smoke impossible to see. `HeroChamber` scales and translates the
 * candle wrapper, and a `transform` creates a stacking context with
 * `z-index: auto`: every descendant is sealed into the wrapper's paint slot no
 * matter how high its own `z-index`. The wisps carried `z-20` inside a subtree
 * that painted below the headline's `z-10`, so smoke rose *behind* the type.
 *
 * Nothing in CSS lets a descendant escape that, and lifting the whole candle
 * above the type is worse: at 1024×768 the vessel body overlaps the headline, so
 * the wax would occlude glyphs. Hoisting only the smoke out is the one option
 * that puts it in front of the text without moving anything else.
 *
 * The cost is that geometry is no longer free — the caller must place this at the
 * wick and match the candle's scale. `HeroChamber` measures the flame right
 * before each blow-out; see its `placeSmoke`.
 *
 * ## Why nothing is blurred
 *
 * A `blur()` filter used to do the softening, and it cost the smoke its
 * legibility — a 3px blur over a 4px-wide wisp is mostly blur. The softness is
 * in the fills instead: the puffs are radial gradients that reach transparent
 * before their own edge, so they have no rim at any scale, and the stem fades
 * out at both ends so it has no hard cap leaving the wick and no hard tip. That
 * also means no per-frame filter pass on thirteen elements being scaled 5–6×.
 *
 * @example
 * <CandleSmoke className="absolute left-0 top-0 z-30" />
 */
export const CandleSmoke: React.FC<CandleSmokeProps> = ({ className }) => (
  <div aria-hidden="true" className={cn('pointer-events-none h-0 w-0', className)}>
    {/*
      The stem. Centred by a negative margin, not `-translate-x-1/2`: GSAP
      replaces the whole `transform` when it animates `x`, so a Tailwind
      translate on the same element would be silently dropped the moment the
      smoke moves. `bottom-0` puts its base on the anchor's origin, which the
      caller has placed at the wick tip.
    */}
    <span
      className={cn(
        'flame-smoke flame-smoke-stem absolute bottom-0 left-0 -ml-[2px] h-7 w-1 origin-bottom rounded-full opacity-0',
        'bg-[linear-gradient(to_top,rgba(68,64,60,0)_0%,rgba(68,64,60,0.85)_22%,rgba(87,83,78,0.5)_68%,rgba(87,83,78,0)_100%)]',
        'dark:bg-[linear-gradient(to_top,rgba(231,229,228,0)_0%,rgba(231,229,228,0.9)_22%,rgba(214,211,209,0.52)_68%,rgba(214,211,209,0)_100%)]'
      )}
    />

    {/*
      The plume. Alpha is deliberately low per puff — they overlap constantly on
      the way up, and a puff dense enough to read alone stacks into an opaque
      slab three-deep. The gradient stops short of the edge so scaling one 6×
      never exposes a circle.
    */}
    {Array.from({ length: SMOKE_PUFF_COUNT }, (_, index) => (
      <span
        key={index}
        className={cn(
          'flame-smoke flame-smoke-puff absolute bottom-0 left-0 rounded-full opacity-0',
          PUFF_SIZES[index % PUFF_SIZES.length],
          'bg-[radial-gradient(circle_closest-side_at_50%_50%,rgba(87,83,78,0.34),rgba(87,83,78,0.15)_44%,transparent_76%)]',
          'dark:bg-[radial-gradient(circle_closest-side_at_50%_50%,rgba(231,229,228,0.36),rgba(214,211,209,0.16)_44%,transparent_76%)]'
        )}
      />
    ))}
  </div>
);
