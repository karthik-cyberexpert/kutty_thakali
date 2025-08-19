import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mail as MailIcon } from 'lucide-react';

interface MailProps {
  explosionOrigin: { x: number; y: number }; // Where the explosion happened
  onMailClick: () => void; // Callback when mail icon is clicked
  showText: boolean; // Controls "Open Mail!" text visibility
  onMailOpenComplete: () => void; // Callback for when mail opening animation finishes
}

const Mail: React.FC<MailProps> = ({ explosionOrigin, onMailClick, showText, onMailOpenComplete }) => {
  const mailRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mail = mailRef.current;
    if (!mail) return;

    // Initial random position for the mail icon, scattering from the explosion origin
    const randomX = gsap.utils.random(0, window.innerWidth);
    const randomY = gsap.utils.random(0, window.innerHeight);

    gsap.set(mail, {
      x: explosionOrigin.x,
      y: explosionOrigin.y,
      xPercent: -50, // Center the icon
      yPercent: -50,
      scale: 0,
      opacity: 0,
      rotation: gsap.utils.random(0, 360),
    });

    gsap.to(mail, {
      x: randomX,
      y: randomY,
      scale: 1,
      opacity: 1,
      rotation: gsap.utils.random(-20, 20),
      duration: 1.2,
      ease: 'power3.out',
      delay: gsap.utils.random(0, 0.5), // Stagger slightly with other particles
    });

  }, [explosionOrigin]);

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
    const mail = mailRef.current;
    if (!mail) return;

    onMailClick(); // Notify parent to start fading burst and show text

    // Mail opening animation
    gsap.timeline({
      onComplete: onMailOpenComplete // Navigate after this animation
    })
    .to(mail, {
      scale: 1.5,
      rotation: 720,
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onStart: () => {
        // Hide the "Open Mail!" text immediately when mail is clicked
        if (textRef.current) {
          gsap.to(textRef.current, { opacity: 0, y: -20, duration: 0.3 });
        }
      }
    });
  };

  return (
    <div
      ref={mailRef}
      onClick={handleClick}
      className="absolute z-50 flex flex-col items-center justify-center cursor-pointer text-white"
      style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.7))' }}
    >
      <MailIcon size={120} className="text-cyan-400" />
      <div ref={textRef} className="text-3xl font-bold mt-4 animate-pulse">
        Open Mail!
      </div>
    </div>
  );
};

export default Mail;