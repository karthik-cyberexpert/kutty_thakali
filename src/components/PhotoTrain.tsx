import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PhotoTrainProps {
  images: string[];
  onComplete: () => void;
}

const PhotoTrain: React.FC<PhotoTrainProps> = ({ images, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const imageElements = Array.from(container.children);

    // Position images off-screen to the right
    gsap.set(imageElements, { x: '100vw' });

    const tl = gsap.timeline({ 
      onComplete: () => {
        // A short delay before calling onComplete to ensure the last image is off-screen
        setTimeout(onComplete, 1000);
      } 
    });

    // Animate images across the screen to the left
    tl.to(imageElements, {
      x: '-100vw',
      duration: 10,
      ease: 'linear',
      stagger: {
        each: 1.5, // Time between the start of each image's animation
        from: 'start',
      },
    });
  }, [images, onComplete]);

  return (
    <div ref={containerRef} className="absolute top-1/2 -translate-y-1/2 w-full h-48 flex items-center overflow-hidden">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Surprise image ${index + 1}`}
          className="absolute w-40 h-40 object-cover rounded-2xl border-4 border-pink-400 shadow-lg"
          style={{ boxShadow: '0 0 15px #ff00ff, 0 0 25px #ff00ff' }}
        />
      ))}
    </div>
  );
};

export default PhotoTrain;