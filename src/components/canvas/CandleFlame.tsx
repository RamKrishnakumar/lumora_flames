import React, { useId, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import { flicker } from '../../lib/animations';

/**
 * Outer flame silhouette, in a `0 0 40 100` space.
 *
 * Traced from the shape of a real candle flame rather than approximated with a
 * rounded rectangle: a drawn-out point at the top, the widest bulge low at ~58%
 * of the height, and a narrow rounded collar at the bottom where the flame wraps
 * the wick. A `rounded-full` div — what this replaced — reads as a lozenge, and
 * the tapering tip is the single cue that makes the shape legible as fire.
 */
const FLAME_BODY =
  'M20 2 C 23.5 18, 31.5 36, 32 57 C 32.4 74, 28 90, 22.5 96 C 21.5 97.2, 18.5 97.2, 17.5 96 C 12 90, 7.6 74, 8 57 C 8.5 36, 16.5 18, 20 2 Z';

/**
 * The luminous inner cone — the same silhouette, shorter and sitting lower,
 * because a flame's brightest region starts above the wick and never reaches
 * the tip.
 */
const FLAME_CORE =
  'M20 26 C 22.5 38, 26.5 50, 26.5 66 C 26.5 79, 23.8 89, 20 91 C 16.2 89, 13.5 79, 13.5 66 C 13.5 50, 17.5 38, 20 26 Z';

/**
 * Seconds for one apparent turn of the flame.
 *
 * Deliberately unrelated to the vessel's 22s so the two never sync up — a flame
 * is a gas plume, not fixed to the wax, and matching periods would make the whole
 * candle look like one rigid object on a turntable. Faster, too: convection makes
 * a flame's interior churn much quicker than a jar can be rotated.
 */
const FLAME_TURN_DURATION = 7.5;

/**
 * How far the bright core drifts, in viewBox units either side of centre.
 *
 * Small on purpose. The core is the flame's hottest region, roughly on its axis;
 * it should look like it's orbiting *inside* the plume, so it must never approach
 * the body's edge — past about 4 units it stops reading as depth and starts
 * looking like the core has come loose.
 */
const CORE_ORBIT = 2.6;

/** Props for {@link CandleFlame}. */
export interface CandleFlameProps {
  /** Extra classes for the root. Set the flame's box here; defaults to `h-14 w-6`. */
  className?: string;
}

/**
 * CandleFlame draws a single candle flame: bloom, outer body, white-hot inner
 * cone, and the cool blue collar at the base where combustion runs hottest.
 *
 * ## Intensity is a CSS variable, not a prop
 *
 * The flame's size and brightness come from `--flame-intensity` (0 = out, 1 =
 * fully lit), read from an ancestor with a fallback of `1`. That is deliberate:
 * `HeroChamber` scrubs ignition against scroll position, and threading that
 * through React state would re-render the whole candle on every scroll frame.
 * A parent lights or snuffs this flame by writing the variable — usually on the
 * {@link InteractiveCandleCanvas} root, which seeds it from its `flameIntensity`
 * prop — and React never re-renders at all.
 *
 * Because intensity is applied through `.flame-rise` (a plain CSS `transform`)
 * while GSAP owns `.flame-flicker` and `.flame-sway`, the scroll-driven scale
 * and the looping flicker never fight over the same element's transform.
 *
 * ## Smoke lives elsewhere
 *
 * Blow-out smoke is {@link CandleSmoke}, rendered as a sibling *outside* this
 * component and outside the candle wrapper. It was nested here, which was tidier
 * and made the smoke invisible: an ancestor `transform` seals descendants into
 * its own paint slot, so wisps under the candle could never rise in front of the
 * headline. The parent that snuffs the flame owns both placing and playing them.
 *
 * With reduced motion preferred there is no flicker and no sway: the flame
 * renders as a still, lit shape.
 */
export const CandleFlame: React.FC<CandleFlameProps> = ({ className }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Gradient and filter ids must be unique per instance — `SubCategoryShowcase`
  // mounts two canvases at once, and duplicate ids would make one steal the
  // other's fills. Colons are stripped because `useId()` emits `:r1:`, which is
  // not a valid `url(#…)` fragment.
  const uid = useId().replace(/:/g, '');

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      // Two independent loops, because one tween can't look like fire. The fast
      // one is combustion noise; the slow one is the flame leaning in a draught.
      // Splitting them across two elements also keeps each tween owning a whole
      // transform, which is what lets `.flame-rise` hold the scroll-driven scale.
      flicker('.flame-flicker');

      gsap.to('.flame-sway', {
        skewX: 'random(-5, 5)',
        xPercent: 'random(-6, 6)',
        duration: 'random(1.1, 2.4)',
        repeat: -1,
        yoyo: true,
        repeatRefresh: true,
        ease: 'sine.inOut',
      });

      /*
       * Apparent rotation of the flame itself.
       *
       * The vessel can carry travelling highlights because it has a surface. A
       * flame doesn't — it's a translucent gas plume — so the cue has to come from
       * *inside*: the white-hot core orbits the plume's axis on the same
       * cylindrical projection the vessel uses (`sin` for position, `cos` for
       * foreshortening), which turns a flat silhouette into something with a
       * front and a back.
       *
       * Unlike the vessel there is no visibility term. A flame is translucent, so
       * the core stays visible as it passes round the far side — dimmer through
       * the intervening plume, never hidden. That's what `opacity` tracks here.
       *
       * The core is a `<path>` in a `0 0 40 100` viewBox, so `x` is in viewBox
       * units and `transformOrigin` has to be given explicitly — GSAP can't infer
       * a sensible box for a path the way it can for an HTML element.
       */
      const spin = { turns: 0 };

      gsap.to(spin, {
        turns: 1,
        duration: FLAME_TURN_DURATION,
        repeat: -1,
        ease: 'none',
        onUpdate: () => {
          const theta = spin.turns * Math.PI * 2;
          const facing = Math.cos(theta);

          gsap.set('.flame-core', {
            x: Math.sin(theta) * CORE_ORBIT,
            // Narrowest at the limbs, widest crossing the axis. `abs`, because a
            // core seen from behind is just as foreshortened as one in front.
            scaleX: 0.84 + Math.abs(facing) * 0.16,
            // Brightest facing the viewer, dimmed when it's behind the plume.
            opacity: 0.86 + facing * 0.14,
            transformOrigin: '50% 62%',
          });
        },
      });
    },
    { scope: rootRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn('pointer-events-none relative h-14 w-6', className)}
    >
      {/* Bloom — the flame's own halo, close and tight. The room-scale light
          pool is the parent's job; this is the light on the wax itself. */}
      <div
        className="absolute left-1/2 top-1/2 h-20 w-20 rounded-full bg-amber-400 blur-2xl"
        style={{
          opacity: 'calc(var(--flame-intensity, 1) * 0.5)',
          // Centring lives in the same declaration as the scale — a Tailwind
          // `-translate-x-1/2` would be overridden by this inline `transform`.
          transform: 'translate(-50%, -50%) scale(calc(0.5 + var(--flame-intensity, 1) * 0.5))',
        }}
      />

      {/* Ignition. Scales from the wick, so growing the flame lifts its tip
          rather than pushing it into the wax. */}
      <div
        className="relative h-full w-full origin-bottom"
        style={{
          transform: 'scale(var(--flame-intensity, 1))',
          opacity: 'var(--flame-intensity, 1)',
        }}
      >
        <div className="flame-sway h-full w-full origin-bottom">
          <div className="flame-flicker h-full w-full origin-bottom">
            <svg
              viewBox="0 0 40 100"
              preserveAspectRatio="none"
              className="h-full w-full overflow-visible"
            >
              <defs>
                {/* Amber only, plus a white-hot core. Orange would be the
                    physically obvious choice for the mantle and is exactly the
                    second accent hue the brand doesn't have. */}
                <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.75" />
                  <stop offset="28%" stopColor="#f59e0b" />
                  <stop offset="68%" stopColor="#f59e0b" />
                  <stop offset="88%" stopColor="#d97706" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                </linearGradient>

                <linearGradient id={`${uid}-core`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.45" />
                  <stop offset="38%" stopColor="#fffdf7" />
                  <stop offset="78%" stopColor="#fffbeb" stopOpacity="0.92" />
                  <stop offset="100%" stopColor="#fde68a" stopOpacity="0.3" />
                </linearGradient>

                <radialGradient id={`${uid}-base`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
                </radialGradient>

                {/* Generous filter regions: the default −10%/120% box clips a
                    blur this wide and leaves a visible straight edge. */}
                <filter id={`${uid}-soft`} x="-70%" y="-40%" width="240%" height="180%">
                  <feGaussianBlur stdDeviation="1.1" />
                </filter>
                <filter id={`${uid}-glowing`} x="-70%" y="-40%" width="240%" height="180%">
                  <feGaussianBlur stdDeviation="2.6" />
                </filter>
                <filter id={`${uid}-haze`} x="-120%" y="-120%" width="340%" height="340%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>

              {/* Cool blue collar, drawn under the body so the body's fading
                  bottom stops let it through. */}
              <ellipse
                cx="20"
                cy="84"
                rx="9"
                ry="13"
                fill={`url(#${uid}-base)`}
                filter={`url(#${uid}-haze)`}
              />

              <path d={FLAME_BODY} fill={`url(#${uid}-body)`} filter={`url(#${uid}-soft)`} />
              <path
                d={FLAME_CORE}
                className="flame-core"
                fill={`url(#${uid}-core)`}
                filter={`url(#${uid}-glowing)`}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
