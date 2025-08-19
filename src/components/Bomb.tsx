import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Bomb as BombIcon } from 'lucide-react';

interface BombProps {
  initialX: number;
  initialY: number;
  onBombClick: (position: { x: number; y: number }) => void;
}

const Bomb: React.FC<BombProps> = ({ initialX, initialY, onBombClick }) => {
  const bombRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bomb = bombRef.current;
    const message = messageRef.current;
    if (!bomb || !message) return;

    // Set initial position to where the gift box was
    gsap.set(bomb, {
      x: initialX,
      y: initialY,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0,
      zIndex: 50,
    });
    gsap.set(message, { opacity: 0, y: 20 });

    const tl = gsap.timeline();

    // Bomb flies out and lands
    tl.to(bomb, {
      scale: 1,
      opacity: 1,
      x: window.innerWidth / 2, // Land in the center of the screen
      y: window.innerHeight / 2,
      duration: 0.8,
      ease: 'back.out(1.7)',
    })
    // "Click Here" message appears
    .to(message, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.2');

  }, [initialX, initialY]);

  const handleClick = () => {
    const bomb = bombRef.current;
    const message = messageRef.current;
    if (!bomb || !message) return;

    // Hide message and bomb
    gsap.to(message, { opacity: 0, y: -20, duration: 0.3 });
    gsap.to(bomb, { opacity: 0, scale: 0.5, duration: 0.3, onComplete: () => {
        bomb.style.display = 'none';
        onBombClick({ x: bomb.getBoundingClientRect().left + bomb.getBoundingClientRect().width / 2, y: bomb.getBoundingClientRect().top + bomb.getBoundingClientRect().height / 2 });
    }});
  };

  return (
    <div
      ref={bombRef}
      className="absolute flex flex-col items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      <BombIcon size={100} className="text-gray-800 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }} />
      <div ref={messageRef} className="text-white text-2xl font-bold mt-2 animate-pulse">
        Click Here!
      </div>
    </div>
  );
};

export default Bomb;