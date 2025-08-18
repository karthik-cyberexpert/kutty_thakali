import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface BoyAndPaperAnimationProps {
  onComplete: () => void;
  onPaperCover: () => void;
}

const BoyAndPaperAnimation: React.FC<BoyAndPaperAnimationProps> = ({ onComplete, onPaperCover }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boyRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null); // For the initial paper that flies
  const wipeStripRefs = useRef<(HTMLDivElement | null)[]>([]); // For the wiping strips
  const [showWipeStrips, setShowWipeStrips] = useState(false);

  const NUM_STRIPS = 15;
  const STRIP_HEIGHT_VH = 100 / NUM_STRIPS;

  useEffect(() => {
    const boy = boyRef.current;
    const paper = paperRef.current;
    if (!boy || !paper) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Initial positions
    gsap.set(boy, { x: -150, y: screenHeight - 150 }); 
    gsap.set(paper, { x: screenWidth / 2 - 40, y: screenHeight - 100, rotation: -75, opacity: 1 }); 

    const tl = gsap.timeline({ delay: 1.5 }); // Delay to let burst happen

    // Boy walks to paper
    tl.to(boy, { x: screenWidth / 2 - 120, duration: 3, ease: 'none' })
      .to(boy, { y: '+=10', duration: 0.2, yoyo: true, repeat: 1 }, '-=0.3')
      .to(paper, { y: screenHeight - 160, x: screenWidth / 2 - 100, rotation: 0, duration: 0.2 }, '<')
      .to(boy, { x: '+=30', duration: 0.5 }, '+=0.2')
      .to(paper, { x: '+=30', duration: 0.5 }, '<')
      // Paper flies to screen and covers it
      .to(paper, {
        x: '50vw',
        y: '50vh',
        xPercent: -50,
        yPercent: -50,
        width: '300vw',
        height: '300vh',
        borderRadius: 0,
        rotation: 720,
        duration: 1.0,
        ease: 'power2.in',
        opacity: 1,
        onComplete: () => {
          onPaperCover(); // Screen is now fully covered by the paper
          setShowWipeStrips(true); // Trigger rendering of wipe strips
          gsap.set(paper, { opacity: 0, display: 'none' }); // Hide the original paper immediately
          
          // Start the wiping animation
          const wipeTl = gsap.timeline({ onComplete: onComplete }); // This timeline handles the wipes
          
          wipeStripRefs.current.forEach((strip, i) => {
            if (!strip) return;
            const isLeftToRight = i % 2 === 0; // Even index: L-R, Odd index: R-L
            
            if (isLeftToRight) {
              gsap.set(strip, { transformOrigin: 'left center', x: 0, width: '100%' }); // Ensure initial state
              wipeTl.to(strip, { width: 0, duration: 0.8, ease: 'power1.inOut' }, i * 1); // Stagger by 1s
            } else {
              gsap.set(strip, { transformOrigin: 'right center', x: 0, width: '100%' }); // Ensure initial state, start from right
              wipeTl.to(strip, { width: 0, x: '100%', duration: 0.8, ease: 'power1.inOut' }, i * 1); // Stagger by 1s
            }
          });
        },
      }, '+=0.2'); // Slight delay after boy throws

  }, [onComplete, onPaperCover]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div ref={boyRef} className="absolute text-8xl" style={{ transformOrigin: 'bottom center', zIndex: 40 }}>🚶‍♂️</div>
      <div 
        ref={paperRef} 
        className="absolute bg-white rounded-md shadow-2xl"
        style={{ 
          width: '80px', 
          height: '100px', 
          transformOrigin: 'center center',
          zIndex: 40 // Ensure initial paper is on top
        }}
      />
      {showWipeStrips && (
        <div className="absolute inset-0" style={{ zIndex: 35 }}> {/* Container for wipe strips, on top of PhotoTrain */}
          {Array.from({ length: NUM_STRIPS }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white" // The color of the "duster"
              style={{
                height: `${STRIP_HEIGHT_VH}vh`,
                width: '100vw', // Initially full width
                top: `${i * STRIP_HEIGHT_VH}vh`,
                left: 0,
                // transformOrigin will be set by GSAP based on direction
              }}
              ref={el => wipeStripRefs.current[i] = el}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoyAndPaperAnimation;