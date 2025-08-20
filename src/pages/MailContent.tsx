import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ParticlesBackground from '@/components/ParticlesBackground';
import BulletHole from '@/components/BulletHole';
import MailboxAndLetter from '@/components/MailboxAndLetter';
import { Target } from 'lucide-react';
import { gsap } from 'gsap';
import ClickableGun from '@/components/ClickableGun';
import ShotImage from '@/components/ShotImage';

type MailContentPhase = 'mailbox' | 'initialShoot' | 'gunActive';

const MailContent = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPhase, setCurrentPhase] = useState<MailContentPhase>(
    location.state?.fromMailOpen ? 'mailbox' : 'initialShoot'
  );
  const [currentShotIndex, setCurrentShotIndex] = useState(0); // Tracks how many images have been shot
  const [bulletHolePosition, setBulletHolePosition] = useState<{ x: number; y: number } | null>(null);

  // Adjusted to load all 24 images
  const images = Array.from({ length: 24 }, (_, i) => `/images/image-${i + 1}.png`);

  // Define the static target position for the bullet hole (center-right of the screen)
  const holeTargetX = window.innerWidth * 0.75;
  const holeTargetY = window.innerHeight * 0.5;

  const birthdayMessage = `Happy Birthday, ${name}! May your day be as bright and beautiful as your smile. Wishing you all the love and happiness in the world.`;

  const handleMailboxClose = useCallback(() => {
    setCurrentPhase('initialShoot');
  }, []);

  const handleShootNow = useCallback(() => {
    setCurrentPhase('gunActive');
    // Set the bullet hole position immediately when gun becomes active
    setBulletHolePosition({ x: holeTargetX, y: holeTargetY });
  }, [holeTargetX, holeTargetY]);

  const handleGunClick = useCallback(() => {
    if (currentShotIndex < images.length) {
      setCurrentShotIndex(prevIndex => prevIndex + 1);
    }
  }, [currentShotIndex, images.length]);

  // Effect to check if all images have been shot
  useEffect(() => {
    if (currentShotIndex === images.length && currentShotIndex > 0) {
      // All images shot, now transition to final message
      // Add a small delay to let the last image settle
      const timer = setTimeout(() => {
        navigate(`/surprise/${name}`, { state: { phase: 'finalMessage' } });
      }, 1500); // Adjust delay as needed
      return () => clearTimeout(timer);
    }
  }, [currentShotIndex, images.length, name, navigate]);

  // Effect for initial page content animation (already exists)
  useEffect(() => {
    if (currentPhase === 'initialShoot' || currentPhase === 'gunActive') {
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

      {(currentPhase === 'initialShoot' || currentPhase === 'gunActive') && (
        <div className="relative z-10 text-center text-white">
          {currentPhase === 'initialShoot' && (
            <Button
              onClick={handleShootNow}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 animate-fade-in-down"
            >
              Shoot Now <Target className="ml-2" />
            </Button>
          )}

          {currentPhase === 'gunActive' && bulletHolePosition && (
            <>
              <BulletHole x={bulletHolePosition.x} y={bulletHolePosition.y} />
              <ClickableGun onGunClick={handleGunClick} holePosition={bulletHolePosition} />
              {/* Render previously shot images */}
              {Array.from({ length: currentShotIndex }).map((_, index) => (
                <ShotImage
                  key={index}
                  src={images[index]}
                  holePosition={bulletHolePosition}
                  index={index} // Pass index to stagger animation
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MailContent;