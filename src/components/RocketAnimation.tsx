import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Rocket } from 'lucide-react';

interface RocketAnimationProps {
  onReveal: () => void; // Callback when the text should be revealed
  onComplete: () => void; // Callback when rocket animation is fully done
}

const RocketAnimation: React.FC<RocketAnimationProps> = ({ onReveal, onComplete }) => {
  const rocketRef = useRef<HTMLDivElement>(null);
  const smokeContainerRef = useRef<HTMLDivElement>(null); // For individual smoke puffs

  useEffect(() => {
    const rocket = rocketRef.current;
    const smokeContainer = smokeContainerRef.current;
    if (!rocket || !smokeContainer) return;

    gsap.set(rocket, { y: window.innerHeight + 100, xPercent: -50, opacity: 0 });

    const tl = gsap.timeline({ onComplete: onComplete });

    tl.to(rocket, {
      y: -100, // Fly off screen top
      opacity: 1,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => {
        // Create smoke particles
        const smokeParticle = document.createElement('div');
        smokeParticle.className = 'absolute rounded-full bg-white/50'; // White smoke
        smokeParticle.style.width = `${gsap.utils.random(20, 50)}px`;
        smokeParticle.style.height = `${gsap.utils.random(20, 50)}px`;
        smokeParticle.style.left = `${rocket.offsetLeft + rocket.offsetWidth / 2 + gsap.utils.random(-20, 20)}px`;
        smokeParticle.style.top = `${rocket.offsetTop + rocket.offsetHeight / 2 + gsap.utils.random(0, 50)}px`;
        smokeContainer.appendChild(smokeParticle);

        gsap.to(smokeParticle, {
          scale: gsap.utils.random(1.5, 2.5),
          opacity: 0,
          y: '+=100', // Drift down
          x: '+=random(-50, 50)', // Drift sideways
          duration: gsap.utils.random(1, 2),
          ease: 'power1.out',
          onComplete: () => smokeParticle.remove(),
        });
      }
    });

    // Trigger reveal when rocket is roughly in the middle of the screen
    tl.call(onReveal, [], 1.5); // Call onReveal halfway through rocket animation
  }, [onReveal, onComplete]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden z-40 pointer-events-none">
      <div ref={smokeContainerRef} className="absolute inset-0" />
      <div ref={rocketRef} className="absolute text-8xl z-50">
        🚀
      </div>
    </div>
  );
};

export default RocketAnimation;