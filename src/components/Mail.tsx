import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mail as MailIcon } from 'lucide-react'; // Import Mail icon

interface MailProps {
  explosionOrigin: { x: number; y: number }; // Where the explosion happened (used for initial set, but then moves to center)
  onMailClick: () => void; // Callback when mail icon is clicked
  onMailOpenComplete: () => void; // Callback for when mail opening animation finishes
}

const Mail: React.FC<MailProps> = ({ explosionOrigin, onMailClick, onMailOpenComplete }) => {
  const mailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mail = mailRef.current;
    if (!mail) return;

    // Calculate the center of the screen
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    // Set initial position to the explosion origin, then animate to the center
    gsap.set(mail, {
      x: explosionOrigin.x,
      y: explosionOrigin.y,
      xPercent: -50, // Center the icon
      yPercent: -50,
      scale: 0,
      opacity: 0,
      rotation: gsap.utils.random(0, 360),
    });

    // Animate the mail icon to the center of the screen
    gsap.to(mail, {
      x: screenCenterX,
      y: screenCenterY,
      scale: 1,
      opacity: 1,
      rotation: 0, // Stop rotation
      duration: 0.8,
      ease: 'back.out(1.7)',
      delay: 0.2, // Small delay after explosion
    });

  }, [explosionOrigin]);

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
      className="absolute z-50 cursor-pointer text-white"
      style={{ textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(0,255,255,0.8)' }}
    >
      <MailIcon size={100} />
    </div>
  );
};

export default Mail;