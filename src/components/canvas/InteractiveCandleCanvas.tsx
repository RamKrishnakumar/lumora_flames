import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { CandleVessel, CandleVisual } from '../../types/category';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import { flicker } from '../../lib/animations';

/**
 * Geometry per vessel silhouette. Colour is never set here — it comes from the
 * subcategory's `CandleVisual`, so a new wax tone never requires touching this
 * table, and a new silhouette never requires touching the data.
 */
const VESSEL_GEOMETRY: Record<
  CandleVessel,
  {
    /** Body dimensions and corner treatment. */
    body: string;
    /** Whether to draw a glass rim (containers) or leave the wax exposed. */
    hasRim: boolean;
    /** Width of the cast-shadow ellipse beneath the candle. */
    shadow: string;
  }
> = {
  jar: { body: 'w-36 h-56 rounded-b-2xl rounded-t-lg', hasRim: true, shadow: 'w-40' },
  pillar: { body: 'w-24 h-64 rounded-md', hasRim: false, shadow: 'w-28' },
  // Wide and shallow, like a brass urli floating on water.
  urli: { body: 'w-52 h-24 rounded-b-[50%] rounded-t-lg', hasRim: true, shadow: 'w-52' },
  // Asymmetric radii read as hand-shaped rather than machine-poured.
  sculpture: {
    body: 'w-40 h-44 rounded-[42%_58%_45%_55%/55%_42%_58%_45%]',
    hasRim: false,
    shadow: 'w-40',
  },
  // A supply vessel: squat, wide-mouthed, holding loose material.
  raw: { body: 'w-40 h-40 rounded-b-xl rounded-t-sm', hasRim: true, shadow: 'w-44' },
};

/** Neutral jar used when a subcategory has no `visual` authored yet. */
const FALLBACK_VISUAL: CandleVisual = {
  vessel: 'jar',
  waxFrom: '#f1ece2',
  waxTo: '#c9bda9',
  labelNote: 'Artisanal Blend',
};

/** Props for {@link InteractiveCandleCanvas}. */
export interface InteractiveCandleCanvasProps {
  /** Flame intensity ratio from 0 (unlit) to 1 (fully lit). */
  flameIntensity: number;
  /**
   * Which candle to render. Omit to fall back to a neutral jar, so the canvas is
   * safe to mount before a subcategory's visual has been authored.
   */
  visual?: CandleVisual;
  /** Label headline — typically the subcategory name. */
  label?: string;
  /** Accent colour for the flame glow. Defaults to brand amber. */
  accentColor?: string;
}

/**
 * InteractiveCandleCanvas renders a procedural candle that reflects the
 * subcategory currently in view: silhouette, wax tone, and label all come from
 * the supplied {@link CandleVisual}, so scrolling through a collection morphs
 * one candle into the next rather than repeating a single generic prop.
 *
 * Built from CSS gradients and transforms — no WebGL, no 3D library. Wax colours
 * are injected inline because they are per-item data, not a finite set Tailwind
 * could pre-generate.
 *
 * Rotation and flicker loop forever, so both are gated behind
 * `useReducedMotion()`; with motion reduced the candle renders lit and still.
 */
export const InteractiveCandleCanvas: React.FC<InteractiveCandleCanvasProps> = ({
  flameIntensity = 1,
  visual,
  label = 'Lumora',
  accentColor = '#f59e0b',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const candleBodyRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const bodyShapeRef = useRef<HTMLDivElement>(null);

  const resolved = visual ?? FALLBACK_VISUAL;
  const geometry = VESSEL_GEOMETRY[resolved.vessel];
  const prefersReducedMotion = useReducedMotion();

  // Ambient rotation + flame flicker.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.to(candleBodyRef.current, {
        rotateY: 360,
        duration: 22,
        repeat: -1,
        ease: 'none',
      });

      if (flameIntensity > 0) flicker(flameRef.current);
    },
    { scope: containerRef, dependencies: [flameIntensity, prefersReducedMotion] }
  );

  // Morph when the active subcategory changes. Tweening scale rather than
  // swapping instantly is what makes this read as one candle reshaping itself.
  useGSAP(
    () => {
      if (prefersReducedMotion || !bodyShapeRef.current) return;

      gsap.fromTo(
        bodyShapeRef.current,
        { scaleY: 0.86, scaleX: 1.08, opacity: 0.4 },
        { scaleY: 1, scaleX: 1, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );
    },
    { scope: containerRef, dependencies: [resolved.vessel, resolved.waxFrom, prefersReducedMotion] }
  );

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`Illustration of a ${resolved.vessel} candle: ${label}`}
      className="relative flex h-80 w-64 items-center justify-center sm:h-96 sm:w-72 [perspective:1000px]"
    >
      {/* Flame glow. Oversized and blurred so it reads as cast light. */}
      <div
        className="pointer-events-none absolute h-72 w-72 rounded-full blur-3xl transition-opacity duration-700"
        style={{ backgroundColor: accentColor, opacity: flameIntensity * 0.35 }}
      />

      <div ref={candleBodyRef} className="relative flex flex-col items-center [transform-style:preserve-3d]">
        {/* Flame */}
        <div
          ref={flameRef}
          className="relative z-20 -mb-1 h-10 w-5 transition-all duration-500"
          style={{ transform: `scale(${flameIntensity})`, opacity: flameIntensity }}
        >
          <div className="h-full w-full rounded-full bg-gradient-to-t from-amber-600 via-amber-400 to-amber-100 shadow-[0_0_20px_#f59e0b]" />
          {/* Cooler base, where combustion runs hottest. */}
          <div className="absolute bottom-0 left-1/2 h-2.5 w-1.5 -translate-x-1/2 rounded-full bg-sky-400/70 blur-[1px]" />
        </div>

        {/* Wick */}
        <div className="z-10 h-3.5 w-[3px] rounded-t-full bg-stone-800 dark:bg-stone-300" />

        {/* Vessel body */}
        <div
          ref={bodyShapeRef}
          className={cn(
            'relative overflow-hidden border border-white/30 shadow-2xl [transform:translateZ(10px)]',
            geometry.body
          )}
          style={{ backgroundImage: `linear-gradient(105deg, ${resolved.waxFrom}, ${resolved.waxTo})` }}
        >
          {/* Specular sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent" />

          {/* Glass rim, container-style vessels only. */}
          {geometry.hasRim && (
            <div className="absolute inset-x-0 top-0 h-2.5 border-b border-white/40 bg-white/25" />
          )}

          {/* Granulated fill, for the raw-materials vessel. */}
          {resolved.vessel === 'raw' && (
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.5)_1px,transparent_1.5px)] bg-[length:7px_7px] opacity-70" />
          )}

          {/* Label. Suppressed on urli and sculpture, whose form *is* the
              product — a paper label would fight the silhouette. */}
          {resolved.vessel !== 'urli' && resolved.vessel !== 'sculpture' && (
            <div className="absolute inset-x-3 top-1/3 rounded-lg border border-amber-500/30 bg-stone-950/80 p-2.5 text-center shadow-inner backdrop-blur-md">
              <span className="block truncate text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                {label}
              </span>
              <span className="block truncate text-[9px] font-light italic text-stone-300">
                {resolved.labelNote}
              </span>
            </div>
          )}
        </div>

        {/* Cast shadow */}
        <div className={cn('mt-2 h-5 rounded-full bg-black/40 blur-md', geometry.shadow)} />
      </div>
    </div>
  );
};
