import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PhotoTrainProps {
  images: string[];
  onComplete: () => void;
  enginePosition: { x: number; y: number };
}

const PhotoTrain: React.FC<PhotoTrainProps> = ({ images, onComplete, enginePosition }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const carRefs = useRef<(HTMLDivElement | null)[]>([]); // Each ref points to a car-container

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cars = carRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cars.length === 0) return;

    const imageWidth = 192; // w-48
    const chainWidth = 40; // width of the chain link visual
    const carSpacing = 20; // Space between cars
    const totalCarWidth = imageWidth + chainWidth + carSpacing;

    // Initial setup: position all cars off-screen to the right, but relative to the engine's Y.
    // The train will appear from the right of the engine button and move left.
    gsap.set(cars, {
      x: (i) => enginePosition.x + (i * totalCarWidth) + window.innerWidth, // Start far right, staggered
      y: enginePosition.y - (imageWidth / 2), // Vertically centered with engine
      opacity: 0,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 1000);
      },
    });

    // Animate each car to slide into view from the right, forming the train
    tl.to(cars, {
      x: (i) => enginePosition.x + (i * totalCarWidth), // Slide to position relative to engine
      opacity: 1,
      duration: 1,
      stagger: 0.2, // Stagger appearance of each car
      ease: 'power2.out',
    })
    .to(cars, {
      x: `-=${window.innerWidth + (images.length * totalCarWidth)}`, // Move entire train off-screen left
      duration: 15, // Longer duration for the full train movement
      ease: 'linear',
      delay: 0.5, // Small delay before moving the whole train
    });

  }, [images, onComplete, enginePosition]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 overflow-hidden">
      {images.map((src, index) => (
        <div
          key={index}
          ref={el => carRefs.current[index] = el}
          className="absolute flex items-center" // Container for chain + image
        >
          {/* Chain link before the image */}
          <div className="w-10 h-2 bg-yellow-400 rounded-full mr-2 shadow-md" /> {/* Chain link */}
          <img
            src={src}
            alt={`Surprise image ${index + 1}`}
            className="w-48 h-48 object-cover rounded-2xl border-4 border-pink-400 shadow-lg"
            style={{ boxShadow: '0 0 15px #ff00ff, 0 0 25px #ff00ff' }}
          />
        </div>
      ))}
    </div>
  );
};

export default PhotoTrain;