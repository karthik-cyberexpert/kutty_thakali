"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface GiftBurstProps {
  originX: number;
  originY: number;
  fadeAway?: boolean;
  onFadeOutComplete?: () => void;
}

const GiftBurst = ({ originX, originY, fadeAway = false, onFadeOutComplete }: GiftBurstProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const numParticles = 200;
  const particles = [
    '✨', '⭐', '💫', '⚡', '💥', '🚀', '🌌', '👾', '🤖', '💎', '🔮', '⚛️', // Futuristic/anime items
    '💖', '🎉', '🎂', '🎈', '🎊', '❤️', '🥳' // Keep some celebratory
  ];
  const colors = ['#00FFFF', '#FF00FF', '#00FF00', '#FFFF00', '#FF69B4', '#87CEEB']; // Neon colors

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.killTweensOf(container.children);
    Array.from(container.children).forEach(child => child.remove());

    const particleElements = Array.from({ length: numParticles }).map(() => {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.fontSize = `${gsap.utils.random(20, 50)}px`;
      particle.innerText = gsap.utils.random(particles);
      particle.style.opacity = '0';
      particle.style.left = `${originX}px`;
      particle.style.top = `${originY}px`;
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.textShadow = `0 0 10px ${gsap.utils.random(colors)}, 0 0 20px ${gsap.utils.random(colors)}`; // Neon text shadow
      container.appendChild(particle);
      return particle;
    });

    gsap.to(particleElements, {
      x: () => gsap.utils.random(-window.innerWidth / 2, window.innerWidth / 2),
      y: () => gsap.utils.random(-window.innerHeight / 2, window.innerHeight / 2),
      rotation: () => gsap.utils.random(0, 720),
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.005,
    });

  }, [originX, originY]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !fadeAway) return;

    gsap.to(Array.from(container.children), {
      opacity: 0,
      duration: 1.5,
      ease: 'power1.in',
      onComplete: () => {
        Array.from(container.children).forEach(p => p.remove());
        onFadeOutComplete?.();
      }
    });
  }, [fadeAway, onFadeOutComplete]);

  return <div ref={containerRef} className="absolute inset-0 z-30 pointer-events-none" />;
};

export default GiftBurst;