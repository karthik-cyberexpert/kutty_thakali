import { useRef, forwardRef, useImperativeHandle } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface GiftBoxProps {
  onOpen: (position: { x: number; y: number }) => void;
  className?: string;
}

const GiftBox = forwardRef<HTMLDivElement, GiftBoxProps>(({ onOpen, className }, ref) => {
  const giftBoxRef = useRef<HTMLDivElement>(null);
  const lidTopRef = useRef<HTMLDivElement>(null);
  const lidBottomRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => giftBoxRef.current!);

  const handleClick = () => {
    const gift = giftBoxRef.current;
    const lidTop = lidTopRef.current;
    const lidBottom = lidBottomRef.current;
    const glow = glowRef.current;

    if (!gift || !lidTop || !lidBottom || !glow) return;

    // Disable further clicks
    gift.style.pointerEvents = 'none';

    const giftRect = gift.getBoundingClientRect();
    const centerX = giftRect.left + giftRect.width / 2;
    const centerY = giftRect.top + giftRect.height / 2;

    const tl = gsap.timeline({
      onComplete: () => {
        // After the initial opening, fade out the box elements to make way for the burst
        gsap.to([lidTop, lidBottom, gift], {
          opacity: 0,
          duration: 0.3,
          ease: 'power1.in',
          onComplete: () => {
            lidTop.style.display = 'none';
            lidBottom.style.display = 'none';
            gift.style.display = 'none';
          }
        });
        onOpen({ x: centerX, y: centerY }); // Call onOpen after lid animation
      }
    });

    // Animate the lid panels splitting and moving
    tl.to(lidTop, {
      y: '-100%', // Move top lid completely upwards
      duration: 0.6,
      ease: 'power2.out',
    }, 0) // Start at the same time
    .to(lidBottom, {
      y: '100%', // Move bottom lid completely downwards
      duration: 0.6,
      ease: 'power2.out',
    }, 0) // Start at the same time
    // Animate the internal glow
    .fromTo(glow,
      { scale: 0, opacity: 0 },
      { scale: 1.5, opacity: 1, duration: 0.5, ease: 'power2.out' },
      0.2 // Start glow slightly after lids begin to move
    )
    .to(glow, {
      opacity: 0,
      scale: 2,
      duration: 0.4,
      ease: 'power1.in',
    }, 0.7); // Fade out glow after it peaks
  };

  return (
    <div
      ref={giftBoxRef}
      onClick={handleClick}
      className={cn(
        "relative w-32 h-32 md:w-40 md:h-40 cursor-pointer transition-transform duration-300 hover:scale-110 overflow-hidden", // Added overflow-hidden
        className
      )}
      style={{ filter: 'drop-shadow(0 0 20px #ff00ff)' }} // Keep the glow effect
    >
      {/* Main Box Body - Futuristic look */}
      <div className="absolute inset-0 bg-gray-900 rounded-lg border-2 border-purple-700 shadow-lg flex items-center justify-center">
        {/* Glowing lines/accents */}
        <div className="absolute w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 top-1/2 -translate-y-1/2 opacity-70" style={{ boxShadow: '0 0 10px #ff00ff' }}></div>
        <div className="absolute w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500 left-1/2 -translate-x-1/2 opacity-70" style={{ boxShadow: '0 0 10px #ff00ff' }}></div>
      </div>

      {/* Lid Top */}
      <div
        ref={lidTopRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-gray-800 rounded-t-lg border-t-2 border-x-2 border-purple-600"
        style={{ transformOrigin: 'bottom center', zIndex: 10 }}
      >
        {/* Top part of glowing lines */}
        <div className="absolute w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bottom-0 opacity-70" style={{ boxShadow: '0 0 10px #ff00ff' }}></div>
        <div className="absolute w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500 left-1/2 -translate-x-1/2 opacity-70" style={{ boxShadow: '0 0 10px #ff00ff' }}></div>
      </div>

      {/* Lid Bottom */}
      <div
        ref={lidBottomRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-gray-800 rounded-b-lg border-b-2 border-x-2 border-purple-600"
        style={{ transformOrigin: 'top center', zIndex: 10 }}
      >
        {/* Bottom part of glowing lines */}
        <div className="absolute w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 top-0 opacity-70" style={{ boxShadow: '0 0 10px #ff00ff' }}></div>
        <div className="absolute w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500 left-1/2 -translate-x-1/2 opacity-70" style={{ boxShadow: '0 0 10px #ff00ff' }}></div>
      </div>

      {/* Internal Glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 5 }}
      >
        <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 opacity-0" style={{ filter: 'blur(20px)', boxShadow: '0 0 50px #ff00ff' }}></div>
      </div>
    </div>
  );
});

export default GiftBox;