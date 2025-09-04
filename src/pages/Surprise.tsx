"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import ParticlesBackground from "@/components/ParticlesBackground";
import GiftBox from "@/components/GiftBox";
import Confetti from "@/components/Confetti";
import AudioPlayer from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye } from "lucide-react";
import GiftBurst from "@/components/GiftBurst";
import Bomb from "@/components/Bomb";
import CountdownTimer from "@/components/CountdownTimer";
import Mail from "@/components/Mail";
import AnimeCharacterSVG from "@/components/AnimeCharacterSVG"; // Import AnimeCharacterSVG

type AnimationPhase = "gift" | "bombThrown" | "timerCountdown" | "explosion" | "finalMessage";

const Surprise = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("gift");
  const [bombPosition, setBombPosition] = useState<{ x: number; y: number } | null>(null);
  const [explosionOrigin, setExplosionOrigin] = useState<{ x: number; y: number } | null>(null);
  const [isGiftBurstFading, setIsGiftBurstFading] = useState(false);
  const [showFindMailText, setShowFindMailText] = useState(false);

  const finalGiftRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const replayButtonRef = useRef<HTMLButtonElement>(null);
  const revealButtonRef = useRef<HTMLButtonElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const findMailTextRef = useRef<HTMLDivElement>(null);

  const birthdayMessage = `Happy Birthday, ${name}! May your day be as bright and beautiful as your smile. Wishing you all the love and happiness in the world.`;

  useEffect(() => {
    if (location.state?.phase === 'finalMessage') {
      setAnimationPhase('finalMessage');
      setBombPosition(null);
      setExplosionOrigin(null);
      setIsGiftBurstFading(false);
      setShowFindMailText(false);
    }
  }, [location.state]);

  useEffect(() => {
    if (animationPhase === "finalMessage") {
      const gift = finalGiftRef.current;
      const message = messageRef.current;
      const revealButton = revealButtonRef.current;
      const replayButton = replayButtonRef.current;

      if (!gift || !message || !revealButton || !replayButton) return;

      gsap.set(revealButton, { opacity: 0, y: 20, pointerEvents: 'none' });
      gsap.set(replayButton, { opacity: 0, y: 20, pointerEvents: 'none' });
      gsap.set(message, { filter: 'blur(16px)' });

      const letters = message.querySelectorAll('span');
      gsap.timeline()
        .fromTo(gift, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'bounce.out' })
        .to(gift, { scale: 1.5, opacity: 0, duration: 0.5, ease: 'power2.in' })
        .fromTo(letters, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' }, "-=0.2")
        .to(revealButton, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.5, ease: 'power2.out' }, "+=0.5");
    }
  }, [animationPhase]);

  const handleGiftOpen = useCallback((position: { x: number; y: number }) => {
    setBombPosition(position);
    setAnimationPhase("bombThrown");
  }, []);

  const handleBombClick = useCallback((position: { x: number; y: number }) => {
    setExplosionOrigin(position);
    setAnimationPhase("timerCountdown");
  }, []);

  const handleTimerComplete = useCallback(() => {
    setAnimationPhase("explosion");
    setShowFindMailText(true);
  }, []);

  const handleMailClick = useCallback(() => {
    setIsGiftBurstFading(true);
    setShowFindMailText(false);
  }, []);

  const handleMailOpenComplete = useCallback(() => {
    navigate(`/mail-content/${name}`, { state: { fromMailOpen: true } });
  }, [name, navigate]);

  const handleGiftBurstFadeOutComplete = useCallback(() => {
    setIsGiftBurstFading(false);
    setShowFindMailText(false);
  }, []);

  const handleReplay = useCallback(() => {
    setAnimationPhase('gift');
    setBombPosition(null);
    setExplosionOrigin(null);
    setIsGiftBurstFading(false);
    setShowFindMailText(false);
    if (mainContentRef.current) {
        gsap.set(mainContentRef.current, { opacity: 1, display: 'flex' });
    }
  }, []);

  const handleReveal = useCallback(() => {
    const message = messageRef.current;
    const revealButton = revealButtonRef.current;
    const replayButton = replayButtonRef.current;

    if (message && revealButton && replayButton) {
      const gradientClasses = ['bg-clip-text', 'text-transparent', 'bg-gradient-to-r', 'from-pink-400', 'via-purple-400', 'to-cyan-400'];

      const tl = gsap.timeline();
      tl.to(revealButton, { opacity: 0, y: -20, pointerEvents: 'none', duration: 0.5, ease: 'power2.in' })
        .to(message, {
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power2.out',
          onStart: () => {
            message.classList.remove(...gradientClasses);
            message.classList.add('text-cyan-300');
            message.style.textShadow = '0 0 15px rgba(0, 255, 255, 0.7)';
          }
        }, 0)
        .to(message, {
          filter: 'blur(16px)',
          duration: 1.5,
          ease: 'power2.inOut',
          delay: 9.5,
          onStart: () => {
            message.classList.add(...gradientClasses);
            message.classList.remove('text-cyan-300');
            message.style.textShadow = '0 0 10px rgba(255,255,255,0.5)';
          }
        })
        .to(replayButton, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.5, ease: 'power2.out' });
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <ParticlesBackground />
      <AudioPlayer src="/birthday-music.mp3" />

      {/* Phase: Gift Box */}
      {animationPhase === 'gift' && (
        <div ref={mainContentRef} className="relative z-10 flex flex-col items-center justify-center text-center text-white w-full h-full">
          <AnimeCharacterSVG
            expression="default"
            characterColor="#87CEEB" // Light blue color
            alt="Gift Anime Character"
            initialX="100%"
            initialY="20%"
            targetX="80%"
            targetY="20%"
            duration={1.2}
            delay={0.8}
            animationType="float"
            className="w-28 h-auto md:w-36"
          />
          <div className="flex flex-col items-center animate-fade-in-down">
            <h1 className="text-4xl md:text-6xl font-anime font-bold mb-8 text-yellow-200 drop-shadow-[0_0_10px_rgba(255,255,0,0.7)]">A special gift for you, {name}!</h1>
            <GiftBox onOpen={handleGiftOpen} />
          </div>
        </div>
      )}

      {/* Phase: Bomb Thrown */}
      {animationPhase === 'bombThrown' && bombPosition && (
        <>
          <Bomb initialX={bombPosition.x} initialY={bombPosition.y} onBombClick={handleBombClick} />
          <AnimeCharacterSVG
            expression="surprised"
            characterColor="#FFD700" // Gold color
            alt="Surprised Anime Character"
            initialX="50%"
            initialY="100%"
            targetX="50%"
            targetY="70%"
            duration={0.8}
            delay={0.2}
            animationType="popIn"
            className="w-28 h-auto md:w-36"
            style={{ transform: 'translateX(-50%)' }} // Center horizontally
          />
        </>
      )}

      {/* Phase: Timer Countdown */}
      {animationPhase === 'timerCountdown' && (
        <>
          <CountdownTimer onComplete={handleTimerComplete} />
          <AnimeCharacterSVG
            expression="anxious"
            characterColor="#ADFF2F" // Green color
            alt="Anxious Anime Character"
            initialX="100%"
            initialY="50%"
            targetX="85%"
            targetY="50%"
            duration={0.8}
            delay={0.1}
            animationType="slideIn"
            className="w-24 h-auto md:w-32"
          />
        </>
      )}

      {/* Phase: Explosion (particles and mail appear together) */}
      {animationPhase === 'explosion' && explosionOrigin && (
        <>
          <GiftBurst
            originX={explosionOrigin.x}
            originY={explosionOrigin.y}
            fadeAway={isGiftBurstFading}
            onFadeOutComplete={handleGiftBurstFadeOutComplete}
          />
          <Mail
            explosionOrigin={explosionOrigin}
            onMailClick={handleMailClick}
            onMailOpenComplete={handleMailOpenComplete}
          />
          {showFindMailText && (
            <div
              ref={findMailTextRef}
              className="absolute inset-0 flex flex-col items-center justify-start pt-20 z-40 text-white text-4xl md:text-5xl font-anime font-bold animate-fade-in-down"
              style={{ textShadow: '0 0 15px rgba(255,105,180,0.8), 0 0 30px rgba(135,206,250,0.7)' }}
            >
              Find a mail box!
            </div>
          )}
          <AnimeCharacterSVG
            expression="celebrating"
            characterColor="#FF4500" // Orange-red color
            alt="Celebrating Anime Character"
            initialX="-100px"
            initialY="50%"
            targetX="15%"
            targetY="50%"
            duration={1}
            delay={0.5}
            animationType="wave"
            className="w-28 h-auto md:w-36"
          />
        </>
      )}

      {/* Phase: Final Message */}
      {animationPhase === "finalMessage" && (
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white w-full h-full">
          <div ref={finalGiftRef} className="text-8xl">🎁</div>
          {finalGiftRef.current && gsap.getProperty(finalGiftRef.current, "opacity") === 0 && <Confetti />}
          <div
            ref={messageRef}
            className="font-anime text-4xl md:text-6xl max-w-3xl p-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400"
            style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
          >
            {birthdayMessage.split('').map((char, index) => <span key={index} className="inline-block opacity-0">{char === ' ' ? '\u00A0' : char}</span>)}
          </div>
          <div className="mt-8 h-12 relative min-w-[240px]">
            <Button ref={revealButtonRef} onClick={handleReveal} className="absolute inset-0 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300 font-anime">
              <Eye className="mr-2 h-4 w-4" /> Reveal Message
            </Button>
            <Button ref={replayButtonRef} onClick={handleReplay} className="absolute inset-0 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300 font-anime">
              <RefreshCw className="mr-2 h-4 w-4" /> Replay
            </Button>
          </div>
          <AnimeCharacterSVG
            expression="celebrating"
            characterColor="#FFC0CB" // Pink color
            alt="Wishing Anime Character"
            initialX="100%"
            initialY="80%"
            targetX="85%"
            targetY="80%"
            duration={1.5}
            delay={0.5}
            animationType="wave"
            className="w-32 h-auto md:w-48"
          />
        </div>
      )}
    </div>
  );
};

export default Surprise;