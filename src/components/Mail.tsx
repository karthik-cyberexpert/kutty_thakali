import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mail as MailIcon } from 'lucide-react'; // Import Mail icon

interface MailProps {
  explosionOrigin: { x: number; y: number }; // Where the explosion happened
  onMailClick: () => void; // Callback when mail icon is clicked
  onMailOpenComplete: () => void; // Callback for when mail opening animation finishes
}

const Mail: React.FC<MailProps> = ({ explosionOrigin, onMailClick, onMailOpenComplete }) => {
  const mailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mail = mailRef.current;
    if (!mail) return;

    // Ensure it's visible and clickable from the start of this phase
    gsap.set(mail, { opacity: 1, scale: 1, rotation: 0 }); // Reset any previous GSAP states if component re-renders

    // Start a continuous floating animation immediately
    gsap.to(mail, {
      y: '+=15', // Move up and down by 15px
      rotation: '+=5', // Subtle continuous rotation
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1, // Infinite repeat
    });

  }, []); // No dependencies, runs once on mount

  const handleClick = () => {
    const mail = mailRef.current;
    if (!mail) return;

    onMailClick(); // Notify parent to start fading burst and hide "Find a mail box" text

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
    });
  };

  return (
    <div
      ref={mailRef}
      onClick={handleClick}
      // Use flexbox to center the content within the absolute container
      className="absolute inset-0 flex items-center justify-center z-50 cursor-pointer text-white"
      style={{ textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(0,255,255,0.8)' }}
    >
      <MailIcon size={100} /> {/* Use MailIcon with a specific size */}
    </div>
  );
};

export default Mail;