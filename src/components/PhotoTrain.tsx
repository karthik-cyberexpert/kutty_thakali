import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Train } from 'lucide-react'; // Import Train icon

interface PhotoTrainProps {
  images: string[];
  onComplete: () => void;
  enginePosition: { x: number; y: number; width: number; height: number };
}

const PhotoTrain: React.FC<PhotoTrainProps> = ({ images, onComplete, enginePosition }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const carRefs = useRef<(HTMLDivElement | null)[]>([]); // Each ref points to a car-container
  const engineRef = useRef<HTMLDivElement>(null); // Ref for the engine visual

  useEffect(() => {
    const container = containerRef.current;
    const engine = engineRef.current;
    if (!container || !engine) return;

    const cars = carRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cars.length === 0) return;

    const imageWidth = 192; // w-48
    const chainWidth = 40; // w-10
    const carSpacing = 8; // mr-2 (space between chain and image)
    const totalCarWidth = imageWidth + chainWidth + carSpacing; // Total width of one car unit (chain + image)

    // Set engine position based on the button's rect
    gsap.set(engine, {
      x: enginePosition.x,
      y: enginePosition.y,
      width: enginePosition.width,
      height: enginePosition.height,
      opacity: 1, // Ensure engine is visible
    });

    // Calculate the starting X for the first car, right after the engine + chain
    // The first car's container starts at the right edge of the engine
    const firstCarContainerStartX = enginePosition.x + enginePosition.width;
    
    // Vertically center the cars with the engine button's center
    const carY = enginePosition.y + (enginePosition.height / 2) - (imageWidth / 2); 

    // Initial setup for cars: off-screen to the right, aligned with engine's Y
    gsap.set(cars, {
      x: (i) => firstCarContainerStartX + (i * totalCarWidth) + window.innerWidth, // Start far right
      y: carY,
      opacity: 0,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 1000);
      },
    });

    // Animate each car to slide into view from the right, forming the train
    tl.to(cars, {
      x: (i) => firstCarContainerStartX + (i * totalCarWidth), // Slide to its position relative to the engine
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
    }, "+=1"); // Start moving the whole train after all cars have appeared

  }, [images, onComplete, enginePosition]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-40 overflow-hidden"> {/* Increased z-index */}
      {/* The train engine */}
      <div
        ref={engineRef}
        className="absolute flex items-center justify-center text-white" // Use flex to center the icon
        style={{
          // These will be overridden by gsap.set, but good for initial render
          left: enginePosition.x,
          top: enginePosition.y,
          width: enginePosition.width,
          height: enginePosition.height,
          opacity: 0, // Initially hidden, GSAP will make it visible
        }}
      >
        <Train className="h-12 w-12" /> {/* Lucide Train icon */}
      </div>

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