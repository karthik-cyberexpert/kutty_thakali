"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import ParticlesBackground from '@/components/ParticlesBackground';
import Balloon from '@/components/Balloon';
import AnimeCharacterSVG from '@/components/AnimeCharacterSVG'; // Ensure this import is correct

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
  const [currentBurstIndex, setCurrentBurstIndex] = useState(0);

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
      if (updatedBalloons.every(b => b.isBurst)) {
        setAllBalloonsBurst(true);
      }
      return updatedBalloons;
    });
  }, []);

  useEffect(() => {
    if (currentBurstIndex < initialBalloons.length) {
      const timer = setTimeout(() => {
        if (balloonRefs.current[currentBurstIndex]) {
          balloonRefs.current[currentBurstIndex].burstBalloon();
        }
        setCurrentBurstIndex(prevIndex => prevIndex + 1);
      }, 450);

      return () => clearTimeout(timer);
    }
  }, [currentBurstIndex, initialBalloons.length]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (allBalloonsBurst) {
      timer = setTimeout(() => {
        navigate(`/surprise/${name}`, { state: { phase: 'finalMessage' } });
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [allBalloonsBurst, name, navigate]);

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
              isAutoBurstingActive={currentBurstIndex < initialBalloons.length}
            />
          ))}
        </div>
      </div>
      {currentBurstIndex < initialBalloons.length && (
        <AnimeCharacterSVG
          expression="surprised"
          characterColor="#FFFF00" // Neon Yellow
          alt="Balloon Popping Character"
          initialX="100%"
          initialY="50%"
          targetX="80%"
          targetY="50%"
          duration={1}
          delay={0.5}
          animationType="float"
          className="w-28 h-auto md:w-36"
        />
      )}
      {allBalloonsBurst && (
        <AnimeCharacterSVG
          expression="celebrating"
          characterColor="#00FFFF" // Neon Cyan
          alt="Celebrating Balloons Burst"
          initialX="-100px"
          initialY="50%"
          targetX="15%"
          targetY="50%"
          duration={1}
          delay={0.5}
          animationType="wave"
          className="w-28 h-auto md:w-36"
        />
      )}
    </div>
  );
};

export default BalloonsGridPage;