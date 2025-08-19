import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ParticlesBackground from '@/components/ParticlesBackground';
import GunAnimation from '@/components/GunAnimation';
import BulletHole from '@/components/BulletHole';
import PhotoTrain from '@/components/PhotoTrain';
import MailboxAndLetter from '@/components/MailboxAndLetter';
import { Target } from 'lucide-react';
import { gsap } from 'gsap';

type MailContentPhase = 'mailbox' | 'initialShoot' | 'shooting' | 'photos';

const MailContent = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPhase, setCurrentPhase] = useState<MailContentPhase>(
    location.state?.fromMailOpen ? 'mailbox' : 'initialShoot'
  );
  const [bulletHolePosition, setBulletHolePosition] = useState<{ x: number; y: number } | null>(null);
  const images = Array.from({ length: 23 }, (_, i) => `/images/image-${i + 1}.png`);

  const birthdayMessage = `Happy Birthday, ${name}! May your day be as bright and beautiful as your smile. Wishing you all the love and happiness in the world.`;

  const handleMailboxClose = useCallback(() => {
    setCurrentPhase('initialShoot');
  }, []);

  const handleShootNow = useCallback(() => {
    setCurrentPhase('shooting'); // Transition to shooting phase
  }, []);

  const handleGunShotComplete = useCallback((holePos: { x: number; y: number }) => {
    setBulletHolePosition(holePos);
    setCurrentPhase('photos'); // Transition to photos phase
  }, []);

  const handlePhotoTrainComplete = useCallback(() => {
    // After photo train, navigate back to Surprise page to show final message
    navigate(`/surprise/${name}`, { state: { phase: 'finalMessage' } });
  }, [name, navigate]);

  // Effect to handle initial animation of the page content (for shoot/photos phases)
  useEffect(() => {
    if (currentPhase === 'initialShoot' || currentPhase === 'shooting' || currentPhase === 'photos') {
      gsap.fromTo(".mail-content-container",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }
  }, [currentPhase]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden p-4 mail-content-container">
      <ParticlesBackground />

      {currentPhase === 'mailbox' && (
        <MailboxAndLetter birthdayMessage={birthdayMessage} onClose={handleMailboxClose} />
      )}

      {(currentPhase === 'initialShoot' || currentPhase === 'shooting' || currentPhase === 'photos') && (
        <div className="relative z-10 text-center text-white">
          {/* Removed the h1 tag that displayed the message */}
          {currentPhase === 'initialShoot' && (
            <Button
              onClick={handleShootNow}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 animate-fade-in-down"
            >
              Shoot Now <Target className="ml-2" />
            </Button>
          )}

          {(currentPhase === 'shooting' || currentPhase === 'photos') && (
            <>
              {currentPhase === 'shooting' && !bulletHolePosition && <GunAnimation onShotComplete={handleGunShotComplete} />}
              {bulletHolePosition && <BulletHole x={bulletHolePosition.x} y={bulletHolePosition.y} />}
              {bulletHolePosition && <PhotoTrain images={images} onComplete={handlePhotoTrainComplete} holePosition={bulletHolePosition} />}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MailContent;