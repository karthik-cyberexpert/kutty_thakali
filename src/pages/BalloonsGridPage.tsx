import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import ParticlesBackground from '@/components/ParticlesBackground';
import Balloon from '@/components/Balloon'; // Import the Balloon component

interface BalloonData {
  id: string;
  imageSrc: string;
  isBurst: boolean;
}

const BalloonsGridPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Generate 23 balloon data objects (22 pre-existing + 1 flying in)
  const initialBalloons: BalloonData[] = Array.from({ length: 23 }, (_, i) => ({
    id: `balloon-${i + 1}`,
    imageSrc: `/images/image-${i + 1}.png`, // Assuming images from 1 to 23
    isBurst: false,
  }));

  const balloonRefs = useRef<(any | null)[]>([]); // Array to hold refs for each balloon
  const [balloons, setBalloons] = useState<BalloonData[]>(initialBalloons);
  const [allBalloonsBurst, setAllBalloonsBurst] = useState(false); // New state to track if all are burst
  const [currentBurstIndex, setCurrentBurstIndex] = useState(0); // Start at 0 to burst the first balloon immediately

  // Effect to handle the arrival of the 23rd balloon (if coming from MailContent)
  useEffect(() => {
    const flyingBalloonIndex = location.state?.flyingBalloonIndex; // Should be 22 (for 23rd balloon)
    if (typeof flyingBalloonIndex === 'number' && flyingBalloonIndex >= 0 && flyingBalloonIndex < balloons.length) {
      // Ensure the 23rd balloon is not marked as burst initially if it just flew in
      setBalloons(prevBalloons => prevBalloons.map((b, idx) =>
        idx === flyingBalloonIndex ? { ...b, isBurst: false } : b
      ));
    }
  }, [location.state]);

  const handleBalloonBurst = useCallback((id: string) => {
    setBalloons(prevBalloons => {
      const updatedBalloons = prevBalloons.map(balloon =>
        balloon.id === id ? { ...balloon, isBurst: true } : balloon
      );
      // Check if all balloons are burst
      if (updatedBalloons.every(b => b.isBurst)) {
        setAllBalloonsBurst(true); // Set state to true when all are burst
      }
      return updatedBalloons;
    });
  }, []);

  // Effect to manage automatic bursting
  useEffect(() => {
    if (currentBurstIndex < initialBalloons.length) {
      const timer = setTimeout(() => {
        if (balloonRefs.current[currentBurstIndex]) {
          balloonRefs.current[currentBurstIndex].burstBalloon();
        }
        setCurrentBurstIndex(prevIndex => prevIndex + 1);
      }, 2000); // Burst every 2 seconds

      return () => clearTimeout(timer);
    }
  }, [currentBurstIndex, initialBalloons.length]);

  // Effect to handle automatic navigation after all balloons are burst
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (allBalloonsBurst) {
      timer = setTimeout(() => {
        navigate(`/surprise/${name}`, { state: { phase: 'finalMessage' } });
      }, 5000); // 5-second delay
    }
    return () => clearTimeout(timer); // Clean up the timer
  }, [allBalloonsBurst, name, navigate]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden p-4">
      <ParticlesBackground />
      <div className="relative z-10 text-center text-white w-full max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 animate-fade-in-down">
          Pop the Balloons, {name}!
        </h1>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 justify-items-center">
          {balloons.map((balloon, index) => (
            <Balloon
              key={balloon.id}
              id={balloon.id}
              imageSrc={balloon.imageSrc}
              isBurst={balloon.isBurst}
              onBurst={handleBalloonBurst}
              className="relative w-24 h-32 md:w-32 md:h-40" // Fixed size for grid items
              ref={el => balloonRefs.current[index] = el} // Assign ref
              isAutoBurstingActive={currentBurstIndex < initialBalloons.length} // True if auto-bursting is ongoing
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BalloonsGridPage;