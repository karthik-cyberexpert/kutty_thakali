import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface ShotImageProps {
  src: string;
  holePosition: { x: number; y: number };
  index: number;
}

const ShotImage: React.FC<ShotImageProps> = ({ src, holePosition, index }) => {
  const imageRef = useRef<HTMLImageElement | HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(true);

  useEffect(() => {
    const element = imageRef.current;
    if (!element) return;

    console.log(`Attempting to load image: ${src}`);

    // Initial state: slightly scaled down and fully transparent
    gsap.set(element, {
      opacity: 0,
      scale: 0.8,
      // Position them roughly in the center, with a slight random offset
      // This will make them appear around the center, not exactly on top of each other
      x: window.innerWidth / 2 + gsap.utils.random(-50, 50),
      y: window.innerHeight / 2 + gsap.utils.random(-50, 50),
      xPercent: -50, // Center the element based on its own dimensions
      yPercent: -50,
      rotation: gsap.utils.random(-10, 10), // Small initial random rotation
    });

    // Fade-in animation
    gsap.to(element, {
      opacity: 1,
      scale: 1,
      rotation: 0, // Settle to no rotation or a slight final rotation
      duration: 0.8, // Fade in duration
      ease: 'power2.out',
      delay: index * 0.1, // Stagger the fade-in for each image
    });

  }, [src, index, imageLoaded]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Failed to load image: ${src}`, e);
    setImageLoaded(false);
  };

  return (
    <>
      {imageLoaded ? (
        <img
          ref={imageRef as React.RefObject<HTMLImageElement>}
          src={src}
          alt={`Surprise image ${index + 1}`}
          className="absolute w-48 h-48 object-cover rounded-2xl border-4 border-pink-400 shadow-lg bg-white z-35"
          style={{ boxShadow: '0 0 15px #ff00ff, 0 0 25px #ff00ff' }}
          onError={handleImageError}
        />
      ) : (
        <div
          ref={imageRef as React.RefObject<HTMLDivElement>}
          className="absolute w-48 h-48 flex items-center justify-center rounded-2xl border-4 border-red-500 shadow-lg bg-red-200 text-red-800 text-center text-sm font-bold z-35"
          style={{ boxShadow: '0 0 15px #ff00ff, 0 0 25px #ff00ff' }}
        >
          Image Failed to Load: {index + 1}
        </div>
      )}
    </>
  );
};

export default ShotImage;