import { useRef } from 'react';
import { gsap } from 'gsap';

interface GiftBoxProps {
  onOpen: () => void;
}

const GiftBox = ({ onOpen }: GiftBoxProps) => {
  const giftRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    const gift = giftRef.current;
    if (!gift) return;

    // Disable further clicks
    gift.style.pointerEvents = 'none';

    const tl = gsap.timeline({ onComplete: onOpen });
    tl.to(gift, { scale: 1.1, duration: 0.2, ease: 'power1.inOut' })
      .to(gift, { scale: 1, duration: 0.2, ease: 'power1.inOut' })
      .to(gift, { y: -20, rotation: -5, duration: 0.15 })
      .to(gift, { y: 0, rotation: 0, duration: 0.15 })
      .to(gift, { y: -20, rotation: 5, duration: 0.15 })
      .to(gift, { y: 0, rotation: 0, duration: 0.15 })
      .to(gift, { scale: 3, opacity: 0, duration: 0.5, ease: 'power2.in' });
  };

  return (
    <div
      ref={giftRef}
      onClick={handleClick}
      className="cursor-pointer text-8xl md:text-9xl transition-transform duration-300 hover:scale-110"
      style={{ filter: 'drop-shadow(0 0 20px #ff00ff)' }}
    >
      🎁
    </div>
  );
};

export default GiftBox;