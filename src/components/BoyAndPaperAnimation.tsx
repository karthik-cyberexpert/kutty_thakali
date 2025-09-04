"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import AnimeCharacterSVG from './AnimeCharacterSVG'; // Import the new SVG character

interface BoyAndPaperAnimationProps {
  onComplete: () => void;
  onPaperCover: () => void;
}

const BoyAndPaperAnimation: React.FC<BoyAndPaperAnimationProps> = ({ onComplete, onPaperCover }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boyRef = useRef<HTMLDivElement>(null); // Changed to HTMLDivElement to hold SVG
  const paperRef = useRef<HTMLDivElement>(null);
  const wipeStripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showWipeStrips, setShowWipeStrips] = useState(false);

  const NUM_STRIPS = 15;
  const STRIP_HEIGHT_VH = 100 / NUM_STRIPS;

  useEffect(() => {
    const boy = boyRef.current;
    const paper = paperRef.current;
    if (!boy || !paper) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    gsap.set(boy, { x: -150, y: screenHeight - 150, scale: 0.8 });
    gsap.set(paper, { x: screenWidth / 2 - 40, y: screenHeight - 100, rotation: -75, opacity: 1 });

    const mainTl = gsap.timeline({ delay: 1.5 });

    mainTl.to(boy, { x: screenWidth / 2 - 120, duration: 3, ease: 'none' })
      .to(boy, { y: '+=10', duration: 0.2, yoyo: true, repeat: 1 }, '-=0.3')
      .to(paper, { y: screenHeight - 160, x: screenWidth / 2 - 100, rotation: 0, duration: 0.2 }, '<')
      .to(boy, { x: '+=30', duration: 0.5 }, '+=0.2')
      .to(paper, { x: '+=30', duration: 0.5 }, '<')
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
          onPaperCover();
          setShowWipeStrips(true);
        },
      }, '+=0.2')
      .add(() => {
        const wipeTl = gsap.timeline({ onComplete: onComplete });

        wipeTl.to(paper, { opacity: 0, duration: 0.2 }, 0)
              .set(paper, { display: 'none' });

        gsap.set(boy, { opacity: 0, display: 'none' });

        wipeStripRefs.current.forEach((strip, i) => {
          if (!strip) return;
          const isLeftToRight = i % 2 === 0;

          gsap.set(strip, { opacity: 1 });

          if (isLeftToRight) {
            gsap.set(strip, { transformOrigin: 'left center', x: 0, width: '100%' });
            wipeTl.to(strip, { width: 0, duration: 0.8, ease: 'power1.inOut' }, i * 1 + 0.2);
          } else {
            gsap.set(strip, { transformOrigin: 'right center', x: 0, width: '100%' });
            wipeTl.to(strip, { width: 0, x: '100%', duration: 0.8, ease: 'power1.inOut' }, i * 1 + 0.2);
          }
        });
      }, '+=0.5');

  }, [onComplete, onPaperCover]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div
        ref={boyRef}
        className="absolute"
        style={{ transformOrigin: 'bottom center', zIndex: 40, width: '100px', height: 'auto' }}
      >
        <AnimeCharacterSVG
          expression="default"
          characterColor="#FFC0CB" // Pink color for the boy
          animationType="none" // Animation handled by parent
          className="w-full h-full"
        />
      </div>
      <div
        ref={paperRef}
        className="absolute bg-white rounded-md shadow-2xl"
        style={{
          width: '80px',
          height: '100px',
          transformOrigin: 'center center',
          zIndex: 40
        }}
      />
      {showWipeStrips && (
        <div className="absolute inset-0" style={{ zIndex: 35 }}>
          {Array.from({ length: NUM_STRIPS }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white"
              style={{
                height: `${STRIP_HEIGHT_VH}vh`,
                width: '100vw',
                top: `${i * STRIP_HEIGHT_VH}vh`,
                left: 0,
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