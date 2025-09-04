"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import ParticlesBackground from '@/components/ParticlesBackground';
import Balloon from '@/components/Balloon';
// Removed AnimeCharacterSVG import from this page to resolve the error

interface BalloonData {
  id: string;
  imageSrc: string;
  isBurst: boolean;
}

const BalloonsGridPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialBalloons: BalloonData[] = Array.from({ length: 23 }, (_, i) => ({
    id: `balloon-${i + 1}`,
    imageSrc: `/images/image-${i + 1}.png`,
    isBurst: false,
  }));

  const balloonRefs = useRef<(any | null)[]>([]);
  const [balloons, setBalloons] = useState<BalloonData[]>(initialBalloons);
  const [allBalloonsBurst, setAllBalloonsBurst] = useState(false);
  // Removed currentBurstIndex and its related useEffect for auto-bursting

  useEffect(() => {
    const flyingBalloonIndex = location.state?.flyingBalloonIndex;
    if (typeof flyingBalloonIndex === 'number' && flyingBalloonIndex >= 0 && flyingBalloonIndex < balloons.length) {
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

  const handleNextClick = () => {
    navigate(`/surprise/${name}`, { state: { phase: 'finalMessage' } });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden p-4">
      <ParticlesBackground />
      <div className="relative z-10 text-center text-white w-full max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-anime font-bold mb-8 animate-fade-in-down text-cyan-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.7)]">
          Deactivate the Data Nodes, {name}!
        </h1>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 justify-items-center">
          {balloons.map((balloon, index) => (
            <Balloon
              key={balloon.id}
              id={balloon.id}
              imageSrc={balloon.imageSrc}
              isBurst={balloon.isBurst}
              onBurst={handleBalloonBurst}
              className="relative w-24 h-32 md:w-32 md:h-40"
              ref={el => balloonRefs.current[index] = el}
              // Removed isAutoBurstingActive prop as auto-bursting is no longer active
            />
          ))}
        </div>
        {allBalloonsBurst && (
          <button
            onClick={handleNextClick}
            className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-anime py-4 px-10 text-xl rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 border border-pink-400 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]"
          >
            Proceed to Next Phase
          </button>
        )}
      </div>
      {/* Removed AnimeCharacterSVG components from here */}
    </div>
  );
};

export default BalloonsGridPage;