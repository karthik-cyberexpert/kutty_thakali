"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface AnimeCharacterSVGProps {
  characterColor?: string;
  expression?: 'default' | 'surprised' | 'anxious' | 'celebrating';
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

const AnimeCharacterSVG: React.FC<AnimeCharacterSVGProps> = ({
  characterColor = '#FFC0CB', // Default to pink
  expression = 'default',
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
  const charRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const char = charRef.current;
    if (!char) return;

    gsap.set(char, {
      x: initialX,
      y: initialY,
      rotation: rotation,
      scale: 0,
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
      }, '+=0.5');
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
        repeat: 3,
        duration: 0.3,
        ease: 'power1.inOut',
      }, '+=0.5');
    } else { // 'none' or default
      gsap.set(char, { x: targetX, y: targetY, scale: scale, opacity: 1 });
    }

  }, [initialX, initialY, targetX, targetY, rotation, scale, delay, duration, animationType, onComplete]);

  // SVG drawing logic based on expression
  const renderExpression = () => {
    switch (expression) {
      case 'surprised':
        return (
          <>
            <circle cx="30" cy="30" r="5" fill="black" /> {/* Left eye */}
            <circle cx="70" cy="30" r="5" fill="black" /> {/* Right eye */}
            <ellipse cx="50" cy="60" rx="10" ry="7" fill="black" /> {/* Surprised mouth */}
          </>
        );
      case 'anxious':
        return (
          <>
            <line x1="25" y1="30" x2="35" y2="30" stroke="black" strokeWidth="2" /> {/* Left eye */}
            <line x1="65" y1="30" x2="75" y2="30" stroke="black" strokeWidth="2" /> {/* Right eye */}
            <path d="M40 60 Q50 50 60 60" stroke="black" strokeWidth="2" fill="none" /> {/* Anxious mouth */}
          </>
        );
      case 'celebrating':
        return (
          <>
            <path d="M25 30 Q30 25 35 30" stroke="black" strokeWidth="2" fill="none" /> {/* Left eye (happy) */}
            <path d="M65 30 Q70 25 75 30" stroke="black" strokeWidth="2" fill="none" /> {/* Right eye (happy) */}
            <path d="M35 60 Q50 75 65 60" stroke="black" strokeWidth="2" fill="none" /> {/* Big smile */}
          </>
        );
      case 'default':
      default:
        return (
          <>
            <circle cx="30" cy="30" r="3" fill="black" /> {/* Left eye */}
            <circle cx="70" cy="30" r="3" fill="black" /> {/* Right eye */}
            <path d="M35 60 Q50 65 65 60" stroke="black" strokeWidth="2" fill="none" /> {/* Gentle smile */}
          </>
        );
    }
  };

  return (
    <div
      ref={charRef}
      className={cn("absolute z-40 pointer-events-none", className)}
      style={{
        width: '100px', // Default SVG viewport size
        height: '100px',
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="50" cy="45" r="40" fill={characterColor} stroke="black" strokeWidth="2" />
        {/* Cheeks (optional, for blush) */}
        <circle cx="25" cy="55" r="8" fill="#FFB6C1" opacity="0.7" />
        <circle cx="75" cy="55" r="8" fill="#FFB6C1" opacity="0.7" />
        {/* Hair (simple bangs) */}
        <path d="M10 40 Q30 10 50 15 T90 40 Z" fill={characterColor} stroke="black" strokeWidth="2" />
        {/* Eyes and Mouth based on expression */}
        {renderExpression()}
      </svg>
    </div>
  );
};

export default AnimeCharacterSVG;