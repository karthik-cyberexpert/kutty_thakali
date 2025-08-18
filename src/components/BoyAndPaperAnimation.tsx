import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface BoyAndPaperAnimationProps {
  onComplete: () => void;
  onPaperCover: () => void;
}

const BoyAndPaperAnimation: React.FC<BoyAndPaperAnimationProps> = ({ onComplete, onPaperCover }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Call onPaperCover immediately as the "transition" starts
    onPaperCover(); 

    gsap.timeline()
      .fromTo(overlay, 
        { opacity: 0, backgroundColor: 'rgba(255, 255, 255, 0)' }, 
        { opacity: 1, backgroundColor: 'rgba(255, 255, 255, 1)', duration: 0.5, ease: 'power2.in' }
      )
      .to(overlay, 
        { opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.5 }, // Stay white for a bit, then fade out
        "+=0.5" // Start fading out after 0.5s delay
      )
      .set(overlay, { display: 'none' }) // Hide completely after fade out
      .call(onComplete); // Call onComplete when the animation finishes
  }, [onComplete, onPaperCover]);

  return (
    <div 
      ref={overlayRef} 
      className="absolute inset-0 z-30" // Ensure it's on top during transition
      style={{ pointerEvents: 'none' }} // Allow clicks to pass through if needed
    />
  );
};

export default BoyAndPaperAnimation;