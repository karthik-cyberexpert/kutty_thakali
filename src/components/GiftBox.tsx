"use client";

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

    gift.style.pointerEvents = 'none';

    const giftRect = gift.getBoundingClientRect();
    const centerX = giftRect.left + giftRect.width / 2;
    const centerY = giftRect.top + giftRect.height / 2;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(gift, {
          opacity: 0,
          duration: 0.3,
          ease: 'power1.in',
          onComplete: () => {
            gift.style.display = 'none';
          }
        });
        onOpen({ x: centerX, y: centerY });
      }
    });

    // Futuristic ribbon animation
    tl.to(ribbonVertical, { y: '-100%', opacity: 0, duration: 0.4, ease: 'power2.out' }, 0)
      .to(ribbonHorizontal, { opacity: 0, duration: 0.2 }, 0)
      .to(bow, { y: '-100%', opacity: 0, duration: 0.4, ease: 'power2.out' }, 0)
      // Lid opens with a techy feel
      .to(lid, {
        rotationX: -45,
        y: '-=20',
        duration: 0.6,
        ease: 'power2.out',
        transformOrigin: 'bottom center',
        backgroundColor: '#00FFFF', // Neon color for lid interior
        boxShadow: '0 0 20px rgba(0,255,255,0.7)', // Neon glow
      }, 0.3)
      .to(lid, {
        rotationX: 0,
        y: '0',
        duration: 0.4,
        ease: 'power2.in',
        backgroundColor: '#4A0E6E', // Back to dark purple
        boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
      }, '+=0.5');
  };

  return (
    <div
      ref={giftBoxRef}
      onClick={handleClick}
      className={cn(
        "relative w-32 h-32 md:w-40 md:h-40 cursor-pointer transition-transform duration-300 hover:scale-110 overflow-hidden",
        className
      )}
      style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.7))' }} // Neon glow for the whole box
    >
      {/* Main Box Body - Dark metallic/techy look */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-3/4 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg border-4 border-cyan-700" // Darker, metallic gradient
        style={{ boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.5), 0 0 15px rgba(0,255,255,0.3)' }} // Inner shadow and subtle neon glow
      />

      {/* Ribbons - Glowing lines */}
      <div ref={ribbonHorizontalRef} className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-4 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-1/2 -translate-y-1/2 shadow-lg shadow-cyan-400/50" /> {/* Glowing cyan ribbon */}
      </div>
      <div ref={ribbonVerticalRef} className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent absolute left-1/2 -translate-x-1/2 shadow-lg shadow-cyan-400/50" /> {/* Glowing cyan ribbon */}
      </div>

      {/* Gift Box Lid - Dark metallic/techy look */}
      <div
        ref={lidRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[110%] h-1/4 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg border-4 border-cyan-700" // Darker, metallic gradient
        style={{ boxShadow: '0 5px 10px rgba(0,0,0,0.5), 0 0 15px rgba(0,255,255,0.3)', transformOrigin: 'bottom center', zIndex: 10 }}
      >
        {/* Ribbon on lid */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-4 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-1/2 -translate-y-1/2" />
          <div className="w-4 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent absolute left-1/2 -translate-x-1/2" />
        </div>
        {/* Bow - Glowing core */}
        <div ref={bowRef} className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-400/70">
          <div className="w-8 h-8 bg-cyan-200 rounded-full shadow-inner shadow-white/50"></div>
        </div>
      </div>
    </div>
  );
});

export default GiftBox;