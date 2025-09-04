"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface BulletHoleProps {
  x: number;
  y: number;
}

const BulletHole: React.FC<BulletHoleProps> = ({ x, y }) => {
  const holeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hole = holeRef.current;
    if (!hole) return;

    gsap.set(hole, {
      left: x,
      top: y,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0,
    });

    gsap.to(hole, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  }, [x, y]);

  return (
    <div
      ref={holeRef}
      className="absolute w-32 h-32 rounded-full bg-purple-800/70 border-4 border-cyan-500 shadow-inner" // Darker, techy colors
      style={{
        boxShadow: 'inset 0 0 20px rgba(0,255,255,0.8), 0 0 30px rgba(255,0,255,0.7)', // Cyan and magenta glow
        filter: 'blur(1px)',
        zIndex: 30,
      }}
    />
  );
};

export default BulletHole;