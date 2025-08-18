import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface BoyAndPaperAnimationProps {
  onComplete: () => void;
  onPaperCover: () => void;
}

const BoyAndPaperAnimation: React.FC<BoyAndPaperAnimationProps> = ({ onComplete, onPaperCover }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boyRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const boy = boyRef.current;
    const paper = paperRef.current;
    if (!boy || !paper) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Initial positions
    gsap.set(boy, { x: -100, y: screenHeight - 150 }); // Boy starts at bottom left, off-screen
    gsap.set(paper, { x: screenWidth / 2, y: screenHeight - 100, rotation: -75 }); // Paper on the "floor"

    const tl = gsap.timeline({ onComplete, delay: 1.5 }); // Delay to let burst happen

    // Boy walks to paper
    tl.to(boy, { x: screenWidth / 2 - 80, duration: 4, ease: 'none' })
      // Boy picks up paper
      .to(boy, { y: '+=10', duration: 0.2, yoyo: true, repeat: 1 }, '-=0.3')
      .to(paper, { y: screenHeight - 160, x: screenWidth / 2 - 60, rotation: 0, duration: 0.2 }, '<')
      // Boy turns and throws
      .to(boy, { x: '+=30', duration: 1 })
      .to(paper, { x: '+=30', duration: 1 }, '<')
      // Paper flies to screen
      .to(paper, {
        x: screenWidth / 2,
        y: screenHeight / 2,
        width: '110vw',
        height: '110vh',
        borderRadius: 0,
        rotation: 360,
        duration: 1.2,
        ease: 'power2.in',
        onComplete: onPaperCover, // Trigger when paper has FINISHED covering
      }, '-=0.5')
      // Paper falls down
      .to(paper, {
        y: screenHeight * 1.5,
        duration: 2,
        ease: 'power1.in'
      }, '+=0.5'); // Pause for a moment before falling

  }, [onComplete, onPaperCover]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div ref={boyRef} className="absolute text-8xl" style={{ transformOrigin: 'bottom center' }}>🚶‍♂️</div>
      <div 
        ref={paperRef} 
        className="absolute bg-white rounded-md shadow-2xl"
        style={{ width: '80px', height: '100px', transformOrigin: 'center center' }}
      />
    </div>
  );
};

export default BoyAndPaperAnimation;