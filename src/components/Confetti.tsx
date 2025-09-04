"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Confetti = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const numConfetti = 150;
  const colors = ['#FF69B4', '#87CEEB', '#FFD700', '#ADFF2F', '#FF4500', '#FFC0CB', '#ADD8E6', '#FFFF00', '#90EE90', '#FFA07A']; // Brighter, pastel anime colors
  const shapes = ['✨', '⭐', '💖', '🌸', '💫', '🌈', '🎵', '🎶']; // Anime-inspired shapes

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const confettiPieces = Array.from({ length: numConfetti }).map(() => {
      const piece = document.createElement('div');
      piece.style.position = 'absolute';
      piece.style.fontSize = `${gsap.utils.random(15, 35)}px`; // Use font size for emojis
      piece.innerText = gsap.utils.random(shapes); // Use anime shapes
      piece.style.opacity = '0';
      // No background color needed for emojis, but can add a subtle shadow
      piece.style.textShadow = `0 0 5px ${gsap.utils.random(colors)}`;
      container.appendChild(piece);
      return piece;
    });

    gsap.to(confettiPieces, {
      x: () => gsap.utils.random(-400, 400),
      y: () => gsap.utils.random(-400, 400),
      rotation: () => gsap.utils.random(0, 720),
      opacity: 1,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.005,
    });

    gsap.to(confettiPieces, {
      y: '+=500',
      opacity: 0,
      duration: 3,
      ease: 'power1.in',
      delay: 0.7,
      stagger: 0.01,
      onComplete: () => {
        confettiPieces.forEach(p => p.remove());
      }
    });
  }, []);

  return <div ref={containerRef} className="absolute inset-0 flex items-center justify-center" />;
};

export default Confetti;