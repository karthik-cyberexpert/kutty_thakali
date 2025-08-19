import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingBarAnimationProps {
  onComplete: () => void;
}

const LoadingBarAnimation: React.FC<LoadingBarAnimationProps> = ({ onComplete }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const girlRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);
  const barContainerRef = useRef<HTMLDivElement>(null);
  // Removed `progress` state as it's no longer directly controlling the bar's width via React style

  useEffect(() => {
    const bar = barRef.current;
    const girl = girlRef.current;
    const percentageText = percentageRef.current;
    const barContainer = barContainerRef.current;

    if (!bar || !girl || !percentageText || !barContainer) {
      console.warn("LoadingBarAnimation: Refs not available, skipping animation setup.");
      return;
    }

    gsap.set(bar, { width: '0%' });
    gsap.set(girl, { left: '0%', transform: 'translateX(-50%)' });
    gsap.set(percentageText, { textContent: '0%' });

    const duration = 8; // Set animation duration to 8 seconds

    const tl = gsap.timeline({
      onUpdate: () => {
        const currentBarWidth = gsap.getProperty(bar, 'width', 'px') as number;
        const containerWidth = barContainer.offsetWidth || 1; 
        const currentProgress = Math.round((currentBarWidth / containerWidth) * 100);
        
        if (!isNaN(currentProgress)) {
          // Only update the text content, let GSAP handle the bar's width directly
          if (percentageText) {
            percentageText.textContent = `${currentProgress}%`;
          }
        }
      },
      onComplete: onComplete,
    });

    tl.to(bar, { width: '100%', duration: duration, ease: 'power2.inOut' }, 0)
      .to(girl, { left: '100%', duration: duration, ease: 'power2.inOut' }, 0);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div
          ref={barContainerRef}
          className="w-3/4 max-w-md bg-gray-700 rounded-lg h-8 relative overflow-hidden"
        >
          <div
            ref={barRef}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
            // Removed style={{ width: `${progress}%` }} to let GSAP control it directly
          ></div>
          <div
            ref={girlRef}
            className="absolute top-1/2 -translate-y-1/2 text-3xl"
            style={{ transform: 'translateX(-50%)' }}
          >
            🏃‍♀️
          </div>
        </div>
        <span ref={percentageRef} className="text-white font-bold text-lg min-w-[40px] text-left">
          0%
        </span>
      </div>
    </div>
  );
};

export default LoadingBarAnimation;