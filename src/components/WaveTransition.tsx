"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface WaveTransitionProps {
  onComplete: () => void;
  onCover: () => void;
}

const WaveTransition: React.FC<WaveTransitionProps> = ({ onComplete, onCover }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);

  const NUM_STRIPS = 15;
  const STRIP_HEIGHT_VH = 100 / NUM_STRIPS;

  useEffect(() => {
    const strips = stripRefs.current.filter(Boolean) as HTMLDivElement[];
    const textElement = textRef.current;

    if (!containerRef.current || strips.length === 0 || !textElement) return;

    gsap.set(strips, { width: '0%', x: '0%' });
    gsap.set(textElement, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ onComplete: onComplete });

    strips.forEach((strip, i) => {
      const isLeftToRight = i % 2 === 0;
      if (isLeftToRight) {
        gsap.set(strip, { transformOrigin: 'left center' });
        tl.to(strip, { width: '100%', duration: 0.6, ease: 'power2.out' }, i * 0.05);
      } else {
        gsap.set(strip, { transformOrigin: 'right center', x: '100%' });
        tl.to(strip, { width: '100%', x: '0%', duration: 0.6, ease: 'power2.out' }, i * 0.05);
      }
    });

    tl.call(onCover, [], `+=${0.6 + (NUM_STRIPS - 1) * 0.05 - 0.2}`);

    tl.to(textElement, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '+=0.5');

    tl.to(textElement, { opacity: 0, y: -20, duration: 0.8, ease: 'power2.in' }, '+=2');

    strips.forEach((strip, i) => {
      const isLeftToRight = i % 2 === 0;
      if (isLeftToRight) {
        tl.to(strip, { width: '0%', duration: 0.6, ease: 'power2.in' }, '<');
      } else {
        tl.to(strip, { width: '0%', x: '100%', duration: 0.6, ease: 'power2.in' }, '<');
      }
    });

  }, [onComplete, onCover]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden z-35">
      {Array.from({ length: NUM_STRIPS }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-gradient-to-r from-red-400 via-yellow-300 via-green-400 via-blue-400 to-purple-400" // Brighter rainbow gradient
          style={{
            height: `${STRIP_HEIGHT_VH}vh`,
            top: `${i * STRIP_HEIGHT_VH}vh`,
            left: 0,
            width: '0%',
          }}
          ref={el => stripRefs.current[i] = el}
        />
      ))}
      <div ref={textRef} className="absolute inset-0 flex items-center justify-center text-center text-5xl md:text-7xl font-anime text-pink-500 z-40 drop-shadow-[0_0_15px_rgba(255,105,180,0.8)]"> {/* Anime font and pink color */}
        Happy Birthday Kutty Thakali
      </div>
    </div>
  );
};

export default WaveTransition;