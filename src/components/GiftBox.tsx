import { useRef, forwardRef, useImperativeHandle } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface GiftBoxProps {
  onOpen: (position: { x: number; y: number }) => void;
  className?: string;
}

const GiftBox = forwardRef<HTMLDivElement, GiftBoxProps>(({ onOpen, className }, ref) => {
  const giftBoxRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const ribbonVerticalRef = useRef<HTMLDivElement>(null);
  const ribbonHorizontalRef = useRef<HTMLDivElement>(null);
  const bowRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => giftBoxRef.current!);

  const handleClick = () => {
    const gift = giftBoxRef.current;
    const lid = lidRef.current;
    const ribbonVertical = ribbonVerticalRef.current;
    const ribbonHorizontal = ribbonHorizontalRef.current;
    const bow = bowRef.current;

    if (!gift || !lid || !ribbonVertical || !ribbonHorizontal || !bow) return;

    // Disable further clicks
    gift.style.pointerEvents = 'none';

    const giftRect = gift.getBoundingClientRect();
    const centerX = giftRect.left + giftRect.width / 2;
    const centerY = giftRect.top + giftRect.height / 2;

    const tl = gsap.timeline({
      onComplete: () => {
        // After the bomb is "thrown", hide the gift box
        gsap.to(gift, {
          opacity: 0,
          duration: 0.3,
          ease: 'power1.in',
          onComplete: () => {
            gift.style.display = 'none';
          }
        });
        onOpen({ x: centerX, y: centerY }); // Call onOpen to signal bomb animation
      }
    });

    // 1. Ribbon moves up
    tl.to(ribbonVertical, { y: '-100%', duration: 0.4, ease: 'power2.out' }, 0)
      .to(ribbonHorizontal, { opacity: 0, duration: 0.2 }, 0) // Fade out horizontal ribbon
      .to(bow, { y: '-100%', opacity: 0, duration: 0.4, ease: 'power2.out' }, 0)
      // 2. Lid opens 45 deg
      .to(lid, {
        rotationX: -45, // Rotate around X-axis for opening effect
        y: '-=20', // Lift slightly
        duration: 0.6,
        ease: 'power2.out',
        transformOrigin: 'bottom center',
      }, 0.3) // Start after ribbon moves a bit
      // 3. Lid closes and hides (to simulate bomb being thrown out and box closing)
      .to(lid, {
        rotationX: 0,
        y: '0',
        duration: 0.4,
        ease: 'power2.in',
      }, '+=0.5'); // After a short pause, close the lid
  };

  return (
    <div
      ref={giftBoxRef}
      onClick={handleClick}
      className={cn(
        "relative w-32 h-32 md:w-40 md:h-40 cursor-pointer transition-transform duration-300 hover:scale-110 overflow-hidden",
        className
      )}
      style={{ filter: 'drop-shadow(0 0 15px rgba(255, 0, 255, 0.7))' }}
    >
      {/* Main Box Body */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-3/4 bg-red-500 rounded-lg border-4 border-red-700"
        style={{ boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.2)' }}
      />

      {/* Ribbons (Horizontal and Vertical) */}
      <div ref={ribbonHorizontalRef} className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-8 bg-yellow-300 absolute top-1/2 -translate-y-1/2" />
      </div>
      <div ref={ribbonVerticalRef} className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-full bg-yellow-300 absolute left-1/2 -translate-x-1/2" />
      </div>

      {/* Gift Box Lid */}
      <div
        ref={lidRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[110%] h-1/4 bg-red-500 rounded-lg border-4 border-red-700"
        style={{ boxShadow: '0 5px 10px rgba(0,0,0,0.2)', transformOrigin: 'bottom center', zIndex: 10 }}
      >
        {/* Ribbon on lid */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-8 bg-yellow-300 absolute top-1/2 -translate-y-1/2" />
          <div className="w-8 h-full bg-yellow-300 absolute left-1/2 -translate-x-1/2" />
        </div>
        {/* Bow */}
        <div ref={bowRef} className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-yellow-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
});

export default GiftBox;