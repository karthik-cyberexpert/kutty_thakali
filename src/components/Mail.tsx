import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mail as MailIcon } from 'lucide-react';

interface MailProps {
  onMailClick: () => void;
  showText: boolean; // New prop to control text visibility/animation
}

const Mail: React.FC<MailProps> = ({ onMailClick, showText }) => {
  const mailRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mail = mailRef.current;
    if (!mail) return;

    // Initial animation for the mail icon itself
    gsap.fromTo(mail,
      { opacity: 0, scale: 0.5, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'elastic.out(1, 0.5)', delay: 0.5 }
    );
  }, []);

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    if (showText) {
      gsap.fromTo(textElement,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 }
      );
    } else {
      gsap.set(textElement, { opacity: 0, y: 20 }); // Keep hidden initially
    }
  }, [showText]);

  const handleClick = () => {
    onMailClick(); // This will trigger the parent to set showText to true
  };

  return (
    <div
      ref={mailRef}
      onClick={handleClick}
      className="absolute z-50 flex flex-col items-center justify-center cursor-pointer text-white"
      style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.7))' }}
    >
      <MailIcon size={120} className="text-cyan-400 animate-bounce" />
      <div ref={textRef} className="text-3xl font-bold mt-4 animate-pulse">
        Open Mail!
      </div>
    </div>
  );
};

export default Mail;