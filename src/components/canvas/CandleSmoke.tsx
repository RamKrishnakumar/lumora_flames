import React from 'react';
import { cn } from '../../lib/utils';

/** Number of wisps rendered for the extinguish beat. */
const SMOKE_WISPS = 3;

/** Props for {@link CandleSmoke}. */
export interface CandleSmokeProps {
  /** Extra classes for the anchor node — position the wick here. */
  className?: string;
}

/**
 * CandleSmoke renders the wisps that rise when a candle is blown out, inert at
 * `opacity: 0` until a parent plays them.
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
 * wick and match the candle's scale. `HeroChamber` measures the flame once and on
 * every `ScrollTrigger` refresh; see its `placeSmoke`.
 *
 * ## Why the wisps are not blurred
 *
 * A `blur()` filter was doing the softening, and it cost the smoke its legibility
 * — a 3px blur over a 4px-wide wisp is mostly blur. The softness is authored into
 * the fill instead: a vertical gradient fades each wisp out at both ends, so it
 * has no hard cap where it leaves the wick and no hard tip as it dissipates,
 * while the body of it stays fully opaque. No filter also means no per-frame
 * filter pass on three elements that are being scaled 2–3× as they rise.
 *
 * @example
 * <CandleSmoke className="absolute left-0 top-0 z-30" />
 */
export const CandleSmoke: React.FC<CandleSmokeProps> = ({ className }) => (
  <div aria-hidden="true" className={cn('pointer-events-none h-0 w-0', className)}>
    {Array.from({ length: SMOKE_WISPS }, (_, index) => (
      <span
        key={index}
        // Centred by a negative margin, not `-translate-x-1/2`: GSAP replaces the
        // whole `transform` when it animates `x`, so a Tailwind translate on the
        // same element would be silently dropped the moment the smoke moves.
        //
        // `bottom-0` puts each wisp's base on the anchor's own origin, which the
        // caller has placed at the wick tip. GSAP owns the visible opacity.
        className={cn(
          'flame-smoke absolute bottom-0 left-0 -ml-[3px] h-8 w-1.5 origin-bottom rounded-full opacity-0',
          'bg-[linear-gradient(to_top,rgba(68,64,60,0)_0%,rgba(68,64,60,0.92)_26%,rgba(87,83,78,0.8)_72%,rgba(87,83,78,0)_100%)]',
          'dark:bg-[linear-gradient(to_top,rgba(231,229,228,0)_0%,rgba(231,229,228,0.95)_26%,rgba(214,211,209,0.82)_72%,rgba(214,211,209,0)_100%)]'
        )}
      />
    ))}
  </div>
);
