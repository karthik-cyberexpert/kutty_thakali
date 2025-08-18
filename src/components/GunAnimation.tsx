import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Target } from 'lucide-react';

interface GunAnimationProps {
  onShotComplete: (holePosition: { x: number; y: number }) => void;
}

const GunAnimation: React.FC<GunAnimationProps> = ({ onShotComplete }) => {
  const gunRef = useRef<HTMLDivElement>(null);
  const bulletRef = useRef<HTMLDivElement>(null);

  // Define the target position for the bullet hole (center-right of the screen)
  const holeTargetX = window.innerWidth * 0.75; // 75% from left for center-right
  const holeTargetY = window.innerHeight * 0.5; // 50% from top for vertical center

  useEffect(() => {
    const gun = gunRef.current;
    const bullet = bulletRef.current;
    if (!gun || !bullet) return;

    // Initial position for the gun (center-left, off-screen)
    gsap.set(gun, { x: -100, y: holeTargetY - 40, opacity: 0 }); // Centered vertically
    gsap.set(bullet, { opacity: 0, scale: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        onShotComplete({ x: holeTargetX, y: holeTargetY });
      },
    });

    tl.to(gun, { x: 50, opacity: 1, duration: 0.8, ease: 'power2.out' }) // Gun slides in
      .to(gun, { x: '+=20', duration: 0.1, yoyo: true, repeat: 1 }, '+=0.2') // Recoil effect
      .fromTo(bullet,
        { opacity: 1, scale: 0.5, backgroundColor: '#ff00ff' },
        {
          x: holeTargetX,
          y: holeTargetY,
          scale: 1,
          opacity: 0,
          duration: 0.4,
          ease: 'power1.in',
          onStart: () => {
            // Position bullet relative to gun before shooting
            const gunRect = gun.getBoundingClientRect();
            gsap.set(bullet, {
              x: gunRect.right - 20,
              y: gunRect.top + gunRect.height / 2,
              opacity: 1,
              scale: 0.5,
            });
          }
        }, '<') // Bullet shoots
      .to(gun, { opacity: 0, duration: 0.3 }, '-=0.1'); // Gun fades out quickly
  }, [onShotComplete, holeTargetX, holeTargetY]);

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      <div ref={gunRef} className="absolute text-7xl text-white">
        <Target size={80} />
      </div>
      <div
        ref={bulletRef}
        className="absolute w-4 h-4 rounded-full bg-white shadow-lg"
        style={{ boxShadow: '0 0 15px #ff00ff, 0 0 25px #ff00ff' }}
      />
    </div>
  );
};

export default GunAnimation;