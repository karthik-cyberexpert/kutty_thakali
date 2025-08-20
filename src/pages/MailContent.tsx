import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ParticlesBackground from '@/components/ParticlesBackground';
import BulletHole from '@/components/BulletHole';
import MailboxAndLetter from '@/components/MailboxAndLetter';
import { Target } from 'lucide-react';
import { gsap } from 'gsap';
import ClickableGun from '@/components/ClickableGun';
import Balloon from '@/components/Balloon'; // Import the new Balloon component

type MailContentPhase = 'mailbox' | 'initialShoot' | 'gunActive';

const MailContent = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPhase, setCurrentPhase] = useState<MailContentPhase>(
    location.state?.fromMailOpen ? 'mailbox' : 'initialShoot'
  );
  const [bulletHolePosition, setBulletHolePosition] = useState<{ x: number; y: number } | null>(null);
  const balloonRef = useRef<{ cutRopeAndFly: () => void }>(null); // Ref to call method on Balloon

  const birthdayMessage = `Happy Birthday, ${name}! May your day be as bright and beautiful as your smile. Wishing you all the love and happiness in the world.`;

  // Define the static target position for the bullet hole (center-right of the screen)
  // This will be where the balloon's rope is
  const holeTargetX = window.innerWidth * 0.75;
  const holeTargetY = window.innerHeight * 0.5;

  const handleMailboxClose = useCallback(() => {
    setCurrentPhase('initialShoot');
  }, []);

  const handleShootNow = useCallback(() => {
    setCurrentPhase('gunActive');
    // Set the bullet hole position immediately when gun becomes active
    setBulletHolePosition({ x: holeTargetX, y: holeTargetY });
  }, [holeTargetX, holeTargetY]);

  const handleGunClick = useCallback(() => {
    if (balloonRef.current) {
      balloonRef.current.cutRopeAndFly(); // Trigger the balloon's animation
    }
  }, []);

  const handleInitialBalloonFlyUpComplete = useCallback(() => {
    // Once the first balloon flies up, navigate to the new BalloonsGridPage
    navigate(`/balloons-grid/${name}`, { state: { flyingBalloonIndex: 22 } }); // Pass index for the 23rd balloon (0-indexed)
  }, [name, navigate]);

  // Effect for initial page content animation
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
              {/* Bullet hole will appear where the rope is shot */}
              <BulletHole x={bulletHolePosition.x} y={bulletHolePosition.y} />
              <ClickableGun onGunClick={handleGunClick} holePosition={bulletHolePosition} />
              <Balloon
                ref={balloonRef}
                id="initial-balloon"
                imageSrc="/images/image-23.png" // This will be the 23rd image
                initialX={holeTargetX}
                initialY={holeTargetY - 150} // Position balloon above the rope target
                isInitialBalloon={true}
                onFlyUpComplete={handleInitialBalloonFlyUpComplete}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MailContent;