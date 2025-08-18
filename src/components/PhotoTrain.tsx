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

    const imageElements = Array.from(container.children) as HTMLElement[];
    if (imageElements.length === 0) return;

    // Position images off-screen to the right and centered vertically
    gsap.set(imageElements, {
      x: window.innerWidth,
      yPercent: -50,
      top: '50%',
    });

    const tl = gsap.timeline({
      delay: 0.5, // Wait for paper to start falling before starting
      onComplete: () => {
        setTimeout(onComplete, 1000);
      },
    });

    // Animate images across the screen to the left
    tl.to(imageElements, {
      x: () => -imageElements[0].offsetWidth, // Animate until just off-screen left
      duration: 8,
      ease: 'linear',
      stagger: {
        each: 1,
        from: 'start',
      },
    });
  }, [images, onComplete]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-20">
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