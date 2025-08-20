import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface BalloonProps {
  id: string;
  imageSrc: string;
  initialX?: number; // For initial positioning (e.g., the first balloon)
  initialY?: number;
  isInitialBalloon?: boolean; // True for the single balloon on MailContent page
  onFlyUpComplete?: () => void; // Callback for initial balloon when it flies off
  isBurst?: boolean; // For balloons in the grid, controlled by parent
  onBurst?: (id: string) => void; // Callback when a grid balloon is clicked/burst
  className?: string; // For grid positioning
}

const Balloon = forwardRef<any, BalloonProps>(({
  id,
  imageSrc,
  initialX,
  initialY,
  isInitialBalloon = false,
  onFlyUpComplete,
  isBurst: propIsBurst = false,
  onBurst,
  className
}, ref) => {
  const balloonRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [internalIsBurst, setInternalIsBurst] = useState(propIsBurst);
  const [showImage, setShowImage] = useState(false);

  useImperativeHandle(ref, () => ({
    cutRopeAndFly,
    burstBalloon,
  }));

  // Sync propIsBurst with internal state for grid balloons
  useEffect(() => {
    if (propIsBurst && !internalIsBurst) {
      setInternalIsBurst(true);
      burstBalloon();
    }
  }, [propIsBurst]);

  useEffect(() => {
    const balloon = balloonRef.current;
    const rope = ropeRef.current;
    if (!balloon) return;

    if (isInitialBalloon) {
      // Initial balloon appears at a specific position
      gsap.set(balloon, {
        x: initialX,
        y: initialY,
        xPercent: -50,
        yPercent: -50,
        scale: 0,
        opacity: 0,
        rotation: gsap.utils.random(-10, 10),
      });
      gsap.set(rope, { transformOrigin: 'top center' });

      gsap.to(balloon, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });
    } else {
      // Balloons in the grid appear with a fade-in
      gsap.set(balloon, { opacity: 0, scale: 0.8 });
      gsap.to(balloon, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
    }
  }, [isInitialBalloon, initialX, initialY]);

  const cutRopeAndFly = () => {
    const balloon = balloonRef.current;
    const rope = ropeRef.current;
    if (!balloon || !rope) return;

    gsap.timeline({ onComplete: onFlyUpComplete })
      .to(rope, { opacity: 0, duration: 0.3 }, 0) // Rope fades out
      .to(balloon, {
        y: -window.innerHeight * 1.5, // Fly far up off-screen
        x: '+=random(-100, 100)', // Slight horizontal drift
        rotation: '+=random(-30, 30)', // Continue rotating
        duration: 10, // Very slow motion
        ease: 'power1.in', // Accelerate slightly as it goes up
      }, 0);
  };

  const burstBalloon = () => {
    const balloon = balloonRef.current;
    const image = imageRef.current;
    if (!balloon || !image) return;

    gsap.timeline({
      onComplete: () => {
        setShowImage(true); // Show image after burst animation
        gsap.fromTo(image,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
        onBurst?.(id); // Notify parent
      }
    })
    .to(balloon, {
      scale: 1.2, // Pop out slightly
      opacity: 0, // Fade out
      duration: 0.2,
      ease: 'power1.out',
      onStart: () => {
        // Optional: Add a small "pop" sound effect here
      }
    });
  };

  const handleClick = () => {
    if (!isInitialBalloon && !internalIsBurst) {
      setInternalIsBurst(true); // Set internal state to trigger burst
      burstBalloon();
    }
  };

  return (
    <div
      className={cn(
        "absolute flex flex-col items-center justify-center",
        isInitialBalloon ? "z-30" : "z-20", // Initial balloon on top, grid balloons below gun/hole
        className
      )}
      style={{
        left: isInitialBalloon ? initialX : undefined,
        top: isInitialBalloon ? initialY : undefined,
        transform: isInitialBalloon ? 'translate(-50%, -50%)' : undefined,
      }}
      onClick={handleClick}
    >
      {!internalIsBurst && (
        <>
          {/* Balloon Body */}
          <div
            ref={balloonRef}
            className="w-24 h-32 md:w-32 md:h-40 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 shadow-lg flex items-center justify-center text-white text-4xl"
            style={{ filter: 'drop-shadow(0 0 10px rgba(255,0,255,0.5))' }}
          >
            🎈
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
        <img
          ref={imageRef}
          src={imageSrc}
          alt={`Balloon burst image ${id}`}
          className="absolute w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-lg border-2 border-white"
          style={{ opacity: 0 }} // Initially hidden
        />
      )}
    </div>
  );
});

export default Balloon;