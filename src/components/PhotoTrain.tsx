import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PhotoTrainProps {
  images: string[];
  onComplete: () => void;
  holePosition: { x: number; y: number };
}

const PhotoTrain: React.FC<PhotoTrainProps> = ({ images, onComplete, holePosition }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const imageElements = Array.from(container.children) as HTMLElement[];
    if (imageElements.length === 0) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const imageWidth = 192; // w-48 is 12rem = 192px
    const imageHeight = 192;

    // Initial position for images: inside the hole, scaled down
    gsap.set(imageElements, {
      x: holePosition.x,
      y: holePosition.y,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out all images before completing
        gsap.to(imageElements, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: 'power2.in',
            onComplete: () => {
                setTimeout(onComplete, 500); // A short delay after fade out
            }
        });
      },
    });

    // Animate images emerging from the hole and scattering across the screen
    tl.to(imageElements, {
      scale: 1,
      opacity: 1,
      x: () => gsap.utils.random(imageWidth / 2, screenWidth - imageWidth / 2),
      y: () => gsap.utils.random(imageHeight / 2, screenHeight - imageHeight / 2),
      rotation: () => gsap.utils.random(-20, 20),
      duration: 1.5,
      ease: 'power2.out',
      stagger: {
        each: 0.1, // Faster stagger
        from: 'start',
      },
    });

    // Add subtle floating animation for the duration they are on screen
    tl.to(imageElements, {
      y: '+=10', // Move up by 10px
      scale: 1.02, // Slightly larger
      rotation: '+=2', // Slight rotation
      duration: 2, // Duration of one float cycle
      ease: 'sine.inOut',
      yoyo: true, // Go back and forth
      repeat: 2, // Repeat twice for a total of 4 seconds of floating
    }, "-=0.5"); // Start this slightly before the scatter animation ends for a smoother transition

  }, [images, onComplete, holePosition]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 overflow-hidden">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Surprise image ${index + 1}`}
          className="absolute w-48 h-48 object-cover rounded-2xl border-4 border-pink-400 shadow-lg"
          style={{ boxShadow: '0 0 15px #ff00ff, 0 0 25px #ff00ff' }}
        />
      ))}
    </div>
  );
};

export default PhotoTrain;