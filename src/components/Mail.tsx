import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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

    // Define a central area for the mail icon to scatter to (e.g., central 40% of the screen)
    const centralAreaPercentage = 0.4; 
    const minX = window.innerWidth * (0.5 - centralAreaPercentage / 2);
    const maxX = window.innerWidth * (0.5 + centralAreaPercentage / 2);
    const minY = window.innerHeight * (0.5 - centralAreaPercentage / 2);
    const maxY = window.innerHeight * (0.5 + centralAreaPercentage / 2);

    // Initial random position for the mail icon, scattering from the explosion origin
    const randomX = gsap.utils.random(minX, maxX);
    const randomY = gsap.utils.random(minY, maxY);

    gsap.set(mail, {
      x: explosionOrigin.x,
      y: explosionOrigin.y,
      xPercent: -50, // Center the icon
      yPercent: -50,
      scale: 0,
      opacity: 0,
      rotation: gsap.utils.random(0, 360),
    });

    const scatterDuration = 1.2;
    const scatterDelay = gsap.utils.random(0, 0.5);

    gsap.to(mail, {
      x: randomX,
      y: randomY,
      scale: 1,
      opacity: 1,
      rotation: gsap.utils.random(-20, 20),
      duration: scatterDuration,
      ease: 'power3.out',
      delay: scatterDelay,
      onComplete: () => {
        // After scattering, start a continuous floating animation
        gsap.to(mail, {
          y: '+=15', // Move up and down by 15px
          rotation: '+=5', // Subtle continuous rotation
          duration: 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1, // Infinite repeat
        });
      }
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
      className="absolute z-50 flex flex-col items-center justify-center cursor-pointer text-white text-7xl" // Reduced size to text-7xl
      style={{ textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(0,255,255,0.8)' }}
    >
      ✉️
    </div>
  );
};

export default Mail;