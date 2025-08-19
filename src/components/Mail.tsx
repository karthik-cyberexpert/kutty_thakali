import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Mail as MailIcon } from 'lucide-react';

interface MailProps {
  onMailClick: () => void;
}

const Mail: React.FC<MailProps> = ({ onMailClick }) => {
  const mailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mail = mailRef.current;
    if (!mail) return;

    gsap.fromTo(mail,
      { opacity: 0, scale: 0.5, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'elastic.out(1, 0.5)', delay: 0.5 }
    );
  }, []);

  return (
    <div
      ref={mailRef}
      onClick={onMailClick}
      className="absolute z-50 flex flex-col items-center justify-center cursor-pointer text-white"
      style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.7))' }}
    >
      <MailIcon size={120} className="text-cyan-400 animate-bounce" />
      <p className="text-3xl font-bold mt-4 animate-pulse">Open Mail!</p>
    </div>
  );
};

export default Mail;