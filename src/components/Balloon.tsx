import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface BalloonProps {
  id: string;
  imageSrc: string;
  isBurst?: boolean; // For balloons in the grid, controlled by parent
  onBurst?: (id: string) => void; // Callback when a grid balloon is clicked/burst
  className?: string; // For grid positioning
  isAutoBurstingActive?: boolean; // New prop to indicate if automatic bursting is active
}

const Balloon = forwardRef<any, BalloonProps>(({
  id,
  imageSrc,
  isBurst: propIsBurst = false,
  onBurst,
  className,
  isAutoBurstingActive = false // Default to false
}, ref) => {
  const balloonRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [internalIsBurst, setInternalIsBurst] = useState(propIsBurst);
  const [showImage, setShowImage] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false); // New state for image loading error

  useImperativeHandle(ref, () => ({
    burstBalloon,
  }));

  // Sync propIsBurst with internal state for grid balloons
  useEffect(() => {
    if (propIsBurst && !internalIsBurst) {
      setInternalIsBurst(true);
      burstBalloon();
    }
  }, [propIsBurst, internalIsBurst]);

  useEffect(() => {
    const balloon = balloonRef.current;
    if (!balloon) return;

    // Balloons in the grid appear with a fade-in
    gsap.set(balloon, { opacity: 0, scale: 0.8 });
    gsap.to(balloon, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
  }, []);

  const burstBalloon = () => {
    const balloon = balloonRef.current;
    const image = imageRef.current;
    if (!balloon) return; // Image might not be rendered yet if showImage is false

    gsap.timeline({
      onComplete: () => {
        setShowImage(true); // Ensure image is rendered
        if (image) { // Check if image ref is available after rendering
            gsap.fromTo(image,
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
            );
        }
        onBurst?.(id); // Notify parent
      }
    })
    .to(balloon, {
      scale: 1.3, // More pronounced pop out
      opacity: 0, // Fade out
      y: '-=20', // Move up slightly as it bursts
      duration: 0.2, // Faster burst
      ease: 'power1.out',
      onStart: () => {
        // Optional: Add a small "pop" sound effect here
      }
    });
  };

  const handleClick = () => {
    // Only allow manual click if it's not already burst AND if automatic bursting is NOT active.
    if (!internalIsBurst && !isAutoBurstingActive) {
      setInternalIsBurst(true); // Set internal state to trigger burst
      burstBalloon();
    }
  };

  const handleImageError = () => {
    setImageLoadError(true);
    console.error(`Failed to load image: ${imageSrc} for balloon ${id}`);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center z-20", // Grid balloons below gun/hole
        className
      )}
      onClick={handleClick}
    >
      {!internalIsBurst && (
        <>
          {/* Balloon Body */}
          <div
            ref={balloonRef}
            className="w-24 h-32 md:w-32 md:h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg flex items-center justify-center text-white text-4xl"
            style={{ filter: 'drop-shadow(0 0 10px rgba(135,206,250,0.5))' }} {/* Blue shadow */}
          >
            🌟
          </div>
          {/* Balloon Rope */}
          <div
            ref={ropeRef}
            className="w-0.5 h-20 bg-gray-400 absolute top-full"
            style={{ transformOrigin: 'top center' }}
          />
        </>
      )}
      {showImage && (
        imageLoadError ? (
          <div className="absolute w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-lg border-2 border-red-500 bg-red-200 text-red-800 text-center text-xs font-bold z-30">
            Error loading image {id}
          </div>
        ) : (
          <img
            ref={imageRef}
            src={imageSrc}
            alt={`Balloon burst image ${id}`}
            className="absolute w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-lg border-2 border-white z-30" // Added z-index
            onError={handleImageError} // Added error handler
          />
        )
      )}
    </div>
  );
});

export default Balloon;