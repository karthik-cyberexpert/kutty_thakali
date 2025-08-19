import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ParticlesBackground from '@/components/ParticlesBackground';
import GunAnimation from '@/components/GunAnimation';
import BulletHole from '@/components/BulletHole';
import PhotoTrain from '@/components/PhotoTrain';
import { Target } from 'lucide-react'; // Removed ArrowLeft
import { gsap } from 'gsap';

const MailContent = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [showShootButton, setShowShootButton] = useState(true);
  const [bulletHolePosition, setBulletHolePosition] = useState<{ x: number; y: number } | null>(null);
  const images = Array.from({ length: 23 }, (_, i) => `/images/image-${i + 1}.png`);

  const handleShootNow = useCallback(() => {
    setShowShootButton(false); // Hide the button
  }, []);

  const handleGunShotComplete = useCallback((holePos: { x: number; y: number }) => {
    setBulletHolePosition(holePos);
  }, []);

  const handlePhotoTrainComplete = useCallback(() => {
    // After photo train, navigate back to Surprise page to show final message
    navigate(`/surprise/${name}`, { state: { phase: 'finalMessage' } });
  }, [name, navigate]);

  // Effect to handle initial animation of the page content
  useEffect(() => {
    gsap.fromTo(".mail-content-container",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden p-4 mail-content-container">
      <ParticlesBackground />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in-down">
          A Special Message for {name}!
        </h1>

        {showShootButton && (
          <Button
            onClick={handleShootNow}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 animate-fade-in-down"
          >
            Shoot Now <Target className="ml-2" />
          </Button>
        )}

        {!showShootButton && (
          <>
            {!bulletHolePosition && <GunAnimation onShotComplete={handleGunShotComplete} />}
            {bulletHolePosition && <BulletHole x={bulletHolePosition.x} y={bulletHolePosition.y} />}
            {bulletHolePosition && <PhotoTrain images={images} onComplete={handlePhotoTrainComplete} holePosition={bulletHolePosition} />}
          </>
        )}
      </div>
    </div>
  );
};

export default MailContent;