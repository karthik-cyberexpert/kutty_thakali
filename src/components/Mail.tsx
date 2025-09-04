"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mail as MailIcon } from 'lucide-react';

interface MailProps {
  explosionOrigin: { x: number; y: number };
  onMailClick: () => void;
  onMailOpenComplete: () => void;
}

const Mail: React.FC<MailProps> = ({ explosionOrigin, onMailClick, onMailOpenComplete }) => {
  const mailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mail = mailRef.current;
    if (!mail) return;

    gsap.set(mail, { opacity: 1, scale: 1, rotation: 0 });

    gsap.to(mail, {
      y: '+=15',
      rotation: '+=5',
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

  }, []);

  const handleClick = () => {
    const mail = mailRef.current;
    if (!mail) return;

    onMailClick();

    gsap.timeline({
      onComplete: onMailOpenComplete
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
      className="absolute inset-0 flex items-center justify-center z-50 cursor-pointer text-purple-400 drop-shadow-[0_0_10px_rgba(255,0,255,0.7)]" // Neon purple mail icon
    >
      <MailIcon size={40} />
    </div>
  );
};

export default Mail;