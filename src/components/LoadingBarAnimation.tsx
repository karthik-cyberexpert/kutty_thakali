import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingBarAnimationProps {
  onComplete: () => void;
}

const LoadingBarAnimation: React.FC<LoadingBarAnimationProps> = ({ onComplete }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const girlRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const bar = barRef.current;
    const girl = girlRef.current;
    const percentageText = percentageRef.current;

    if (!bar || !girl || !percentageText) return;

    gsap.set(bar, { width: '0%' });
    gsap.set(girl, { x: '-100%' }); // Start girl off-screen to the left of the bar
    gsap.set(percentageText, { textContent: '0%' });

    const duration = 3.5; // 3.5 seconds for the animation

    const tl = gsap.timeline({
      onUpdate: () => {
        const currentProgress = Math.round(gsap.getProperty(bar, 'width', 'px') / bar.parentElement!.offsetWidth * 100);
        setProgress(currentProgress);
        if (percentageText) {
          percentageText.textContent = `${currentProgress}%`;
        }
      },
      onComplete: onComplete,
    });

    tl.to(bar, { width: '100%', duration: duration, ease: 'power2.inOut' }, 0)
      .to(girl, { x: '100%', duration: duration, ease: 'power2.inOut' }, 0); // Animate girl across the bar
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
      <div className="w-3/4 max-w-md bg-gray-700 rounded-full h-8 relative overflow-hidden">
        <div
          ref={barRef}
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
        <div
          ref={girlRef}
          className="absolute top-1/2 -translate-y-1/2 text-3xl"
          style={{ left: '0%', transform: 'translateX(-50%)' }} // Adjust initial position
        >
          🏃‍♀️
        </div>
        <span ref={percentageRef} className="absolute right-4 top-1/2 -translate-y-1/2 text-white font-bold text-lg">
          0%
        </span>
      </div>
    </div>
  );
};

export default LoadingBarAnimation;