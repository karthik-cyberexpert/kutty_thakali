"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface AnimeCharacterProps {
  src: string;
  alt: string;
  initialX?: string | number;
  initialY?: string | number;
  targetX?: string | number;
  targetY?: string | number;
  rotation?: number;
  scale?: number;
  delay?: number;
  duration?: number;
  animationType?: 'slideIn' | 'float' | 'wave' | 'popIn' | 'none';
  className?: string;
  onComplete?: () => void;
}

const AnimeCharacter: React.FC<AnimeCharacterProps> = ({
  src,
  alt,
  initialX = '100%',
  initialY = '100%',
  targetX = '50%',
  targetY = '50%',
  rotation = 0,
  scale = 1,
  delay = 0,
  duration = 1,
  animationType = 'slideIn',
  className,
  onComplete,
}) => {
  const charRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const char = charRef.current;
    if (!char) return;

    gsap.set(char, {
      x: initialX,
      y: initialY,
      rotation: rotation,
      scale: 0, // Start small for popIn, or 0 for slideIn
      opacity: 0,
      transformOrigin: 'center center',
    });

    const tl = gsap.timeline({ delay, onComplete });

    if (animationType === 'slideIn') {
      tl.to(char, {
        x: targetX,
        y: targetY,
        scale: scale,
        opacity: 1,
        duration: duration,
        ease: 'power2.out',
      });
    } else if (animationType === 'popIn') {
      tl.to(char, {
        scale: scale,
        opacity: 1,
        duration: duration,
        ease: 'back.out(1.7)',
      });
    } else if (animationType === 'float') {
      tl.to(char, {
        x: targetX,
        y: targetY,
        scale: scale,
        opacity: 1,
        duration: duration,
        ease: 'power2.out',
      })
      .to(char, {
        y: '+=20',
        yoyo: true,
        repeat: -1,
        duration: 2,
        ease: 'sine.inOut',
      }, '+=0.5'); // Start floating after initial entrance
    } else if (animationType === 'wave') {
      tl.to(char, {
        x: targetX,
        y: targetY,
        scale: scale,
        opacity: 1,
        duration: duration,
        ease: 'power2.out',
      })
      .to(char, {
        rotation: '+=15',
        yoyo: true,
        repeat: 3, // Wave 3 times
        duration: 0.3,
        ease: 'power1.inOut',
      }, '+=0.5');
    } else { // 'none' or default
      gsap.set(char, { x: targetX, y: targetY, scale: scale, opacity: 1 });
    }

  }, [initialX, initialY, targetX, targetY, rotation, scale, delay, duration, animationType, onComplete]);

  return (
    <img
      ref={charRef}
      src={src}
      alt={alt}
      className={cn("absolute z-40 pointer-events-none", className)}
      style={{
        width: '120px', // Default size, can be overridden by className
        height: 'auto',
      }}
    />
  );
};

export default AnimeCharacter;