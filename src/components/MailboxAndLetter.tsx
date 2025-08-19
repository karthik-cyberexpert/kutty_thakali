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

    // Initial states
    gsap.set(container, { opacity: 0, scale: 0.8 });
    gsap.set(lid, { rotationX: 0, transformOrigin: 'bottom center' });
    gsap.set(letter, { y: '100%', opacity: 0 });
    gsap.set(closeButton, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ delay: 0.5 });

    // 1. Mailbox appears
    tl.to(container, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' })
      // 2. Lid opens
      .to(lid, { rotationX: -90, duration: 0.5, ease: 'power2.out' }, '+=0.5')
      // 3. Letter slides out
      .to(letter, { y: '0%', opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.2')
      // 4. Close button appears
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
      <div ref={mailboxRef} className="relative w-80 h-96 md:w-96 md:h-[500px] bg-gray-700 rounded-lg shadow-2xl border-4 border-gray-800 flex flex-col items-center justify-end overflow-hidden">
        {/* Mailbox Body */}
        <div className="w-full h-full bg-gray-600 rounded-b-lg" />

        {/* Mailbox Lid */}
        <div
          ref={lidRef}
          className="absolute top-0 left-0 w-full h-1/4 bg-gray-800 rounded-t-lg border-b-4 border-gray-900"
          style={{ transformOrigin: 'bottom center' }}
        />

        {/* Letter */}
        <div
          ref={letterRef}
          className="absolute w-[80%] h-[90%] bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between items-center text-center text-gray-800 border border-gray-200"
          style={{ transform: 'translateY(100%)' }}
        >
          <p className="text-xl md:text-2xl font-script text-purple-800 leading-relaxed mb-4 flex-grow overflow-y-auto">
            {birthdayMessage}
          </p>
          <Button
            ref={closeButtonRef}
            onClick={handleCloseClick}
            className={cn(
              "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 text-lg rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105",
              "w-full max-w-xs mt-auto"
            )}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MailboxAndLetter;