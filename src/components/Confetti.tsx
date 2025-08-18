import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Confetti = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const numConfetti = 150;
  const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#ff00ff', '#00ffff'];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const confettiPieces = Array.from({ length: numConfetti }).map(() => {
      const piece = document.createElement('div');
      piece.style.position = 'absolute';
      piece.style.width = `${gsap.utils.random(5, 15)}px`;
      piece.style.height = `${gsap.utils.random(5, 20)}px`;
      piece.style.backgroundColor = gsap.utils.random(colors);
      piece.style.opacity = '0';
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