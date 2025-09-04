import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Bomb as BombIcon } from 'lucide-react';

interface BombProps {
  initialX: number;
  initialY: number;
  onBombClick: (position: { x: number; y: number }) => void;
}

const Bomb: React.FC<BombProps> = ({ initialX, initialY, onBombClick }) => {
  const bombContainerRef = useRef<HTMLDivElement>(null); // This will be the centered element
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bombContainer = bombContainerRef.current;
    const message = messageRef.current;
    if (!bombContainer || !message) return;

    // Calculate the center of the screen
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    // Set initial position for the bombContainer (which holds the icon and text)
    // It starts at the initialX, initialY, then animates to the center (0,0 relative to its flex parent)
    gsap.set(bombContainer, {
      x: initialX - screenCenterX, // Calculate offset from screen center
      y: initialY - screenCenterY, // Calculate offset from screen center
      scale: 0,
      opacity: 0,
      zIndex: 50,
    });
    gsap.set(message, { opacity: 0, y: 20 });

    const tl = gsap.timeline();

    // Bomb flies out and lands in the center of the screen
    tl.to(bombContainer, {
      x: 0, // Animate to 0,0 relative to its flex-centered parent
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'back.out(1.7)',
    })
    // "Click Here" message appears
    .to(message, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.2');

  }, [initialX, initialY]);

  const handleClick = () => {
    const bombContainer = bombContainerRef.current;
    const message = messageRef.current;
    if (!bombContainer || !message) return;

    // Hide message and bomb
    gsap.to(message, { opacity: 0, y: -20, duration: 0.3 });
    gsap.to(bombContainer, { opacity: 0, scale: 0.5, duration: 0.3, onComplete: () => {
        bombContainer.style.display = 'none';
        // Pass the current center of the screen as the explosion origin
        onBombClick({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }});
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50"> {/* Full screen overlay, centers content */}
      <div
        ref={bombContainerRef} // This div now holds the bomb icon and text
        className="flex flex-col items-center justify-center cursor-pointer"
        onClick={handleClick}
      >
        <BombIcon size={100} className="text-gray-800 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }} />
        <div ref={messageRef} className="text-white text-2xl font-bold mt-2 animate-pulse">
          Click Here!
        </div>
      </div>
    </div>
  );
};

export default Bomb;