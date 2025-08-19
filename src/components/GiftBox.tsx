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
  const baseRef = useRef<HTMLDivElement>(null); 

  useImperativeHandle(ref, () => giftBoxRef.current!);

  const handleClick = () => {
    const gift = giftBoxRef.current;
    const lid = lidRef.current;

    if (!gift || !lid) return;

    // Disable further clicks
    gift.style.pointerEvents = 'none';

    const giftRect = gift.getBoundingClientRect();
    const centerX = giftRect.left + giftRect.width / 2;
    const centerY = giftRect.top + giftRect.height / 2;

    const tl = gsap.timeline({
      onComplete: () => {
        onOpen({ x: centerX, y: centerY }); // Call onOpen after lid animation
      }
    });

    // Animate the lid opening
    tl.to(lid, {
      y: -giftRect.height * 0.6, // Move lid up
      rotation: -20, // Rotate lid slightly
      duration: 0.5,
      ease: 'power2.out',
    })
    .to(lid, {
      opacity: 0,
      scale: 0.5,
      duration: 0.3,
      ease: 'power1.in',
      onComplete: () => {
        lid.style.display = 'none'; // Hide lid after animation
      }
    }, "-=0.2"); 
  };

  return (
    <div
      ref={giftBoxRef}
      onClick={handleClick}
      className={cn(
        "relative w-32 h-32 md:w-40 md:h-40 cursor-pointer transition-transform duration-300 hover:scale-110",
        className
      )}
      style={{ filter: 'drop-shadow(0 0 20px #ff00ff)' }}
    >
      {/* Gift Box Base */}
      <div
        ref={baseRef} 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-3/4 bg-yellow-500 rounded-lg border-4 border-red-600"
        style={{ boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.2)' }}
      >
        {/* Ribbon on base */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-8 bg-red-600 absolute top-1/2 -translate-y-1/2"></div>
          <div className="w-8 h-full bg-red-600 absolute left-1/2 -translate-x-1/2"></div>
        </div>
      </div>

      {/* Gift Box Lid */}
      <div
        ref={lidRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[110%] h-1/4 bg-yellow-500 rounded-lg border-4 border-red-600"
        style={{ boxShadow: '0 5px 10px rgba(0,0,0,0.2)' }}
      >
        {/* Ribbon on lid */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-8 bg-red-600 absolute top-1/2 -translate-y-1/2"></div>
          <div className="w-8 h-full bg-red-600 absolute left-1/2 -translate-x-1/2"></div>
        </div>
        {/* Bow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-red-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
});

export default GiftBox;