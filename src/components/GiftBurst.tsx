import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface GiftBurstProps {
  originX: number;
  originY: number;
}

const GiftBurst = ({ originX, originY }: GiftBurstProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const numParticles = 200;
  const particles = ['💖', '✨', '🎉', '🎂', '🎈', '⭐', '🎁', '🍰', '🎊', '❤️', '🥳'];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particleElements = Array.from({ length: numParticles }).map(() => {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.fontSize = `${gsap.utils.random(20, 50)}px`;
      particle.innerText = gsap.utils.random(particles);
      particle.style.opacity = '0';
      // Set initial position to the origin
      particle.style.left = `${originX}px`;
      particle.style.top = `${originY}px`;
      particle.style.transform = 'translate(-50%, -50%)'; // Center the particle on the origin
      container.appendChild(particle);
      return particle;
    });

    gsap.to(particleElements, {
      x: () => gsap.utils.random(-window.innerWidth / 2, window.innerWidth / 2), // Relative to origin
      y: () => gsap.utils.random(-window.innerHeight / 2, window.innerHeight / 2), // Relative to origin
      rotation: () => gsap.utils.random(0, 720),
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.005,
    });

    gsap.to(particleElements, {
      opacity: 0,
      duration: 1.5,
      ease: 'power1.in',
      delay: 1,
      onComplete: () => {
        particleElements.forEach(p => p.remove());
      }
    });
  }, [originX, originY]);

  return <div ref={containerRef} className="absolute inset-0 z-30 pointer-events-none" />;
};

export default GiftBurst;