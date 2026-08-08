import gsap from 'gsap';

/**
 * Shared GSAP vocabulary for Lumora Flames.
 *
 * Motion is part of the brand, so the easings and durations that define it live
 * here rather than being retyped per component. Import these instead of
 * hand-writing `ease: 'power3.out', duration: 0.8` a seventh time.
 *
 * These are plain helpers, not hooks — always call them inside a `useGSAP`
 * callback so GSAP's context handles cleanup.
 */

/** Signature easings. Entrances lead with `enter`; ambient loops use `ambient`. */
export const EASE = {
  /** Entrances and reveals — the house easing. */
  enter: 'power3.out',
  /** Exits and dismissals; snappier than `enter` so closing feels decisive. */
  exit: 'power2.in',
  /** Ambient, looping motion (glow drift, flicker, breathing). */
  ambient: 'sine.inOut',
  /** Scrubbed scroll motion. Linear, because scroll position is the timing. */
  scrub: 'none',
} as const;

/** Canonical durations in seconds. */
export const DURATION = {
  /** Micro-interactions: hover, tap, colour shifts. */
  fast: 0.3,
  /** Standard element entrance. */
  base: 0.6,
  /** Headline and hero reveals. */
  slow: 0.9,
} as const;

/** Stagger step between siblings in a group reveal. */
export const STAGGER = 0.09;

/**
 * A vertical fade-up reveal — the default entrance for most elements.
 *
 * @param targets Anything GSAP accepts: selector string, element, or array.
 * @param options.y Travel distance in px. Larger for bigger elements.
 * @param options.delay Seconds to wait before starting.
 * @param options.stagger Per-sibling offset; pass `0` to move as one block.
 * @returns The tween, so callers can position it on a parent timeline.
 */
export function revealUp(
  targets: gsap.TweenTarget,
  { y = 28, delay = 0, stagger = STAGGER }: { y?: number; delay?: number; stagger?: number } = {}
) {
  return gsap.fromTo(
    targets,
    { y, opacity: 0 },
    { y: 0, opacity: 1, duration: DURATION.base, delay, stagger, ease: EASE.enter }
  );
}

/**
 * Reveals text by wiping a clip-path from one edge, as though light crossed it.
 * Reads as more crafted than a plain fade for display type.
 *
 * @param targets Elements to wipe in.
 * @param direction Edge the wipe originates from.
 */
export function wipeIn(targets: gsap.TweenTarget, direction: 'left' | 'bottom' = 'left') {
  const hidden =
    direction === 'left'
      ? 'polygon(0 0, 0 0, 0 100%, 0 100%)'
      : 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)';

  return gsap.fromTo(
    targets,
    { clipPath: hidden, opacity: 0 },
    {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      opacity: 1,
      duration: DURATION.slow,
      ease: EASE.enter,
    }
  );
}

/**
 * Slow Ken Burns drift for a background photograph. Runs forever, so it belongs
 * on decorative imagery only and must be gated behind reduced-motion.
 *
 * @param target The image element.
 * @param scale Peak scale at the end of the drift.
 */
export function kenBurns(target: gsap.TweenTarget, scale = 1.08) {
  return gsap.to(target, {
    scale,
    duration: 12,
    repeat: -1,
    yoyo: true,
    ease: EASE.ambient,
  });
}

/**
 * Candle-flame flicker: short randomised yoyo on scale and opacity.
 * The randomised values re-evaluate per repeat, so it never visibly loops.
 *
 * @param target The flame element.
 */
export function flicker(target: gsap.TweenTarget) {
  return gsap.to(target, {
    scaleX: 'random(0.9, 1.12)',
    scaleY: 'random(0.94, 1.2)',
    opacity: 'random(0.85, 1)',
    duration: 0.16,
    repeat: -1,
    yoyo: true,
    repeatRefresh: true,
    ease: 'power1.inOut',
  });
}

/**
 * Clears inline transforms and opacity that an animation would otherwise have
 * left applied. Call this in the reduced-motion branch of a `useGSAP` callback
 * so elements render in their natural final state instead of mid-tween.
 *
 * @param targets Elements to reset.
 */
export function settleInstantly(targets: gsap.TweenTarget) {
  gsap.set(targets, { clearProps: 'all' });
}
