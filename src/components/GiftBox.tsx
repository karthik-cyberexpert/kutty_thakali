import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface GiftBoxProps {
  onOpen: () => void;
}

const GiftBox: React.FC<GiftBoxProps> = ({ onOpen }) => {
  const giftRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const giftElement = giftRef.current;
    if (!giftElement) return;

    gsap.set(giftElement, { scale: 0 });
    gsap.to(giftElement, { scale: 1, duration: 1, ease: 'bounce.out', delay: 0.5 });

    const hoverAnimation = gsap.timeline({ paused: true });
    hoverAnimation
      .to(giftElement, { y: -20, duration: 0.4, ease: 'power1.inOut' })
      .to(giftElement, { y: 0, duration: 0.4, ease: 'power1.inOut' });

    const interval = setInterval(() => {
        hoverAnimation.restart();
    }, 2000);

    return () => {
        clearInterval(interval);
        hoverAnimation.kill();
    }
  }, []);

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);

    gsap.timeline({ onComplete: onOpen })
      .to(lidRef.current, {
        y: -100,
        rotateZ: -15,
        duration: 0.7,
        ease: 'power2.out',
      })
      .to(lidRef.current, {
        opacity: 0,
        duration: 0.3,
      })
      .to(boxRef.current, {
        opacity: 0,
        duration: 0.3,
      }, "<");
  };

  return (
    <div ref={giftRef} className="relative w-48 h-48 cursor-pointer" onClick={handleOpen} style={{ transformOrigin: 'center bottom' }}>
      {/* Lid */}
      <div ref={lidRef} className="absolute z-10 w-full h-12 top-[calc(50%-48px)] origin-center">
        <div className="absolute w-[110%] h-full bg-pink-500 rounded-t-lg left-1/2 -translate-x-1/2 shadow-lg" />
        <div className="absolute w-6 h-full bg-purple-400 left-1/2 -translate-x-1/2" />
      </div>
      {/* Box */}
      <div ref={boxRef} className="absolute w-full h-32 bg-pink-600 rounded-b-lg bottom-0 shadow-xl">
        <div className="absolute w-6 h-full bg-purple-400 left-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
};

export default GiftBox;