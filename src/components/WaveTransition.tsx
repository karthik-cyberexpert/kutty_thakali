import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface WaveTransitionProps {
  onComplete: () => void;
  onCover: () => void; // Callback when the wave fully covers the screen
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

    // Initial state for strips and text
    gsap.set(strips, { width: '0%', x: '0%' });
    gsap.set(textElement, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ onComplete: onComplete });

    // Phase 1: Wave covers the screen
    strips.forEach((strip, i) => {
      const isLeftToRight = i % 2 === 0;
      if (isLeftToRight) {
        gsap.set(strip, { transformOrigin: 'left center' });
        tl.to(strip, { width: '100%', duration: 0.6, ease: 'power2.out' }, i * 0.05); // Staggered entry
      } else {
        gsap.set(strip, { transformOrigin: 'right center', x: '100%' });
        tl.to(strip, { width: '100%', x: '0%', duration: 0.6, ease: 'power2.out' }, i * 0.05); // Staggered entry
      }
    });

    // Call onCover when the screen is fully covered by the wave
    tl.call(onCover, [], `+=${0.6 + (NUM_STRIPS - 1) * 0.05 - 0.2}`); // Adjust timing to be when fully covered

    // Phase 2: Text appears
    tl.to(textElement, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '+=0.5'); // Appear after wave covers

    // Phase 3: Wave and text disappear
    tl.to(textElement, { opacity: 0, y: -20, duration: 0.8, ease: 'power2.in' }, '+=2'); // Text fades out after a delay

    strips.forEach((strip, i) => {
      const isLeftToRight = i % 2 === 0;
      if (isLeftToRight) {
        tl.to(strip, { width: '0%', duration: 0.6, ease: 'power2.in' }, '<'); // Staggered exit
      } else {
        tl.to(strip, { width: '0%', x: '100%', duration: 0.6, ease: 'power2.in' }, '<'); // Staggered exit
      }
    });

  }, [onComplete, onCover]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden z-35">
      {Array.from({ length: NUM_STRIPS }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-gradient-to-r from-blue-500 to-blue-700" // Changed from bg-white to blue gradient
          style={{
            height: `${STRIP_HEIGHT_VH}vh`,
            top: `${i * STRIP_HEIGHT_VH}vh`,
            left: 0,
            width: '0%', // Start hidden
          }}
          ref={el => stripRefs.current[i] = el}
        />
      ))}
      <div ref={textRef} className="absolute inset-0 flex items-center justify-center text-center text-5xl md:text-7xl font-script text-purple-800 z-40">
        Happy Birthday Kutty Thakali
      </div>
    </div>
  );
};

export default WaveTransition;