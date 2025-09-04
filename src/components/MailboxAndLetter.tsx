"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MailboxAndLetterProps {
  birthdayMessage: string;
  onClose: () => void;
}

const MailboxAndLetter: React.FC<MailboxAndLetterProps> = ({ birthdayMessage, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mailboxRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const mailbox = mailboxRef.current;
    const lid = lidRef.current;
    const letter = letterRef.current;
    const closeButton = closeButtonRef.current;

    if (!container || !mailbox || !lid || !letter || !closeButton) return;

    gsap.set(lid, { rotationX: 0, transformOrigin: 'bottom center' });
    gsap.set(letter, { y: '100%', opacity: 0 });
    gsap.set(closeButton, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(lid, { rotationX: -90, duration: 0.5, ease: 'power2.out' })
      .to(letter, { y: '0%', opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.2')
      .to(closeButton, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.5');

  }, []);

  const handleCloseClick = () => {
    const container = containerRef.current;
    const letter = letterRef.current;
    const closeButton = closeButtonRef.current;

    if (!container || !letter || !closeButton) return;

    gsap.timeline({ onComplete: onClose })
      .to(closeButton, { opacity: 0, y: 20, duration: 0.3, ease: 'power1.in' }, 0)
      .to(letter, { y: '100%', opacity: 0, duration: 0.5, ease: 'power1.in' }, 0.1)
      .to(container, { opacity: 0, scale: 0.8, duration: 0.5, ease: 'power1.in' }, 0.3);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4">
      <div ref={mailboxRef} className="relative w-80 h-96 md:w-96 md:h-[500px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-2xl border-4 border-cyan-700 flex flex-col items-center justify-end overflow-hidden drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]"> {/* Futuristic mailbox */}
        {/* Mailbox Body */}
        <div className="w-full h-full bg-gray-700 rounded-b-lg" />

        {/* Mailbox Lid */}
        <div
          ref={lidRef}
          className="absolute top-0 left-0 w-full h-1/4 bg-gray-900 rounded-t-lg border-b-4 border-cyan-800"
          style={{ transformOrigin: 'bottom center' }}
        />

        {/* Letter - Holographic/Digital feel */}
        <div
          ref={letterRef}
          className="absolute w-[80%] h-[90%] bg-gradient-to-br from-blue-900/80 to-purple-900/80 rounded-lg shadow-lg p-6 flex flex-col justify-between items-center text-center text-cyan-300 border border-cyan-500 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" // Holographic letter
          style={{ transform: 'translateY(100%)' }}
        >
          <p className="text-xl md:text-2xl font-anime text-cyan-300 leading-relaxed mb-4 flex-grow overflow-y-auto drop-shadow-[0_0_5px_rgba(0,255,255,0.3)]">
            {birthdayMessage}
          </p>
          <Button
            ref={closeButtonRef}
            onClick={handleCloseClick}
            className={cn(
              "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-anime py-3 px-8 text-lg rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 border border-pink-400 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]", // Glowing button
              "w-full max-w-xs mt-auto"
            )}
          >
            Close Transmission
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MailboxAndLetter;