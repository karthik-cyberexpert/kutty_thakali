"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Bomb as BombIcon } from 'lucide-react';

interface BombProps {
  initialX: number;
  initialY: number;
  onBombClick: (position: { x: number; y: number }) => void;
}

const Bomb: React.FC<BombProps> = ({ initialX, initialY, onBombClick }) => {
  const bombContainerRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bombContainer = bombContainerRef.current;
    const message = messageRef.current;
    if (!bombContainer || !message) return;

    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    gsap.set(bombContainer, {
      x: initialX - screenCenterX,
      y: initialY - screenCenterY,
      scale: 0,
      opacity: 0,
      zIndex: 50,
    });
    gsap.set(message, { opacity: 0, y: 20 });

    const tl = gsap.timeline();

    tl.to(bombContainer, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'back.out(1.7)',
    })
    .to(message, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.2');

  }, [initialX, initialY]);

  const handleClick = () => {
    const bombContainer = bombContainerRef.current;
    const message = messageRef.current;
    if (!bombContainer || !message) return;

    gsap.to(message, { opacity: 0, y: -20, duration: 0.3 });
    gsap.to(bombContainer, { opacity: 0, scale: 0.5, duration: 0.3, onComplete: () => {
        bombContainer.style.display = 'none';
        onBombClick({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }});
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div
        ref={bombContainerRef}
        className="flex flex-col items-center justify-center cursor-pointer"
        onClick={handleClick}
      >
        <BombIcon size={100} className="text-red-500 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 15px rgba(255,0,0,0.8))' }} /> {/* Red neon bomb */}
        <div ref={messageRef} className="text-cyan-400 text-2xl font-anime font-bold mt-2 animate-pulse drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]"> {/* Neon text */}
          Activate!
        </div>
      </div>
    </div>
  );
};

export default Bomb;