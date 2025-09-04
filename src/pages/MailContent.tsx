import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ParticlesBackground from '@/components/ParticlesBackground';
import MailboxAndLetter from '@/components/MailboxAndLetter';
import { gsap } from 'gsap';

const MailContent = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // The only phase now is 'mailbox'
  const [currentPhase, setCurrentPhase] = useState<'mailbox' | 'transition'>(
    location.state?.fromMailOpen ? 'mailbox' : 'transition' // Start with mailbox if navigated from mail open, otherwise directly transition
  );

  const birthdayMessage = `Happy Birthday, ${name}! Wishing you a very special day filled with joy and surprises! May your year ahead be as wonderful and unique as you are. Enjoy your day to the fullest! 🎉🎂🎈`;

  const handleMailboxClose = useCallback(() => {
    // Directly navigate to the balloons grid page after closing the mailbox
    navigate(`/balloons-grid/${name}`);
  }, [name, navigate]);

  // Effect for initial page content animation (if not coming from mail open)
  useEffect(() => {
    if (currentPhase === 'transition') {
      // If we're not showing the mailbox, immediately navigate
      navigate(`/balloons-grid/${name}`);
    }
  }, [currentPhase, name, navigate]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden p-4">
      <ParticlesBackground />

      {currentPhase === 'mailbox' && (
        <MailboxAndLetter birthdayMessage={birthdayMessage} onClose={handleMailboxClose} />
      )}
    </div>
  );
};

export default MailContent;