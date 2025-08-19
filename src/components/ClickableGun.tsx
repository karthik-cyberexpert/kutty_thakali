import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
// Removed import for Target icon

interface ClickableGunProps {
  onGunClick: () => void;
  holePosition: { x: number; y: number };
}

const ClickableGun: React.FC<ClickableGunProps> = ({ onGunClick, holePosition }) => {
  const gunRef = useRef<HTMLDivElement>(null);
  const bulletRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gun = gunRef.current;
    if (!gun) return;

    // Initial position for the gun (center-left, off-screen)
    gsap.set(gun, { x: -100, y: window.innerHeight * 0.5 - 40, opacity: 0 }); // Centered vertically
    gsap.to(gun, { x: 50, opacity: 1, duration: 0.8, ease: 'power2.out' }); // Gun slides in
  }, []);

  const handleClick = () => {
    const gun = gunRef.current;
    const bullet = bulletRef.current;
    if (!gun || !bullet) return;

    // Disable clicks during animation
    gun.style.pointerEvents = 'none';

    const tl = gsap.timeline({
      onComplete: () => {
        gun.style.pointerEvents = 'auto'; // Re-enable clicks
        onGunClick(); // Notify parent that a shot occurred
      },
    });

    // Recoil effect
    tl.to(gun, { x: '+=20', duration: 0.1, yoyo: true, repeat: 1 }, 0);

    // Bullet animation
    const gunRect = gun.getBoundingClientRect();
    gsap.set(bullet, {
      x: gunRect.right - 20, // Position bullet near the gun's barrel
      y: gunRect.top + gunRect.height / 2,
      opacity: 1,
      scale: 0.5,
      backgroundColor: '#ff00ff',
    });

    tl.to(bullet, {
      x: holePosition.x,
      y: holePosition.y,
      scale: 1,
      opacity: 0,
      duration: 0.4,
      ease: 'power1.in',
    }, 0); // Start bullet animation at the same time as recoil

  };

  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-start">
      <div ref={gunRef} onClick={handleClick} className="relative text-white cursor-pointer pointer-events-auto">
        {/* Pistol SVG */}
        <svg
          width="120"
          height="80"
          viewBox="0 0 120 80"
          fill="currentColor"
          className="drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' }}
        >
          {/* Barrel */}
          <rect x="0" y="25" width="80" height="15" rx="5" ry="5" />
          {/* Body */}
          <path d="M60 25 L100 25 L110 40 L60 40 Z" />
          {/* Handle */}
          <path d="M60 40 L65 75 L90 75 L85 40 Z" />
          {/* Trigger guard */}
          <path d="M60 40 Q55 45 60 50 L65 50 L60 40 Z" />
          {/* Trigger */}
          <rect x="60" y="45" width="5" height="10" rx="2" ry="2" />
          {/* Sight */}
          <rect x="70" y="20" width="5" height="5" rx="2" ry="2" />
        </svg>
        <div
          ref={bulletRef}
          className="absolute w-4 h-4 rounded-full bg-white shadow-lg"
          style={{ boxShadow: '0 0 15px #ff00ff, 0 0 25px #ff00ff', opacity: 0 }}
        />
      </div>
    </div>
  );
};

export default ClickableGun;