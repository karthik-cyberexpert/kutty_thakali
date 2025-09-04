"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface BalloonProps {
  id: string;
  imageSrc: string;
  isBurst?: boolean;
  onBurst?: (id: string) => void;
  className?: string;
  isAutoBurstingActive?: boolean;
}

const Balloon = forwardRef<any, BalloonProps>(({
  id,
  imageSrc,
  isBurst: propIsBurst = false,
  onBurst,
  className,
  isAutoBurstingActive = false
}, ref) => {
  const balloonRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [internalIsBurst, setInternalIsBurst] = useState(propIsBurst);
  const [showImage, setShowImage] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  useImperativeHandle(ref, () => ({
    burstBalloon,
  }));

  useEffect(() => {
    if (propIsBurst && !internalIsBurst) {
      setInternalIsBurst(true);
      burstBalloon();
    }
  }, [propIsBurst, internalIsBurst]);

  useEffect(() => {
    const balloon = balloonRef.current;
    if (!balloon) return;

    gsap.set(balloon, { opacity: 0, scale: 0.8 });
    gsap.to(balloon, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
  }, []);

  const burstBalloon = () => {
    const balloon = balloonRef.current;
    const image = imageRef.current;
    if (!balloon) return;

    gsap.timeline({
      onComplete: () => {
        setShowImage(true);
        if (image) {
            gsap.fromTo(image,
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
            );
        }
        onBurst?.(id);
      }
    })
    .to(balloon, {
      scale: 1.3,
      opacity: 0,
      y: '-=20',
      duration: 0.2,
      ease: 'power1.out',
      onStart: () => {
      }
    });
  };

  const handleClick = () => {
    if (!internalIsBurst && !isAutoBurstingActive) {
      setInternalIsBurst(true);
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
        "relative flex flex-col items-center justify-center z-20",
        className
      )}
      onClick={handleClick}
    >
      {!internalIsBurst && (
        <>
          {/* Futuristic Balloon Body */}
          <div
            ref={balloonRef}
            className="w-24 h-32 md:w-32 md:h-40 rounded-full bg-gradient-to-br from-blue-600 to-purple-800 shadow-lg flex items-center justify-center text-white text-4xl border-2 border-cyan-400" // Neon colors, border
            style={{ filter: 'drop-shadow(0 0 10px rgba(0,255,255,0.5))' }} // Neon glow
          >
            ⚡
          </div>
          {/* Futuristic Balloon Rope */}
          <div
            ref={ropeRef}
            className="w-0.5 h-20 bg-cyan-500 absolute top-full shadow-md shadow-cyan-500/50" // Neon rope
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
            className="absolute w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-lg border-2 border-cyan-400 z-30" // Neon border
            onError={handleImageError}
          />
        )
      )}
    </div>
  );
});

export default Balloon;