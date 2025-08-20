import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface ShotImageProps {
  src: string;
  holePosition: { x: number; y: number };
  index: number;
}

const ShotImage: React.FC<ShotImageProps> = ({ src, holePosition, index }) => {
  const imageRef = useRef<HTMLImageElement | HTMLDivElement>(null); // Can be img or div
  const [imageLoaded, setImageLoaded] = useState(true); // Assume loaded initially, set to false on error

  useEffect(() => {
    const element = imageRef.current;
    if (!element) return;

    console.log(`Attempting to load image: ${src}`); // Log the source path

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const imageWidth = 192; // w-48 is 12rem = 192px
    const imageHeight = 192;

    // Define padding from edges to ensure images stay on screen
    const paddingX = screenWidth * 0.05; // 5% padding from left/right
    const paddingY = screenHeight * 0.05; // 5% padding from top/bottom

    // Initial position for element: inside the hole, scaled down
    gsap.set(element, {
      x: holePosition.x,
      y: holePosition.y,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0,
    });

    // Animate element emerging from the hole and scattering across the screen
    gsap.to(element, {
      scale: 1,
      opacity: 1,
      // Ensure images land within the screen bounds with padding
      x: gsap.utils.random(paddingX, screenWidth - paddingX),
      y: gsap.utils.random(paddingY, screenHeight - paddingY),
      rotation: gsap.utils.random(-20, 20),
      duration: 1.5,
      ease: 'power2.out',
      delay: index * 0.05, // Stagger based on index
      onComplete: () => {
        // Add subtle floating animation after landing
        gsap.to(element, {
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

  }, [src, holePosition, index, imageLoaded]); // Re-run effect if imageLoaded changes

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Failed to load image: ${src}`, e);
    setImageLoaded(false); // Set state to false on error
  };

  return (
    <>
      {imageLoaded ? (
        <img
          ref={imageRef as React.RefObject<HTMLImageElement>} // Cast ref for img element
          src={src}
          alt={`Surprise image ${index + 1}`}
          className="absolute w-48 h-48 object-cover rounded-2xl border-4 border-pink-400 shadow-lg bg-white z-20" // Added z-20
          style={{ boxShadow: '0 0 15px #ff00ff, 0 0 25px #ff00ff' }}
          onError={handleImageError}
        />
      ) : (
        <div
          ref={imageRef as React.RefObject<HTMLDivElement>} // Cast ref for div element
          className="absolute w-48 h-48 flex items-center justify-center rounded-2xl border-4 border-red-500 shadow-lg bg-red-200 text-red-800 text-center text-sm font-bold z-20" // Added z-20
          style={{ boxShadow: '0 0 15px #ff00ff, 0 0 25px #ff00ff' }}
        >
          Image Failed to Load: {index + 1}
        </div>
      )}
    </>
  );
};

export default ShotImage;