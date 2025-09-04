"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ParticlesBackground from '@/components/ParticlesBackground';
import MailboxAndLetter from '@/components/MailboxAndLetter';
import { gsap } from 'gsap';
import AnimeCharacter from '@/components/AnimeCharacter'; // Import AnimeCharacter

const MailContent = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPhase, setCurrentPhase] = useState<'mailbox' | 'transition'>(
    location.state?.fromMailOpen ? 'mailbox' : 'transition'
  );

  const birthdayMessage = `Happy Birthday, ${name}! May your day be as bright and beautiful as your smile. Wishing you all the love and happiness in the world.`;

  const handleMailboxClose = useCallback(() => {
    navigate(`/balloons-grid/${name}`);
  }, [name, navigate]);

  useEffect(() => {
    if (currentPhase === 'transition') {
      navigate(`/balloons-grid/${name}`);
    }
  }, [currentPhase, name, navigate]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden p-4">
      <ParticlesBackground />

      {currentPhase === 'mailbox' && (
        <>
          <MailboxAndLetter birthdayMessage={birthdayMessage} onClose={handleMailboxClose} />
          <AnimeCharacter
            src="/images/image-2.svg" // Character reacting to mail
            alt="Mail Anime Character"
            initialX="-100px"
            initialY="20%"
            targetX="10%"
            targetY="20%"
            duration={1.5}
            delay={0.5}
            animationType="float"
            className="w-28 h-auto md:w-36"
          />
        </>
      )}
    </div>
  );
};

export default MailContent;