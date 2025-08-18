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
    // Boy starts off-screen left, at the bottom
    gsap.set(boy, { x: -150, y: screenHeight - 150 }); 
    // Paper starts on the "floor" near the center, slightly rotated, and visible
    gsap.set(paper, { x: screenWidth / 2 - 40, y: screenHeight - 100, rotation: -75, opacity: 1 }); 

    const tl = gsap.timeline({ onComplete, delay: 1.5 }); // Delay to let burst happen

    // Boy walks to paper
    tl.to(boy, { x: screenWidth / 2 - 120, duration: 3, ease: 'none' }) // Boy walks to the left of the paper
      // Boy picks up paper (slight bounce, paper moves with boy)
      .to(boy, { y: '+=10', duration: 0.2, yoyo: true, repeat: 1 }, '-=0.3')
      .to(paper, { y: screenHeight - 160, x: screenWidth / 2 - 100, rotation: 0, duration: 0.2 }, '<') // Paper moves up and aligns with boy's hand
      // Boy turns and throws (boy moves slightly, paper moves with boy)
      .to(boy, { x: '+=30', duration: 0.5 }, '+=0.2') // Boy shifts slightly
      .to(paper, { x: '+=30', duration: 0.5 }, '<') // Paper shifts with boy
      // Paper flies to screen and covers it
      .to(paper, {
        x: '50vw', // Move center to 50% viewport width
        y: '50vh', // Move center to 50% viewport height
        xPercent: -50, // Adjust for element's own width to truly center
        yPercent: -50, // Adjust for element's own height to truly center
        width: '300vw', // Ensure it covers more than 100%
        height: '300vh', // Ensure it covers more than 100%
        borderRadius: 0,
        rotation: 720, // More rotation for dramatic effect
        duration: 1.0, // Slightly faster flight to cover quickly
        ease: 'power2.in',
        opacity: 1, // Explicitly ensure opacity is 1 during cover
        onComplete: onPaperCover, // Trigger when paper has FINISHED covering
      }, '+=0.2') // Slight delay after boy throws
      // Paper falls down slowly
      .to(paper, {
        y: screenHeight * 1.5, // Fall far off-screen
        duration: 3.5, // Slower fall to reveal PhotoTrain more gradually
        ease: 'none', // Changed to 'none' for consistent speed
        opacity: 1 // Explicitly keep opacity at 1
      }, '+=0.5'); // Pause for a moment after covering before falling
  }, [onComplete, onPaperCover]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div ref={boyRef} className="absolute text-8xl" style={{ transformOrigin: 'bottom center' }}>🚶‍♂️</div>
      <div 
        ref={paperRef} 
        className="absolute bg-white rounded-md shadow-2xl"
        style={{ 
          width: '80px', 
          height: '100px', 
          transformOrigin: 'center center',
          zIndex: 100 // Ensure paper is on top
        }}
      />
    </div>
  );
};

export default BoyAndPaperAnimation;