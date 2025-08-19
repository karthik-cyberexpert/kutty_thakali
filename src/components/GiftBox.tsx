import { useRef, forwardRef, useImperativeHandle } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface GiftBoxProps {
  onOpen: (position: { x: number; y: number }) => void;
  className?: string;
}

const GiftBox = forwardRef<HTMLDivElement, GiftBoxProps>(({ onOpen, className }, ref) => {
  const giftBoxRef = useRef<HTMLDivElement>(null);
  const borderTopRef = useRef<HTMLDivElement>(null);
  const borderBottomRef = useRef<HTMLDivElement>(null);
  const borderLeftRef = useRef<HTMLDivElement>(null);
  const borderRightRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => giftBoxRef.current!);

  const handleClick = () => {
    const gift = giftBoxRef.current;
    const borderTop = borderTopRef.current;
    const borderBottom = borderBottomRef.current;
    const borderLeft = borderLeftRef.current;
    const borderRight = borderRightRef.current;
    const glow = glowRef.current;

    if (!gift || !borderTop || !borderBottom || !borderLeft || !borderRight || !glow) return;

    // Disable further clicks
    gift.style.pointerEvents = 'none';

    const giftRect = gift.getBoundingClientRect();
    const centerX = giftRect.left + giftRect.width / 2;
    const centerY = giftRect.top + giftRect.height / 2;

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the box elements to make way for the burst
        gsap.to([borderTop, borderBottom, borderLeft, borderRight, gift], {
          opacity: 0,
          duration: 0.3,
          ease: 'power1.in',
          onComplete: () => {
            // Hide elements completely after fading
            if (borderTop) borderTop.style.display = 'none';
            if (borderBottom) borderBottom.style.display = 'none';
            if (borderLeft) borderLeft.style.display = 'none';
            if (borderRight) borderRight.style.display = 'none';
            if (gift) gift.style.display = 'none';
          }
        });
        onOpen({ x: centerX, y: centerY }); // Call onOpen after animation
      }
    });

    // Animate the borders expanding outwards and fading
    tl.to(borderTop, { y: '-100%', opacity: 0, duration: 0.5, ease: 'power2.out' }, 0)
      .to(borderBottom, { y: '100%', opacity: 0, duration: 0.5, ease: 'power2.out' }, 0)
      .to(borderLeft, { x: '-100%', opacity: 0, duration: 0.5, ease: 'power2.out' }, 0)
      .to(borderRight, { x: '100%', opacity: 0, duration: 0.5, ease: 'power2.out' }, 0)
      // Animate the internal glow
      .fromTo(glow,
        { scale: 0, opacity: 0 },
        { scale: 1.5, opacity: 1, duration: 0.5, ease: 'power2.out' },
        0.2 // Start glow slightly after borders begin to move
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
        "relative w-32 h-32 md:w-40 md:h-40 cursor-pointer transition-transform duration-300 hover:scale-110 overflow-hidden",
        className
      )}
      style={{ filter: 'drop-shadow(0 0 20px #ff00ff)' }}
    >
      {/* Main Box Body - Dark, subtle background */}
      <div className="absolute inset-0 bg-gray-950/50 rounded-lg" />

      {/* Glowing Borders */}
      <div
        ref={borderTopRef}
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"
        style={{ boxShadow: '0 0 10px #ff00ff' }}
      />
      <div
        ref={borderBottomRef}
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"
        style={{ boxShadow: '0 0 10px #ff00ff' }}
      />
      <div
        ref={borderLeftRef}
        className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500"
        style={{ boxShadow: '0 0 10px #ff00ff' }}
      />
      <div
        ref={borderRightRef}
        className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500"
        style={{ boxShadow: '0 0 10px #ff00ff' }}
      />

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