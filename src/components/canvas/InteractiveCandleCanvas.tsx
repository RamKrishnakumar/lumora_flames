import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface InteractiveCandleCanvasProps {
  /** Flame intensity ratio from 0 (unlit) to 1 (fully lit). */
  flameIntensity: number;
  /** Accent color for wax & glow highlights. */
  accentColor?: string;
}

/**
 * InteractiveCandleCanvas renders a procedural, rotating 3D candle 
 * complete with dynamic flame glow and ambient light emissions.
 */
export const InteractiveCandleCanvas: React.FC<InteractiveCandleCanvasProps> = ({
  flameIntensity = 1,
  accentColor = '#f59e0b',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const candleBodyRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Continuous 360-degree rotation on Y-axis (Earth-like rotation)
    gsap.to(candleBodyRef.current, {
      rotateY: 360,
      duration: 18,
      repeat: -1,
      ease: 'none',
    });

    // Flickering flame effect when lit
    if (flameIntensity > 0) {
      gsap.to(flameRef.current, {
        scaleX: 'random(0.9, 1.15)',
        scaleY: 'random(0.95, 1.2)',
        opacity: 'random(0.85, 1)',
        duration: 0.15,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, { scope: containerRef, dependencies: [flameIntensity] });

  return (
    <div
      ref={containerRef}
      className="relative w-72 h-96 flex flex-col items-center justify-center [perspective:1000px]"
    >
      {/* Dynamic Ambient Flame Glow */}
      <div
        className="absolute w-80 h-80 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none"
        style={{
          backgroundColor: accentColor,
          opacity: flameIntensity * 0.35,
        }}
      />

      {/* 3D Candle Container */}
      <div
        ref={candleBodyRef}
        className="relative w-36 h-64 [transform-style:preserve-3d] flex flex-col items-center"
      >
        {/* Animated Flame */}
        <div
          ref={flameRef}
          className="relative w-6 h-12 -mb-2 z-20 transition-all duration-500"
          style={{
            transform: `scale(${flameIntensity})`,
            opacity: flameIntensity,
          }}
        >
          {/* Flame Core */}
          <div className="w-full h-full rounded-full bg-gradient-to-t from-amber-600 via-amber-400 to-amber-100 shadow-[0_0_20px_#f59e0b]" />
          {/* Inner Flame Blue Base */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-3 bg-blue-500 rounded-full blur-[1px]" />
        </div>

        {/* Candle Wick */}
        <div className="w-1 h-4 bg-stone-800 dark:bg-stone-200 z-10 rounded-t-full" />

        {/* Wax Cylinder Body */}
        <div className="relative w-full flex-grow bg-gradient-to-r from-stone-300 via-stone-100 to-stone-400 dark:from-stone-800 dark:via-stone-700 dark:to-stone-900 rounded-b-2xl border border-white/20 shadow-2xl overflow-hidden [transform:translateZ(10px)]">
          {/* Frosted Glass Highlight overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
          
          {/* Label Preview */}
          <div className="absolute inset-x-4 top-1/3 bg-stone-950/80 backdrop-blur-md p-3 rounded-lg border border-amber-500/30 text-center shadow-inner">
            <span className="text-[10px] font-semibold tracking-widest text-amber-400 uppercase block">
              Lumora
            </span>
            <span className="text-[9px] text-stone-300 font-light italic">
              Artisanal Blend
            </span>
          </div>
        </div>

        {/* Candle Base Reflection Shadow */}
        <div className="w-44 h-6 bg-black/40 blur-md rounded-full mt-2" />
      </div>
    </div>
  );
};