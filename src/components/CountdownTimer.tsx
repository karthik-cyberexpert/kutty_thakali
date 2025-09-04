import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface CountdownTimerProps {
  onComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ onComplete }) => {
  const [count, setCount] = useState(5);
  const timerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timerElement = timerRef.current;
    if (!timerElement) return;

    gsap.fromTo(timerElement,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );

    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(interval);
          gsap.to(timerElement, {
            opacity: 0,
            scale: 0.5,
            duration: 0.3,
            ease: 'power1.in',
            onComplete: onComplete,
          });
          return 0;
        }
        gsap.fromTo(timerElement,
          { scale: 1.2, opacity: 0.8 },
          { scale: 1, opacity: 1, duration: 0.2, ease: 'power1.out' }
        );
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      ref={timerRef}
      className="absolute inset-0 flex items-center justify-center z-50 text-white text-9xl font-anime font-bold"
      style={{ textShadow: '0 0 20px rgba(255,105,180,0.8), 0 0 40px rgba(135,206,250,0.8)' }} {/* Pink and blue shadow */}
    >
      {count > 0 ? count : ''}
    </div>
  );
};

export default CountdownTimer;