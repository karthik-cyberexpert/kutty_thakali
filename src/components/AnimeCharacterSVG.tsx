"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface AnimeCharacterSVGProps {
  expression?: 'default' | 'surprised' | 'anxious' | 'celebrating';
  characterColor?: string;
  alt?: string;
  initialX?: string;
  initialY?: string;
  targetX?: string;
  targetY?: string;
  duration?: number;
  delay?: number;
  animationType?: 'float' | 'popIn' | 'slideIn' | 'wave';
  className?: string;
  style?: React.CSSProperties;
}

const AnimeCharacterSVG: React.FC<AnimeCharacterSVGProps> = ({
  expression = 'default',
  characterColor = '#00FFFF', // Default neon cyan
  alt = 'Anime Character',
  initialX = '0%',
  initialY = '0%',
  targetX = '0%',
  targetY = '0%',
  duration = 1,
  delay = 0,
  animationType = 'float',
  className,
  style,
}) => {
  const characterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const character = characterRef.current;
    if (!character) return;

    gsap.set(character, { x: initialX, y: initialY, opacity: 0, scale: 0.8 });

    let animationProps: gsap.TweenVars = {
      opacity: 1,
      scale: 1,
      x: targetX,
      y: targetY,
      duration: duration,
      delay: delay,
      ease: 'power2.out',
    };

    if (animationType === 'float') {
      animationProps = {
        ...animationProps,
        y: `${targetY} - 10px`,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      };
    } else if (animationType === 'popIn') {
      animationProps = {
        ...animationProps,
        scale: 1,
        ease: 'back.out(1.7)',
      };
    } else if (animationType === 'slideIn') {
      animationProps = {
        ...animationProps,
        x: targetX,
        ease: 'power2.out',
      };
    } else if (animationType === 'wave') {
      animationProps = {
        ...animationProps,
        rotation: '+=10',
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      };
    }

    gsap.to(character, animationProps);

  }, [initialX, initialY, targetX, targetY, duration, delay, animationType]);

  const getExpressionDetails = () => {
    switch (expression) {
      case 'surprised':
        return { eye: 'O', mouth: 'o' };
      case 'anxious':
        return { eye: '-', mouth: '~' };
      case 'celebrating':
        return { eye: '*', mouth: '^' };
      case 'default':
      default:
        return { eye: '.', mouth: '_' };
    }
  };

  const { eye, mouth } = getExpressionDetails();

  return (
    <div
      ref={characterRef}
      className={cn(
        "absolute z-40 pointer-events-none flex flex-col items-center justify-center",
        className
      )}
      style={{
        ...style,
        color: characterColor,
        textShadow: `0 0 10px ${characterColor}, 0 0 20px ${characterColor}80`,
      }}
      aria-label={alt}
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="currentColor"
        className="drop-shadow-lg"
      >
        {/* Head */}
        <circle cx="50" cy="50" r="40" fill="currentColor" />
        {/* Eyes */}
        <text x="35" y="45" fontSize="18" fill="black" textAnchor="middle" dominantBaseline="middle">{eye}</text>
        <text x="65" y="45" fontSize="18" fill="black" textAnchor="middle" dominantBaseline="middle">{eye}</text>
        {/* Mouth */}
        <text x="50" y="65" fontSize="18" fill="black" textAnchor="middle" dominantBaseline="middle">{mouth}</text>
        {/* Hair/Antenna (futuristic touch) */}
        <path d="M50 10 L40 0 L30 10 L50 15 Z" fill="currentColor" />
        <path d="M50 10 L60 0 L70 10 L50 15 Z" fill="currentColor" />
      </svg>
    </div>
  );
};

export default AnimeCharacterSVG;