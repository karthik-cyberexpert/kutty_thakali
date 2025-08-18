import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PhotoTrainProps {
  images: string[];
  onComplete: () => void;
  holePosition: { x: number; y: number }; // New prop for hole position
}

const PhotoTrain: React.FC<PhotoTrainProps> = ({ images, onComplete, holePosition }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const imageElements = Array.from(container.children) as HTMLElement[];
    if (imageElements.length === 0) return;

    // Initial position for images: inside the hole, scaled down
    gsap.set(imageElements, {
      x: holePosition.x,
      y: holePosition.y,
      xPercent: -50, // Center images relative to their own size
      yPercent: -50,
      scale: 0, // Start invisible/small
      opacity: 0,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 1000);
      },
    });

    // Animate images emerging from the hole and moving across the screen
    tl.to(imageElements, {
      scale: 1, // Scale up
      opacity: 1, // Fade in
      x: (i) => holePosition.x - (i + 1) * 300, // Move left, staggered
      y: (i) => holePosition.y + (i % 2 === 0 ? 50 : -50), // Slight vertical variation
      rotation: (i) => (i % 2 === 0 ? 10 : -10), // Slight rotation
      duration: 2, // Time to emerge and start moving
      ease: 'power2.out',
      stagger: {
        each: 0.5, // Stagger emergence
        from: 'start',
      },
    })
    .to(imageElements, {
      x: -window.innerWidth, // Continue moving off-screen left
      duration: 8, // Longer duration for the main travel
      ease: 'linear',
      stagger: {
        each: 1,
        from: 'start',
      },
    }, '-=1.5'); // Overlap with the emergence animation
  }, [images, onComplete, holePosition]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-10">
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