import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * AmbientFlameGlow adds floating ambient light orbs in the background
 * with soft GSAP timeline physics.
 */
export const AmbientFlameGlow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const bubbles = gsap.utils.toArray<HTMLElement>('.ambient-orb');

    bubbles.forEach((orb) => {
      gsap.to(orb, {
        x: 'random(-60, 60)',
        y: 'random(-60, 60)',
        scale: 'random(0.85, 1.25)',
        duration: 'random(6, 12)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40 dark:opacity-25"
    >
      <div className="ambient-orb absolute top-1/4 left-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="ambient-orb absolute bottom-1/3 right-12 w-[30rem] h-[30rem] bg-orange-500/15 rounded-full blur-3xl" />
    </div>
  );
};