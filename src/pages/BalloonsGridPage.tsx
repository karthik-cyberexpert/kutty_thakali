import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import ParticlesBackground from '@/components/ParticlesBackground';
import Balloon from '@/components/Balloon'; // Import the Balloon component
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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

  const [balloons, setBalloons] = useState<BalloonData[]>(initialBalloons);
  const [allBalloonsBurst, setAllBalloonsBurst] = useState(false); // New state to track if all are burst

  // Effect to handle the arrival of the 23rd balloon
  useEffect(() => {
    const flyingBalloonIndex = location.state?.flyingBalloonIndex; // Should be 22 (for 23rd balloon)
    if (typeof flyingBalloonIndex === 'number' && flyingBalloonIndex >= 0 && flyingBalloonIndex < balloons.length) {
      // Temporarily hide the 23rd balloon in the grid until it animates in
      const updatedBalloons = balloons.map((b, idx) =>
        idx === flyingBalloonIndex ? { ...b, isBurst: false } : b
      );
      setBalloons(updatedBalloons);

      // Animate the 23rd balloon into its grid position
      // This requires the Balloon component to be rendered first, then animated
      // We'll rely on the Balloon component's internal animation for its initial appearance
      // and then potentially a separate GSAP timeline here if needed for specific grid placement.
      // For now, the Balloon component's default fade-in will suffice.
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

  // Effect for automatic balloon popping
  useEffect(() => {
    if (allBalloonsBurst) return; // Stop if all are burst

    let popIndex = 0;
    const interval = setInterval(() => {
        // Find the next unburst balloon
        while (popIndex < balloons.length && balloons[popIndex].isBurst) {
            popIndex++;
        }

        if (popIndex < balloons.length) {
            handleBalloonBurst(balloons[popIndex].id);
            popIndex++;
        } else {
            clearInterval(interval); // All burst, stop interval
        }
    }, 2000); // Pop every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount or re-render
  }, [balloons, allBalloonsBurst, handleBalloonBurst]);


  // Effect to handle automatic navigation after all balloons are burst
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (allBalloonsBurst) {
      timer = setTimeout(() => {
        navigate(`/surprise/${name}`, { state: { phase: 'finalMessage' } });
      }, 3000); // 3-second delay
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
            />
          ))}
        </div>
        {/* The "See Final Message" button is removed */}
      </div>
    </div>
  );
};

export default BalloonsGridPage;