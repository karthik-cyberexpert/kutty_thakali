import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ShotImageProps {
  src: string;
  holePosition: { x: number; y: number };
  index: number;
}

const ShotImage: React.FC<ShotImageProps> = ({ src, holePosition, index }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const imageWidth = 192; // w-48 is 12rem = 192px
    const imageHeight = 192;

    // Initial position for image: inside the hole, scaled down
    gsap.set(image, {
      x: holePosition.x,
      y: holePosition.y,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0,
    });

    // Animate image emerging from the hole and scattering across the screen
    gsap.to(image, {
      scale: 1,
      opacity: 1,
      x: gsap.utils.random(imageWidth / 2, screenWidth - imageWidth / 2),
      y: gsap.utils.random(imageHeight / 2, screenHeight - imageHeight / 2),
      rotation: gsap.utils.random(-20, 20),
      duration: 1.5,
      ease: 'power2.out',
      delay: index * 0.05, // Stagger based on index
      onComplete: () => {
        // Add subtle floating animation after landing
        gsap.to(image, {
          y: '+=10', // Move up by 10px
          scale: 1.02, // Slightly larger
          rotation: '+=2', // Slight rotation
          duration: 2, // Duration of one float cycle
          ease: 'sine.inOut',
          yoyo: true, // Go back and forth
          repeat: -1, // Infinite repeat
        });
      }
    });

  }, [src, holePosition, index]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Failed to load image: ${src}`, e);
    // If image fails to load, set a distinct background color to indicate a problem
    if (e.currentTarget) {
      e.currentTarget.style.backgroundColor = 'red'; // Make it clearly visible if image fails
    }
  };

  return (
    <img
      ref={imageRef}
      src={src}
      alt={`Surprise image ${index + 1}`}
      className="absolute w-48 h-48 object-cover rounded-2xl border-4 border-pink-400 shadow-lg bg-white" // Added bg-white here
      style={{ boxShadow: '0 0 15px #ff00ff, 0 0 25px #ff00ff' }}
      onError={handleImageError}
    />
  );
};

export default ShotImage;