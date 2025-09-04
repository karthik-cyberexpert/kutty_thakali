import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface GiftBurstProps {
  originX: number;
  originY: number;
  fadeAway?: boolean; // New prop to control fade out
  onFadeOutComplete?: () => void; // New callback for when fade out is complete
}

const GiftBurst = ({ originX, originY, fadeAway = false, onFadeOutComplete }: GiftBurstProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const numParticles = 200;
  const particles = [
    '💖', '✨', '🎉', '🎂', '🎈', '⭐', '🎁', '🍰', '🎊', '❤️', '🥳', // Existing
    '🌸', '🎀', '💫', '🌈', '🌟', '🎵', '🎶', '🍓', '🍦', '🍬', '🍩', '💖', '✨' // New anime-inspired items
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous particles if any to prevent duplicates on re-render
    gsap.killTweensOf(container.children);
    Array.from(container.children).forEach(child => child.remove());

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

    // Initial burst animation
    gsap.to(particleElements, {
      x: () => gsap.utils.random(-window.innerWidth / 2, window.innerWidth / 2), // Relative to origin
      y: () => gsap.utils.random(-window.innerHeight / 2, window.innerHeight / 2), // Relative to origin
      rotation: () => gsap.utils.random(0, 720),
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.005,
    });

    // Particles will now remain on screen until `fadeAway` is true
  }, [originX, originY]); // Re-run only if origin changes

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !fadeAway) return; // Only run if fadeAway is true

    // Fade out animation triggered by fadeAway prop
    gsap.to(Array.from(container.children), {
      opacity: 0,
      duration: 1.5,
      ease: 'power1.in',
      onComplete: () => {
        Array.from(container.children).forEach(p => p.remove());
        onFadeOutComplete?.(); // Call onFadeOutComplete when particles are removed
      }
    });
  }, [fadeAway, onFadeOutComplete]); // Re-run when fadeAway changes or onFadeOutComplete changes

  return <div ref={containerRef} className="absolute inset-0 z-30 pointer-events-none" />;
};

export default GiftBurst;