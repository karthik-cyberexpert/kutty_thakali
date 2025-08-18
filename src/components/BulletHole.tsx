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
      xPercent: -50, // Center the hole
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
      className="absolute w-32 h-32 rounded-full bg-black/70 border-4 border-purple-500 shadow-inner"
      style={{
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 30px rgba(128,0,128,0.7)',
        filter: 'blur(1px)',
        zIndex: 30,
      }}
    />
  );
};

export default BulletHole;